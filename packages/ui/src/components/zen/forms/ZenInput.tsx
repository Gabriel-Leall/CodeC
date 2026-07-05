"use client";

import { cn } from "@kodan/ui/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type ZenInputProps = ComponentProps<"input"> & {
  label?: ReactNode;
  hint?: ReactNode;
};

export function ZenInput({ className, label, hint, id, ...props }: ZenInputProps) {
  const inputId = id ?? (typeof label === "string" ? `zen-input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  return (
    <label className="block space-y-1.5 text-[color:var(--zen-ink)]" htmlFor={inputId}>
      {label ? <span className="block text-xs font-semibold">{label}</span> : null}
      <input
        id={inputId}
        className={cn(
          "zen-focus zen-paper h-10 w-full border border-[color:var(--zen-border)] px-3 text-sm text-[color:var(--zen-ink)] transition-[border-color,box-shadow] placeholder:text-[color:var(--zen-muted)] hover:border-[color:var(--zen-sumi)] focus-visible:border-[color:var(--zen-hanko)]",
          className,
        )}
        {...props}
      />
      {hint ? <span className="block text-xs/relaxed text-[color:var(--zen-muted)]">{hint}</span> : null}
    </label>
  );
}
