import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const palette: Record<string, string> = {
  "Antrean": "bg-[#DFDFDF] text-[#504F4F]",
  "Potong Kain": "bg-[#DAEEFF] text-[#008BFF]",
  "Dijahit": "bg-[#FFEDB1] text-[#FFB62E]",
  "Fitting": "bg-[#DEFFA7] text-[#019537]",
  "Selesai": "bg-[#DEFFA7] text-[#019537]",
  "Diambil": "bg-[#DEFFA7] text-[#019537]",
  "Dibatalkan": "bg-[#FFD1C9] text-[#FF4B4B]",
  "Laki-laki": "bg-[#DAEEFF] text-[#008BFF]",
  "Perempuan": "bg-[#FFD1C9] text-[#FF4B4B]",
  "Lunas": "bg-[#DEFFA7] text-[#019537]",
  "DP": "bg-[#FFEDB1] text-[#FFB62E]",
  "Belum Bayar": "bg-[#FFD1C9] text-[#FF4B4B]",
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
