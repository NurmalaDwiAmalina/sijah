import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { nextOrderCode } from "@/lib/code";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerId,
      judul,
      catatan,
      tglEstimasi,
      fotoReferensi,
      measurements,
    } = body;

    if (!customerId || !judul || !tglEstimasi) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const num = (v: unknown) =>
      v === undefined || v === null || v === "" ? undefined : parseFloat(String(v));

    // Create measurement if provided (decimal-aware)
    let measurement = null;
    if (measurements) {
      measurement = await prisma.measurement.create({
        data: {
          customerId,
          judul: measurements.judul || "Ukuran Default",
          kategori: measurements.kategori || "Atasan",
          lingkarLeher: num(measurements.lingkarLeher),
          lebarBahu: num(measurements.lebarBahu),
          lingkarDada: num(measurements.lingkarDada),
          lingkarPinggang: num(measurements.lingkarPinggang),
          panjangLengan: num(measurements.panjangLengan),
          panjangBaju: num(measurements.panjangBaju),
          lingkarPinggul: num(measurements.lingkarPinggul),
          lingkarPaha: num(measurements.lingkarPaha),
          panjangCelana: num(measurements.panjangCelana),
          catatan: measurements.catatan || "",
        },
      });
    }

    // Create order — tautkan ukuran sebagai OrderItem agar muncul di detail
    // admin. Harga belum diketahui saat pesanan dari pelanggan, jadi 0 dulu
    // (admin mengisi totalHarga lewat form edit).
    const code = await nextOrderCode();
    const order = await prisma.order.create({
      data: {
        code,
        customerId,
        judul,
        catatan,
        tglMasuk: new Date(),
        tglEstimasi: new Date(tglEstimasi),
        fotoReferensi: fotoReferensi || null,
        status: "Antrean",
        statusBayar: "Belum Bayar",
        totalHarga: 0,
        snapshotNama: customer.nama,
        snapshotNoWa: customer.noWa,
        ...(measurement && {
          items: {
            create: {
              measurementId: measurement.id,
              judulUkuran: measurement.judul,
              catatan: measurement.catatan ?? null,
              jumlah: 1,
              hargaSatuan: 0,
              subTotal: 0,
              snapshotData: JSON.stringify({
                kategori: measurement.kategori,
                lingkarLeher: measurement.lingkarLeher,
                lebarBahu: measurement.lebarBahu,
                lingkarDada: measurement.lingkarDada,
                lingkarPinggang: measurement.lingkarPinggang,
                panjangLengan: measurement.panjangLengan,
                panjangBaju: measurement.panjangBaju,
                lingkarPinggul: measurement.lingkarPinggul,
                lingkarPaha: measurement.lingkarPaha,
                panjangCelana: measurement.panjangCelana,
              }),
            },
          },
        }),
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
