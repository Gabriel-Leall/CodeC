"use client";

import { cn } from "@kodan/ui/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type ZenTextareaProps = ComponentProps<"textarea"> & {
  label?: ReactNode;
  hint?: ReactNode;
};

export function ZenTextarea({ className, label, hint, id, ...props }: ZenTextareaProps) {
  const textareaId =
    id ?? (typeof label === "string" ? `zen-textarea-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  return (
    <label className="block space-y-1.5 text-[color:var(--zen-ink)]" htmlFor={textareaId}>
      {label ? <span className="block text-xs font-semibold">{label}</span> : null}
      <textarea
        id={textareaId}
        className={cn(
          "zen-focus zen-paper min-h-28 w-full resize-y border border-[color:var(--zen-border)] px-3 py-2 text-sm/relaxed text-[color:var(--zen-ink)] transition-[border-color,box-shadow] placeholder:text-[color:var(--zen-muted)] hover:border-[color:var(--zen-sumi)] focus-visible:border-[color:var(--zen-hanko)]",
          className,
        )}
        {...props}
      />
      {hint ? <span className="block text-xs/relaxed text-[color:var(--zen-muted)]">{hint}</span> : null}
    </label>
  );
}

