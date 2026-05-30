"use client";

import { HankoMarkSvg } from "@CC/ui/assets/zen/sumi-strokes";
import { cn } from "@CC/ui/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type ChangeEvent, type ComponentProps, type ReactNode } from "react";

type ZenCheckboxProps = Omit<ComponentProps<"input">, "type"> & {
  label: ReactNode;
  description?: ReactNode;
};

export function ZenCheckbox({
  className,
  label,
  description,
  checked,
  defaultChecked,
  onChange,
  ...props
}: ZenCheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(Boolean(defaultChecked));
  const isControlled = typeof checked === "boolean";
  const isChecked = isControlled ? checked : internalChecked;

  function updateCheckedState(event: ChangeEvent<HTMLInputElement>) {
    if (!isControlled) {
      setInternalChecked(event.currentTarget.checked);
    }

    onChange?.(event);
  }

  const checkboxControlProps = isControlled
    ? { checked, onChange: updateCheckedState }
    : { defaultChecked, onChange: updateCheckedState };

  return (
    <label className={cn("flex cursor-pointer items-start gap-3 text-[color:var(--zen-ink)]", className)}>
      <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center border border-[color:var(--zen-border)]">
        <input
          type="checkbox"
          className="peer sr-only"
          {...checkboxControlProps}
          {...props}
        />
        <span className="absolute inset-0 transition-colors peer-checked:bg-[color:color-mix(in_oklch,var(--zen-hanko)_12%,transparent)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[color:var(--zen-hanko)]" />
        <AnimatePresence initial={false}>
          {isChecked ? (
            <motion.span
              initial={{ opacity: 0, scale: 0.75, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="relative z-10 text-[color:var(--zen-hanko)]"
            >
              <HankoMarkSvg className="size-4" />
            </motion.span>
          ) : null}
        </AnimatePresence>
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold">{label}</span>
        {description ? <span className="block text-xs/relaxed text-[color:var(--zen-muted)]">{description}</span> : null}
      </span>
    </label>
  );
}
