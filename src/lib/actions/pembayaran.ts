"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { nextPaymentCode } from "@/lib/code";
import { requireUser } from "@/lib/auth";
import { PAYMENT_STATUS, type PaymentMethod, type PaymentStatus } from "@/lib/config";
import { formatRupiah } from "@/lib/format";

async function recalcOrderStatusBayar(orderId: string) {
  const [order, payments] = await Promise.all([
    prisma.order.findUnique({ where: { id: orderId } }),
    prisma.payment.findMany({ where: { orderId } }),
  ]);
  if (!order) return;
  const total = payments.reduce((a, b) => a + b.jumlah, 0);
  const [BELUM, DP, LUNAS] = PAYMENT_STATUS;
  let statusBayar: PaymentStatus = BELUM;
  // Lunas hanya jika order sudah punya harga (totalHarga > 0) dan terbayar penuh.
  if (order.totalHarga > 0 && total >= order.totalHarga) statusBayar = LUNAS;
  else if (total > 0) statusBayar = DP;
  await prisma.order.update({ where: { id: orderId }, data: { statusBayar } });
}

export async function createPembayaranAction(input: {
  orderCode: string;
  jumlah: number;
  metode: PaymentMethod;
  catatan?: string;
}) {
  await requireUser();
  if (!input.orderCode) return { error: "ID Pesanan wajib dipilih" };
  if (input.jumlah <= 0) return { error: "Jumlah bayar harus > 0" };
  if (!input.metode) return { error: "Pilih metode pembayaran" };

  const order = await prisma.order.findUnique({
    where: { code: input.orderCode },
    include: { payments: true },
  });
  if (!order) return { error: "Pesanan tidak ditemukan" };

  // Cegah pembayaran melebihi sisa tagihan (hanya jika order sudah diberi harga).
  if (order.totalHarga > 0) {
    const sudah = order.payments.reduce((a, b) => a + b.jumlah, 0);
    const sisa = order.totalHarga - sudah;
    if (input.jumlah > sisa) {
      return { error: `Jumlah melebihi sisa tagihan (${formatRupiah(sisa)})` };
    }
  }

  const code = await nextPaymentCode();
  await prisma.payment.create({
    data: {
      code,
      orderId: order.id,
      jumlah: input.jumlah,
      metode: input.metode,
      catatan: input.catatan?.trim() || null,
    },
  });

  await recalcOrderStatusBayar(order.id);
  revalidatePath("/pembayaran");
  revalidatePath("/dashboard");
  revalidatePath("/pesanan");
  redirect("/pembayaran");
}

export async function updatePembayaranAction(
  code: string,
  input: { jumlah: number; metode: PaymentMethod; catatan?: string }
) {
  await requireUser();
  const p = await prisma.payment.findUnique({ where: { code } });
  if (!p) return { error: "Pembayaran tidak ditemukan" };
  if (input.jumlah <= 0) return { error: "Jumlah bayar harus > 0" };

  // Cegah edit yang membuat total pembayaran melebihi tagihan.
  const order = await prisma.order.findUnique({
    where: { id: p.orderId },
    include: { payments: true },
  });
  if (order && order.totalHarga > 0) {
    const dibayarLain = order.payments
      .filter((x) => x.id !== p.id)
      .reduce((a, b) => a + b.jumlah, 0);
    const sisa = order.totalHarga - dibayarLain;
    if (input.jumlah > sisa) {
      return { error: `Jumlah melebihi sisa tagihan (${formatRupiah(sisa)})` };
    }
  }

  await prisma.payment.update({
    where: { id: p.id },
    data: {
      jumlah: input.jumlah,
      metode: input.metode,
      catatan: input.catatan?.trim() || null,
    },
  });
  await recalcOrderStatusBayar(p.orderId);
  revalidatePath("/pembayaran");
  revalidatePath("/dashboard");
  revalidatePath("/pesanan");
  return { ok: true };
}

export async function deletePembayaranAction(code: string) {
  await requireUser();
  const p = await prisma.payment.findUnique({ where: { code } });
  if (!p) return { error: "Pembayaran tidak ditemukan" };
  const orderId = p.orderId;
  await prisma.payment.delete({ where: { id: p.id } });
  await recalcOrderStatusBayar(orderId);
  revalidatePath("/pembayaran");
  revalidatePath("/dashboard");
  revalidatePath("/pesanan");
  return { ok: true };
}
