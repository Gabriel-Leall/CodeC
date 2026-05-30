"use client";

import { cn } from "@CC/ui/lib/utils";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

type ZenSelectOption = {
  label: string;
  value: string;
};

type ZenSelectProps = ComponentProps<typeof SelectPrimitive.Root> & {
  label?: ReactNode;
  hint?: ReactNode;
  placeholder?: string;
  options: ZenSelectOption[];
  className?: string;
};

export function ZenSelect({ className, label, hint, placeholder = "Selecionar", options, ...props }: ZenSelectProps) {
  return (
    <div className="block space-y-1.5 text-[color:var(--zen-ink)]">
      {label ? <span className="block text-xs font-semibold">{label}</span> : null}
      <SelectPrimitive.Root {...props}>
        <SelectPrimitive.Trigger
          className={cn(
            "zen-focus zen-paper flex h-10 w-full items-center justify-between gap-2 border border-[color:var(--zen-border)] px-3 text-sm text-[color:var(--zen-ink)] transition-[border-color,box-shadow] hover:border-[color:var(--zen-sumi)] focus-visible:border-[color:var(--zen-hanko)] disabled:pointer-events-none disabled:opacity-50",
            className,
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="size-4 text-[color:var(--zen-muted)]" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="zen-paper zen-ink-edge z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden border border-[color:var(--zen-border)] text-[color:var(--zen-ink)]"
            position="popper"
            sideOffset={6}
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className="zen-focus relative flex cursor-default select-none items-center gap-2 py-2 pl-7 pr-2 text-xs outline-none data-[highlighted]:bg-[color:color-mix(in_oklch,var(--zen-hanko)_10%,transparent)] data-[highlighted]:text-[color:var(--zen-hanko)]"
                >
                  <SelectPrimitive.ItemIndicator className="absolute left-2 text-[color:var(--zen-hanko)]">
                    <Check className="size-3.5" />
                  </SelectPrimitive.ItemIndicator>
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {hint ? <span className="block text-xs/relaxed text-[color:var(--zen-muted)]">{hint}</span> : null}
    </div>
  );
}

export type { ZenSelectOption };
