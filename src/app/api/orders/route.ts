import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { nextOrderCode } from "@/lib/code";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerId,
      judul,
      deskripsi,
      tglEstimasi,
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

    // Create measurement if provided
    let measurementId: string | undefined;
    if (measurements) {
      const measurement = await prisma.measurement.create({
        data: {
          customerId,
          judul: measurements.judul || "Ukuran Default",
          kategori: measurements.kategori || "Atasan",
          lingkarLeher: measurements.lingkarLeher ? parseInt(measurements.lingkarLeher) : 0,
          lebarBahu: measurements.lebarBahu ? parseInt(measurements.lebarBahu) : 0,
          lingkarDada: measurements.lingkarDada ? parseInt(measurements.lingkarDada) : 0,
          lingkarPinggang: measurements.lingkarPinggang ? parseInt(measurements.lingkarPinggang) : 0,
          panjangLengan: measurements.panjangLengan ? parseInt(measurements.panjangLengan) : 0,
          panjangBaju: measurements.panjangBaju ? parseInt(measurements.panjangBaju) : 0,
          lingkarPinggul: measurements.lingkarPinggul ? parseInt(measurements.lingkarPinggul) : 0,
          lingkarPaha: measurements.lingkarPaha ? parseInt(measurements.lingkarPaha) : 0,
          panjangCelana: measurements.panjangCelana ? parseInt(measurements.panjangCelana) : 0,
          catatan: measurements.catatan || "",
        },
      });
      measurementId = measurement.id;
    }

    // Create order
    const code = await nextOrderCode();
    const order = await prisma.order.create({
      data: {
        code,
        customerId,
        judul,
        deskripsi,
        tglEstimasi: new Date(tglEstimasi),
        status: "Antrean",
        statusBayar: "Belum Bayar",
        totalHarga: 0,
        snapshotNama: customer.nama,
        snapshotNoWa: customer.noWa,
        snapshotAlamat: customer.alamat,
        snapshotGender: customer.gender,
        measurementId,
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
