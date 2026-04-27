"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { nextCustomerCode } from "@/lib/code";
import { requireUser } from "@/lib/auth";

import type { Gender, MeasurementKategori } from "@/lib/config";

export type Kategori = MeasurementKategori;

export type UkuranInput = {
  judul: string;
  kategori: Kategori;
  catatan?: string;
  // Atasan
  lingkarLeher?: number;
  lebarBahu?: number;
  lingkarDada?: number;
  lingkarPinggang?: number;
  panjangLengan?: number;
  panjangBaju?: number;
  // Bawahan
  lingkarPinggul?: number;
  lingkarPaha?: number;
  panjangCelana?: number;
  // Standar
  ukuranStandar?: string;
};

function cleanUkuran(u: UkuranInput) {
  return {
    judul: u.judul.trim(),
    kategori: u.kategori,
    catatan: u.catatan?.trim() || null,
    lingkarLeher: u.lingkarLeher ?? null,
    lebarBahu: u.lebarBahu ?? null,
    lingkarDada: u.lingkarDada ?? null,
    lingkarPinggang: u.lingkarPinggang ?? null,
    panjangLengan: u.panjangLengan ?? null,
    panjangBaju: u.panjangBaju ?? null,
    lingkarPinggul: u.lingkarPinggul ?? null,
    lingkarPaha: u.lingkarPaha ?? null,
    panjangCelana: u.panjangCelana ?? null,
    ukuranStandar: u.ukuranStandar?.trim() || null,
  };
}

export async function createPelangganAction(input: {
  nama: string;
  noWa: string;
  alamat: string;
  gender: Gender;
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
        create: input.ukuran.filter((u) => u.judul.trim()).map(cleanUkuran),
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
    gender: Gender;
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
  return { ok: true as const };
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
  return { ok: true as const };
}

export async function addUkuranAction(code: string, input: UkuranInput) {
  await requireUser();
  const cust = await prisma.customer.findUnique({ where: { code } });
  if (!cust) return { error: "Pelanggan tidak ditemukan" };
  if (!input.judul.trim()) return { error: "Judul ukuran wajib diisi" };

  await prisma.measurement.create({
    data: { customerId: cust.id, ...cleanUkuran(input) },
  });
  revalidatePath(`/pelanggan/${code}`);
  return { ok: true as const };
}

export async function updateUkuranAction(
  code: string,
  ukuranId: string,
  input: UkuranInput
) {
  await requireUser();
  if (!input.judul.trim()) return { error: "Judul ukuran wajib diisi" };
  await prisma.measurement.update({
    where: { id: ukuranId },
    data: cleanUkuran(input),
  });
  revalidatePath(`/pelanggan/${code}`);
  return { ok: true as const };
}

export async function deleteUkuranAction(code: string, ukuranId: string) {
  await requireUser();
  await prisma.measurement.delete({ where: { id: ukuranId } });
  revalidatePath(`/pelanggan/${code}`);
  return { ok: true as const };
}
