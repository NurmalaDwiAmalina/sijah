import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const nama = searchParams.get("nama")?.trim();
    const noWa = searchParams.get("noWa")?.trim();

    if (!nama || !noWa) {
      return NextResponse.json([], { status: 200 });
    }

    const orders = await prisma.order.findMany({
      where: {
        AND: [
          { snapshotNama: { contains: nama } },
          { snapshotNoWa: { contains: noWa } },
        ],
      },
      include: { payments: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error searching orders:", error);
    return NextResponse.json([], { status: 500 });
  }
}
