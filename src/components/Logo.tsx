import Image from "next/image";
import { cn } from "@/lib/cn";
import { BRAND } from "@/lib/config";

export function Logo({
  withTagline = false,
  variant = "dark",
  size = "md",
}: {
  withTagline?: boolean;
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
}) {
  const isLight = variant === "light";
  const dim = size === "lg" ? "h-12 w-12" : size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const txt = size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-2xl";

  return (
    <div className="flex items-center gap-2">
      <div className={cn("flex-shrink-0", dim)}>
        <Image src="/logo-sijah.png" alt="Sijah Logo" width={70} height={68} className="w-full h-full object-contain" />
      </div>
      <div className="leading-tight">
        <p
          className={cn(
            "font-semibold",
            txt,
            isLight ? "text-white" : "text-brand-600"
          )}
        >
          {BRAND.shortName}
        </p>
        {withTagline && (
          <p
            className={cn(
              "text-[11px] -mt-0.5",
              isLight ? "text-white/80" : "text-ink-500"
            )}
          >
            {BRAND.tagline}
          </p>
        )}
      </div>
    </div>
  );
}
