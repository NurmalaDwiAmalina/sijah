import { prisma } from "./db";

async function nextNumber(prefix: "P" | "S") {
  const last =
    prefix === "P"
      ? await prisma.customer.findFirst({
          orderBy: { code: "desc" },
          select: { code: true },
        })
      : await prisma.order.findFirst({
          orderBy: { code: "desc" },
          select: { code: true },
        });

  if (!last?.code) return `${prefix}0001`;
  const n = parseInt(last.code.slice(1), 10) + 1;
  return `${prefix}${n.toString().padStart(4, "0")}`;
}

export const nextCustomerCode = () => nextNumber("P");
export const nextOrderCode = () => nextNumber("S");
