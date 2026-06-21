"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { nextOrderCode } from "@/lib/code";
import { requireUser } from "@/lib/auth";
import { parseDate } from "@/lib/format";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/lib/config";

export type ItemInput = {
  measurementId: string;
  jumlah: number;
  hargaSatuan: number;
};

export type BiayaInput = {
  label: string;
  amount: number;
};

export async function createPesananAction(input: {
  judul: string;
  customerCode: string;
  tglMasuk: string;
  tglEstimasi: string;
  catatan?: string;
  fotoReferensi?: string | null;
  status?: string;
  statusBayar?: string;
  items: ItemInput[];
  biaya: BiayaInput[];
}) {
  await requireUser();
  if (!input.judul.trim()) return { error: "Judul pesanan wajib diisi" };
  if (!input.customerCode) return { error: "Pelanggan wajib dipilih" };
  if (input.items.length === 0)
    return { error: "Minimal pilih satu ukuran" };

  const initialStatus = input.status ?? ORDER_STATUS[0]; // default: Antrean
  const initialStatusBayar = input.statusBayar ?? PAYMENT_STATUS[0]; // default: Belum Bayar

  const customer = await prisma.customer.findUnique({
    where: { code: input.customerCode },
    include: { measurements: true },
  });
  if (!customer) return { error: "Pelanggan tidak ditemukan" };

  const measurementMap = new Map(customer.measurements.map((m) => [m.id, m]));

  const itemsData = input.items.map((it) => {
    const m = measurementMap.get(it.measurementId);
    if (!m) throw new Error("Ukuran tidak valid");
    return {
      measurementId: m.id,
      judulUkuran: m.judul,
      catatan: m.catatan ?? null,
      jumlah: it.jumlah,
      hargaSatuan: it.hargaSatuan,
      subTotal: it.jumlah * it.hargaSatuan,
      snapshotData: JSON.stringify({
        lingkarLeher: m.lingkarLeher,
        lebarBahu: m.lebarBahu,
        lingkarDada: m.lingkarDada,
        lingkarPinggang: m.lingkarPinggang,
        lingkarPinggul: m.lingkarPinggul,
        panjangLengan: m.panjangLengan,
        panjangBaju: m.panjangBaju,
      }),
    };
  });

  const subtotal = itemsData.reduce((a, b) => a + b.subTotal, 0);
  const biayaTotal = input.biaya.reduce((a, b) => a + b.amount, 0);
  const total = subtotal + biayaTotal;

  const code = await nextOrderCode();

  const order = await prisma.order.create({
    data: {
      code,
      judul: input.judul.trim(),
      customerId: customer.id,
      tglMasuk: parseDate(input.tglMasuk),
      tglEstimasi: parseDate(input.tglEstimasi),
      catatan: input.catatan?.trim() || null,
      fotoReferensi: input.fotoReferensi || null,
      status: initialStatus,
      statusBayar: initialStatusBayar,
      totalHarga: total,
      snapshotNama: customer.nama,
      snapshotNoWa: customer.noWa,
      items: { create: itemsData },
      additionalCosts: {
        create: input.biaya
          .filter((b) => b.label.trim())
          .map((b) => ({ label: b.label.trim(), amount: b.amount })),
      },
    },
  });

  revalidatePath("/pesanan");
  revalidatePath("/dashboard");
  redirect(`/pesanan`);
}

export async function updateStatusPesananAction(
  code: string,
  status: string
) {
  await requireUser();
  await prisma.order.update({ where: { code }, data: { status } });
  revalidatePath("/pesanan");
  revalidatePath("/dashboard");
  return { ok: true as const };
}

export async function updatePesananAction(
  code: string,
  input: {
    judul: string;
    customerCode: string;
    tglMasuk: string;
    tglEstimasi: string;
    catatan?: string;
    fotoReferensi?: string | null;
    status?: string;
    items: ItemInput[];
    biaya: BiayaInput[];
  }
) {
  await requireUser();
  if (!input.judul.trim()) return { error: "Judul pesanan wajib diisi" };
  if (!input.customerCode) return { error: "Pelanggan wajib dipilih" };
  if (input.items.length === 0) return { error: "Minimal pilih satu ukuran" };

  const existing = await prisma.order.findUnique({ where: { code } });
  if (!existing) return { error: "Pesanan tidak ditemukan" };

  const customer = await prisma.customer.findUnique({
    where: { code: input.customerCode },
    include: { measurements: true },
  });
  if (!customer) return { error: "Pelanggan tidak ditemukan" };

  // Mengganti pelanggan pada pesanan yang sudah punya pembayaran akan membuat
  // pembayaran lama (atas nama pelanggan lama) salah atribusi. Blokir.
  if (customer.id !== existing.customerId) {
    const paymentCount = await prisma.payment.count({
      where: { orderId: existing.id },
    });
    if (paymentCount > 0) {
      return {
        error:
          "Tidak bisa mengganti pelanggan pada pesanan yang sudah memiliki pembayaran",
      };
    }
  }

  const measurementMap = new Map(customer.measurements.map((m) => [m.id, m]));

  const itemsData = input.items.map((it) => {
    const m = measurementMap.get(it.measurementId);
    if (!m) throw new Error("Ukuran tidak valid");
    return {
      measurementId: m.id,
      judulUkuran: m.judul,
      catatan: m.catatan ?? null,
      jumlah: it.jumlah,
      hargaSatuan: it.hargaSatuan,
      subTotal: it.jumlah * it.hargaSatuan,
      snapshotData: JSON.stringify({
        lingkarLeher: m.lingkarLeher,
        lebarBahu: m.lebarBahu,
        lingkarDada: m.lingkarDada,
        lingkarPinggang: m.lingkarPinggang,
        lingkarPinggul: m.lingkarPinggul,
        panjangLengan: m.panjangLengan,
        panjangBaju: m.panjangBaju,
      }),
    };
  });

  // Item "yatim" (ukuran/measurement-nya sudah dihapus, jadi measurementId
  // null) tidak bisa ditampilkan/diedit lewat form. Pertahankan item ini agar
  // nilainya tidak hilang saat item lain di-replace.
  const orphanItems = await prisma.orderItem.findMany({
    where: { orderId: existing.id, measurementId: null },
  });
  const orphanSubtotal = orphanItems.reduce((a, b) => a + b.subTotal, 0);

  const subtotal = itemsData.reduce((a, b) => a + b.subTotal, 0);
  const biayaTotal = input.biaya.reduce((a, b) => a + b.amount, 0);
  const total = subtotal + orphanSubtotal + biayaTotal;

  // statusBayar selalu dihitung dari pembayaran (bukan diinput manual). Saat
  // totalHarga berubah, status bisa bergeser (mis. dari Lunas → DP).
  const payments = await prisma.payment.findMany({
    where: { orderId: existing.id },
  });
  const dibayar = payments.reduce((a, b) => a + b.jumlah, 0);
  const [BELUM, DP, LUNAS] = PAYMENT_STATUS;
  const statusBayar =
    total > 0 && dibayar >= total ? LUNAS : dibayar > 0 ? DP : BELUM;

  // Ganti item (yang punya measurement) & biaya sepenuhnya agar sinkron dengan
  // form (mirip create). Item yatim sengaja tidak ikut dihapus.
  await prisma.$transaction([
    prisma.orderItem.deleteMany({
      where: { orderId: existing.id, measurementId: { not: null } },
    }),
    prisma.additionalCost.deleteMany({ where: { orderId: existing.id } }),
    prisma.order.update({
      where: { id: existing.id },
      data: {
        judul: input.judul.trim(),
        customerId: customer.id,
        tglMasuk: parseDate(input.tglMasuk),
        tglEstimasi: parseDate(input.tglEstimasi),
        catatan: input.catatan?.trim() || null,
        fotoReferensi: input.fotoReferensi || null,
        status: input.status ?? existing.status,
        statusBayar,
        totalHarga: total,
        snapshotNama: customer.nama,
        snapshotNoWa: customer.noWa,
        items: { create: itemsData },
        additionalCosts: {
          create: input.biaya
            .filter((b) => b.label.trim())
            .map((b) => ({ label: b.label.trim(), amount: b.amount })),
        },
      },
    }),
  ]);

  revalidatePath("/pesanan");
  revalidatePath(`/pesanan/${code}`);
  revalidatePath("/dashboard");
  return { ok: true as const };
}

export async function deletePesananAction(code: string) {
  await requireUser();
  await prisma.order.delete({ where: { code } });
  revalidatePath("/pesanan");
  revalidatePath("/dashboard");
  redirect("/pesanan");
}
