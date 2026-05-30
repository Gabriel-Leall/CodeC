"use client";

import { cn } from "@CC/ui/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { paperSlide } from "../motion/presets";
import { motion } from "framer-motion";

type ZenCommandItem = {
  label: string;
  description?: string;
  shortcut?: string;
  onSelect?: () => void;
};

type ZenCommandMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: ZenCommandItem[];
  title?: ReactNode;
};

export function ZenCommandMenu({ open, onOpenChange, items, title = "Comando", }: ZenCommandMenuProps) {
  const [query, setQuery] = useState("");
  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) =>
      [item.label, item.description, item.shortcut].filter(Boolean).join(" ").toLowerCase().includes(normalizedQuery),
    );
  }, [items, query]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
        <DialogPrimitive.Content asChild>
          <motion.div
            variants={paperSlide}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="zen-ink-edge fixed left-1/2 top-24 z-50 w-[min(92vw,34rem)] -translate-x-1/2 border border-[color:color-mix(in_oklch,var(--zen-washi)_24%,transparent)] bg-[color:var(--zen-ink)] p-4 text-[color:var(--zen-washi)]"
          >
            <DialogPrimitive.Title className="text-sm font-semibold">{title}</DialogPrimitive.Title>
            <DialogPrimitive.Description className="mt-1 text-xs text-[color:color-mix(in_oklch,var(--zen-washi)_62%,transparent)]">
              Digite para filtrar ações do dojo.
            </DialogPrimitive.Description>
            <div className="mt-4 flex items-center gap-2 border border-[color:color-mix(in_oklch,var(--zen-washi)_18%,transparent)] px-3">
              <Search className="size-4 text-[color:color-mix(in_oklch,var(--zen-washi)_62%,transparent)]" />
              <input
                aria-label="Buscar ritual"
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[color:color-mix(in_oklch,var(--zen-washi)_42%,transparent)]"
                placeholder="Buscar ritual..."
              />
            </div>
            <div className="mt-3 max-h-72 overflow-auto">
              {filteredItems.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {filteredItems.map((item) => (
                    <button
                      key={item.shortcut ? `${item.label}-${item.shortcut}` : item.label}
                      type="button"
                      className={cn(
                        "zen-focus grid grid-cols-[1fr_auto] gap-3 border border-transparent px-3 py-2 text-left transition-colors hover:border-[color:color-mix(in_oklch,var(--zen-hanko)_45%,transparent)] hover:bg-[color:color-mix(in_oklch,var(--zen-washi)_8%,transparent)]",
                      )}
                      onClick={() => {
                        item.onSelect?.();
                        onOpenChange(false);
                      }}
                    >
                      <span>
                        <span className="block text-xs font-semibold">{item.label}</span>
                        {item.description ? (
                          <span className="block text-xs text-[color:color-mix(in_oklch,var(--zen-washi)_56%,transparent)]">
                            {item.description}
                          </span>
                        ) : null}
                      </span>
                      {item.shortcut ? (
                        <span className="text-[10px] uppercase text-[color:color-mix(in_oklch,var(--zen-washi)_48%,transparent)]">
                          {item.shortcut}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="zen-paper border border-[color:var(--zen-border)] p-4 text-center text-xs text-[color:var(--zen-muted)]">
                  Nenhum ritual encontrado.
                </div>
              )}
            </div>
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export type { ZenCommandItem };
