"use client";

import { HankoMarkSvg } from "@kodan/ui/assets/zen/sumi-strokes";
import { cn } from "@kodan/ui/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type ZenButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children: ReactNode;
  variant?: "ink" | "washi" | "hanko";
};

export function ZenButton({
  className,
  children,
  variant = "ink",
  type = "button",
  ...props
}: ZenButtonProps) {
  const hoverMotion = {
    ink: { x: 1, y: -1 },
    washi: { y: -2, rotate: -0.35 },
    hanko: { scale: 1.035, rotate: -1.25 },
  }[variant];

  return (
    <motion.button
      type={type}
      whileHover={hoverMotion}
      whileTap={variant === "hanko" ? { scale: 0.94, rotate: -2 } : { scale: 0.985 }}
      transition={{ duration: variant === "hanko" ? 0.12 : 0.2, ease: "easeOut" }}
      className={cn(
        "zen-focus group/zen-button relative inline-flex min-h-9 items-center justify-center gap-2 overflow-hidden border text-xs font-semibold tracking-normal transition-[background-color,border-color,color,box-shadow,transform] duration-200 disabled:pointer-events-none disabled:opacity-50",
        variant === "ink" &&
          "rounded-[1px] border-[color:var(--zen-ink)] bg-[color:var(--zen-ink)] px-4 py-2 text-[color:var(--zen-washi)] shadow-[inset_0_-4px_0_color-mix(in_oklch,var(--zen-washi)_10%,transparent)] before:absolute before:inset-y-0 before:left-0 before:w-4 before:bg-[linear-gradient(90deg,color-mix(in_oklch,var(--zen-washi)_18%,transparent),transparent)] after:absolute after:inset-x-2 after:bottom-1 after:h-px after:origin-left after:scale-x-75 after:bg-[color:color-mix(in_oklch,var(--zen-washi)_32%,transparent)] hover:border-[color:var(--zen-moss)] hover:bg-[color:color-mix(in_oklch,var(--zen-ink)_78%,var(--zen-moss))] hover:shadow-[inset_0_-4px_0_color-mix(in_oklch,var(--zen-moss)_56%,transparent),0_9px_22px_color-mix(in_oklch,var(--zen-ink)_22%,transparent)] hover:after:scale-x-100 data-[hover-preview=true]:border-[color:var(--zen-moss)] data-[hover-preview=true]:bg-[color:color-mix(in_oklch,var(--zen-ink)_78%,var(--zen-moss))] data-[hover-preview=true]:shadow-[inset_0_-4px_0_color-mix(in_oklch,var(--zen-moss)_56%,transparent),0_9px_22px_color-mix(in_oklch,var(--zen-ink)_22%,transparent)] data-[hover-preview=true]:after:scale-x-100",
        variant === "washi" &&
          "zen-washi border-[color:var(--zen-border)] px-3.5 py-2 text-[color:var(--zen-ink)] shadow-[inset_3px_0_0_color-mix(in_oklch,var(--zen-ink)_8%,transparent),inset_0_-2px_0_color-mix(in_oklch,var(--zen-ink)_10%,transparent)] before:absolute before:right-0 before:top-0 before:size-3 before:border-b before:border-l before:border-[color:var(--zen-border)] before:bg-[color:color-mix(in_oklch,var(--zen-ink)_4%,transparent)] hover:border-[color:var(--zen-hanko)] hover:text-[color:var(--zen-hanko)] hover:shadow-[inset_3px_0_0_color-mix(in_oklch,var(--zen-hanko)_45%,transparent),inset_0_-3px_0_color-mix(in_oklch,var(--zen-hanko)_34%,transparent),0_8px_20px_color-mix(in_oklch,var(--zen-ink)_12%,transparent)] data-[hover-preview=true]:border-[color:var(--zen-hanko)] data-[hover-preview=true]:text-[color:var(--zen-hanko)] data-[hover-preview=true]:shadow-[inset_3px_0_0_color-mix(in_oklch,var(--zen-hanko)_45%,transparent),inset_0_-3px_0_color-mix(in_oklch,var(--zen-hanko)_34%,transparent),0_8px_20px_color-mix(in_oklch,var(--zen-ink)_12%,transparent)]",
        variant === "hanko" &&
          "min-h-10 border-[color:var(--zen-hanko)] bg-[color:var(--zen-hanko)] px-3 py-2 text-white shadow-[inset_0_0_0_2px_color-mix(in_oklch,white_16%,transparent),inset_0_-3px_0_color-mix(in_oklch,black_20%,transparent)] before:absolute before:inset-1 before:border before:border-[color:color-mix(in_oklch,white_22%,transparent)] hover:bg-[color:color-mix(in_oklch,var(--zen-hanko)_82%,black)] hover:shadow-[inset_0_0_0_2px_color-mix(in_oklch,white_28%,transparent),0_8px_22px_color-mix(in_oklch,var(--zen-hanko)_35%,transparent)] data-[hover-preview=true]:bg-[color:color-mix(in_oklch,var(--zen-hanko)_82%,black)] data-[hover-preview=true]:shadow-[inset_0_0_0_2px_color-mix(in_oklch,white_28%,transparent),0_8px_22px_color-mix(in_oklch,var(--zen-hanko)_35%,transparent)]",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none absolute inset-x-1 top-1 h-px origin-left scale-x-75 bg-current opacity-20 transition-[opacity,transform] duration-200 group-hover/zen-button:scale-x-100 group-hover/zen-button:opacity-45 group-[[data-hover-preview=true]]/zen-button:scale-x-100 group-[[data-hover-preview=true]]/zen-button:opacity-45",
          variant === "ink" && "hidden",
          variant === "washi" && "text-[color:var(--zen-hanko)]",
          variant === "hanko" && "hidden",
        )}
        aria-hidden="true"
      />
      <span
        className={cn(
          "pointer-events-none absolute inset-y-1 left-1 w-0.5 origin-bottom scale-y-0 bg-current opacity-60 transition-transform duration-200 group-hover/zen-button:scale-y-100 group-[[data-hover-preview=true]]/zen-button:scale-y-100",
          variant === "ink" && "left-auto right-1",
          variant === "washi" && "text-[color:var(--zen-hanko)]",
          variant === "hanko" && "hidden",
        )}
        aria-hidden="true"
      />
      <span
        className={cn(
          "pointer-events-none absolute bottom-1 right-1 size-2 rotate-45 border border-current opacity-0 transition-opacity duration-200 group-hover/zen-button:opacity-55 group-[[data-hover-preview=true]]/zen-button:opacity-55",
          variant === "washi" && "text-[color:var(--zen-hanko)]",
          variant === "hanko" && "hidden",
        )}
        aria-hidden="true"
      />
      {variant === "hanko" ? <HankoMarkSvg className="relative z-10 size-4" /> : null}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
