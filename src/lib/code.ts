import { prisma } from "./db";

async function nextNumber(prefix: "P" | "S" | "PAY") {
  const last =
    prefix === "P"
      ? await prisma.customer.findFirst({ orderBy: { code: "desc" }, select: { code: true } })
      : prefix === "S"
      ? await prisma.order.findFirst({ orderBy: { code: "desc" }, select: { code: true } })
      : await prisma.payment.findFirst({ orderBy: { code: "desc" }, select: { code: true } });

  const padding = prefix === "PAY" ? 5 : 4;
  if (!last?.code) return `${prefix}${"0".repeat(padding - 1)}1`;

  const n = parseInt(last.code.slice(prefix.length), 10) + 1;
  return `${prefix}${n.toString().padStart(padding, "0")}`;
}

export const nextCustomerCode = () => nextNumber("P");
export const nextOrderCode = () => nextNumber("S");
export const nextPaymentCode = () => nextNumber("PAY");
