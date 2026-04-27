"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { nextCustomerCode } from "@/lib/code";
import { requireUser } from "@/lib/auth";

export type UkuranInput = {
  judul: string;
  catatan?: string;
};

export async function createPelangganAction(input: {
  nama: string;
  noWa: string;
  alamat: string;
  gender: "Laki-laki" | "Perempuan";
  ukuran: UkuranInput[];
}) {
  await requireUser();
  if (!input.nama.trim()) return { error: "Nama wajib diisi" };
  if (!input.noWa.trim()) return { error: "No WA wajib diisi" };
  if (!input.alamat.trim()) return { error: "Alamat wajib diisi" };
  if (!input.gender) return { error: "Gender wajib dipilih" };

  const code = await nextCustomerCode();

  const created = await prisma.customer.create({
    data: {
      code,
      nama: input.nama.trim(),
      noWa: input.noWa.trim(),
      alamat: input.alamat.trim(),
      gender: input.gender,
      measurements: {
        create: input.ukuran
          .filter((u) => u.judul.trim())
          .map((u) => ({
            judul: u.judul.trim(),
            catatan: u.catatan?.trim() || null,
          })),
      },
    },
  });

  revalidatePath("/pelanggan");
  redirect(`/pelanggan/${created.code}`);
}

export async function updatePelangganAction(
  code: string,
  input: {
    nama: string;
    noWa: string;
    alamat: string;
    gender: "Laki-laki" | "Perempuan";
  }
) {
  await requireUser();
  const cust = await prisma.customer.findUnique({ where: { code } });
  if (!cust) return { error: "Pelanggan tidak ditemukan" };

  await prisma.customer.update({
    where: { id: cust.id },
    data: {
      nama: input.nama.trim(),
      noWa: input.noWa.trim(),
      alamat: input.alamat.trim(),
      gender: input.gender,
    },
  });
  revalidatePath("/pelanggan");
  revalidatePath(`/pelanggan/${code}`);
  return { ok: true };
}

export async function deletePelangganAction(code: string) {
  await requireUser();
  const cust = await prisma.customer.findUnique({ where: { code } });
  if (!cust) return { error: "Pelanggan tidak ditemukan" };

  const orderCount = await prisma.order.count({ where: { customerId: cust.id } });
  if (orderCount > 0) {
    return { error: `Tidak dapat menghapus: pelanggan masih punya ${orderCount} pesanan` };
  }

  await prisma.customer.delete({ where: { id: cust.id } });
  revalidatePath("/pelanggan");
  redirect("/pelanggan");
}

export async function addUkuranAction(
  code: string,
  input: { judul: string; catatan?: string }
) {
  await requireUser();
  const cust = await prisma.customer.findUnique({ where: { code } });
  if (!cust) return { error: "Pelanggan tidak ditemukan" };
  if (!input.judul.trim()) return { error: "Judul ukuran wajib diisi" };

  await prisma.measurement.create({
    data: {
      customerId: cust.id,
      judul: input.judul.trim(),
      catatan: input.catatan?.trim() || null,
    },
  });
  revalidatePath(`/pelanggan/${code}`);
  return { ok: true };
}

export async function deleteUkuranAction(code: string, ukuranId: string) {
  await requireUser();
  await prisma.measurement.delete({ where: { id: ukuranId } });
  revalidatePath(`/pelanggan/${code}`);
  return { ok: true };
}
