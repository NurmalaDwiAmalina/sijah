import { prisma } from "./db";
import { CODE_PREFIX } from "./config";

type Kind = keyof typeof CODE_PREFIX;

async function nextNumber(kind: Kind) {
  const { prefix, padding } = CODE_PREFIX[kind];

  const last =
    kind === "customer"
      ? await prisma.customer.findFirst({ orderBy: { code: "desc" }, select: { code: true } })
      : kind === "order"
      ? await prisma.order.findFirst({ orderBy: { code: "desc" }, select: { code: true } })
      : await prisma.payment.findFirst({ orderBy: { code: "desc" }, select: { code: true } });

  if (!last?.code) return `${prefix}${"0".repeat(padding - 1)}1`;
  const n = parseInt(last.code.slice(prefix.length), 10) + 1;
  return `${prefix}${n.toString().padStart(padding, "0")}`;
}

export const nextCustomerCode = () => nextNumber("customer");
export const nextOrderCode = () => nextNumber("order");
export const nextPaymentCode = () => nextNumber("payment");
