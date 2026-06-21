import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { nextOrderCode } from "@/lib/code";

const num = (v: unknown) =>
  v === undefined || v === null || v === "" ? undefined : parseFloat(String(v));

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerId,
      judul,
      catatan,
      tglEstimasi,
      fotoReferensi,
      items,
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
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Dukung banyak produk dalam satu pesanan. Kompatibel mundur: kalau yang
    // dikirim masih `measurements` tunggal, bungkus jadi satu item.
    const itemList: any[] = Array.isArray(items) && items.length > 0
      ? items
      : measurements
      ? [measurements]
      : [];

    if (itemList.length === 0) {
      return NextResponse.json(
        { error: "Minimal satu produk" },
        { status: 400 }
      );
    }

    // Buat Measurement untuk tiap produk, lalu rangkai jadi OrderItem.
    // Harga belum diketahui saat pesanan dari pelanggan, jadi 0 dulu (admin
    // mengisi harga lewat form edit).
    const orderItemsCreate = [];
    for (const it of itemList) {
      const measurement = await prisma.measurement.create({
        data: {
          customerId,
          judul: it.judul || "Ukuran",
          kategori: it.kategori || "Atasan",
          lingkarLeher: num(it.lingkarLeher),
          lebarBahu: num(it.lebarBahu),
          lingkarDada: num(it.lingkarDada),
          lingkarPinggang: num(it.lingkarPinggang),
          panjangLengan: num(it.panjangLengan),
          panjangBaju: num(it.panjangBaju),
          lingkarPinggul: num(it.lingkarPinggul),
          lingkarPaha: num(it.lingkarPaha),
          panjangCelana: num(it.panjangCelana),
          catatan: it.catatan || "",
        },
      });

      const jumlah = Math.max(1, parseInt(String(it.jumlah ?? 1), 10) || 1);

      orderItemsCreate.push({
        measurementId: measurement.id,
        judulUkuran: measurement.judul,
        catatan: measurement.catatan ?? null,
        jumlah,
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
      });
    }

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
        items: { create: orderItemsCreate },
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
