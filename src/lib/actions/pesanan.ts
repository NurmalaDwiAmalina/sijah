"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { nextOrderCode } from "@/lib/code";
import { requireUser } from "@/lib/auth";
import { parseDate } from "@/lib/format";

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
  items: ItemInput[];
  biaya: BiayaInput[];
}) {
  await requireUser();
  if (!input.judul.trim()) return { error: "Judul pesanan wajib diisi" };
  if (!input.customerCode) return { error: "Pelanggan wajib dipilih" };
  if (input.items.length === 0)
    return { error: "Minimal pilih satu ukuran" };

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
        lingkarPanggul: m.lingkarPanggul,
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
  return { ok: true };
}

export async function deletePesananAction(code: string) {
  await requireUser();
  await prisma.order.delete({ where: { code } });
  revalidatePath("/pesanan");
  revalidatePath("/dashboard");
  redirect("/pesanan");
}
