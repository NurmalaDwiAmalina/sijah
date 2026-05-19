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
    if (measurements) {
      await prisma.measurement.create({
        data: {
          customerId,
          judul: measurements.judul || "Ukuran Default",
          kategori: measurements.kategori || "Atasan",
          lingkarLeher: measurements.lingkarLeher ? parseInt(measurements.lingkarLeher) : undefined,
          lebarBahu: measurements.lebarBahu ? parseInt(measurements.lebarBahu) : undefined,
          lingkarDada: measurements.lingkarDada ? parseInt(measurements.lingkarDada) : undefined,
          lingkarPinggang: measurements.lingkarPinggang ? parseInt(measurements.lingkarPinggang) : undefined,
          panjangLengan: measurements.panjangLengan ? parseInt(measurements.panjangLengan) : undefined,
          panjangBaju: measurements.panjangBaju ? parseInt(measurements.panjangBaju) : undefined,
          lingkarPinggul: measurements.lingkarPinggul ? parseInt(measurements.lingkarPinggul) : undefined,
          lingkarPaha: measurements.lingkarPaha ? parseInt(measurements.lingkarPaha) : undefined,
          panjangCelana: measurements.panjangCelana ? parseInt(measurements.panjangCelana) : undefined,
          catatan: measurements.catatan || "",
        },
      });
    }

    // Create order
    const code = await nextOrderCode();
    const order = await prisma.order.create({
      data: {
        code,
        customerId,
        judul,
        catatan,
        tglMasuk: new Date(),
        tglEstimasi: new Date(tglEstimasi),
        status: "Antrean",
        statusBayar: "Belum Bayar",
        totalHarga: 0,
        snapshotNama: customer.nama,
        snapshotNoWa: customer.noWa,
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
