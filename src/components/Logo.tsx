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
      <div
        className={cn(
          "grid place-items-center rounded-xl font-bold",
          dim,
          isLight ? "bg-white text-brand-600" : "bg-brand-600 text-white"
        )}
      >
        <span className={size === "lg" ? "text-xl" : "text-base"}>
          {BRAND.logoText}
        </span>
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
