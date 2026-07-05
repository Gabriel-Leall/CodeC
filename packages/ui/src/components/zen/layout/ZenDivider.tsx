import { HankoMarkSvg, SumiDividerSvg } from "@kodan/ui/assets/zen/sumi-strokes";
import { cn } from "@kodan/ui/lib/utils";

type ZenDividerProps = {
  variant?: "brush" | "bamboo" | "seal" | "sumi";
  className?: string;
};

export function ZenDivider({ variant = "brush", className }: ZenDividerProps) {
  if (variant === "seal") {
    return (
      <div className={cn("flex items-center gap-3 text-[color:var(--zen-hanko)]", className)} aria-hidden="true">
        <span className="h-px flex-1 bg-[color:color-mix(in_oklch,var(--zen-hanko)_35%,transparent)]" />
        <HankoMarkSvg className="size-5" />
        <span className="h-px flex-1 bg-[color:color-mix(in_oklch,var(--zen-hanko)_35%,transparent)]" />
      </div>
    );
  }

  if (variant === "bamboo") {
    return (
      <div
        className={cn(
          "h-2 bg-[repeating-linear-gradient(90deg,color-mix(in_oklch,var(--zen-moss)_38%,transparent)_0_1px,transparent_1px_18px)]",
          className,
        )}
        aria-hidden="true"
      />
    );
  }

  if (variant === "sumi") {
    return (
      <div
        className={cn("h-px bg-[color:color-mix(in_oklch,var(--zen-ink)_28%,transparent)]", className)}
        aria-hidden="true"
      />
    );
  }

  return <SumiDividerSvg className={cn("h-5 w-full text-[color:var(--zen-ink)] opacity-45", className)} />;
}
