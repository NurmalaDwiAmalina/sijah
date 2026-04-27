"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export async function createPembayaranAction(input: {
  orderCode: string;
  jumlah: number;
  metode: "Tunai" | "Transfer";
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

  await prisma.payment.create({
    data: {
      orderId: order.id,
      jumlah: input.jumlah,
      metode: input.metode,
    },
  });

  // auto-lunas
  const totalBayar =
    order.payments.reduce((a, b) => a + b.jumlah, 0) + input.jumlah;
  let statusBayar: "Belum Bayar" | "DP" | "Lunas" = "Belum Bayar";
  if (totalBayar >= order.totalHarga) statusBayar = "Lunas";
  else if (totalBayar > 0) statusBayar = "DP";

  await prisma.order.update({
    where: { id: order.id },
    data: { statusBayar },
  });

  revalidatePath("/pembayaran");
  revalidatePath("/dashboard");
  redirect("/pembayaran");
}
