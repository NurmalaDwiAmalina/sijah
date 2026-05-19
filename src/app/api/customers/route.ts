import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { nextCustomerCode } from "@/lib/code";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, noWa, alamat, gender } = body;

    if (!nama || !noWa || !alamat || !gender) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if customer exists
    let customer = await prisma.customer.findFirst({
      where: {
        AND: [
          { nama: { contains: nama } },
          { noWa: { contains: noWa } },
        ],
      },
    });

    // Create new customer if doesn't exist
    if (!customer) {
      const code = await nextCustomerCode();
      customer = await prisma.customer.create({
        data: {
          code,
          nama,
          noWa,
          alamat,
          gender: gender as "Laki-laki" | "Perempuan",
        },
      });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
