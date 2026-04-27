import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  ORDER_STATUS_BADGE,
  PAYMENT_STATUS_BADGE,
  PAYMENT_METHOD_BADGE,
  GENDER_BADGE,
} from "@/lib/config";

const palette: Record<string, string> = {
  ...ORDER_STATUS_BADGE,
  ...PAYMENT_STATUS_BADGE,
  ...PAYMENT_METHOD_BADGE,
  ...GENDER_BADGE,
};

export function StatusBadge({
  value,
  withChevron = true,
}: {
  value: string;
  withChevron?: boolean;
}) {
  const cls = palette[value] ?? "bg-ink-100 text-ink-700";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium",
        cls
      )}
    >
      {value}
      {withChevron && <ChevronDown className="h-3 w-3 opacity-70" />}
    </span>
  );
}
