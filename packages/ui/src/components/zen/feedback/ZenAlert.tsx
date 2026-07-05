"use client";

import { EnsoCircle } from "@kodan/ui/assets/zen/vector/EnsoCircle";
import { cn } from "@kodan/ui/lib/utils";
import { AnimatePresence, motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { zenEase } from "../motion/presets";

type ZenAlertVariant = "success" | "warning" | "error" | "info";

type ZenAlertProps = Omit<HTMLMotionProps<"div">, "children" | "title"> & {
  open?: boolean;
  variant?: ZenAlertVariant;
  title?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
};

const variantStyles: Record<ZenAlertVariant, string> = {
  success: "border-[color:color-mix(in_oklch,var(--zen-moss)_46%,var(--zen-border))] [--zen-alert-accent:var(--zen-moss)]",
  warning: "border-[color:oklch(70%_0.12_76)] [--zen-alert-accent:oklch(58%_0.12_76)]",
  error: "border-[color:var(--zen-hanko)] [--zen-alert-accent:var(--zen-hanko)]",
  info: "border-[color:color-mix(in_oklch,var(--zen-sumi)_44%,var(--zen-border))] [--zen-alert-accent:var(--zen-sumi)]",
};

export function ZenAlert({
  open = true,
  variant = "info",
  title,
  children,
  action,
  className,
  role,
  ...props
}: ZenAlertProps) {
  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          role={role ?? (variant === "error" ? "alert" : "status")}
          initial={{ opacity: 0, y: 8, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.99 }}
          transition={{ duration: 0.28, ease: zenEase }}
          className={cn(
            "zen-paper zen-ink-edge relative grid grid-cols-[auto_1fr] gap-3 overflow-hidden border px-4 py-3 text-[color:var(--zen-ink)]",
            variantStyles[variant],
            className,
          )}
          {...props}
        >
          <span
            className="relative mt-0.5 flex size-9 shrink-0 items-center justify-center text-[color:var(--zen-alert-accent)]"
            aria-hidden="true"
          >
            <EnsoCircle className="absolute inset-0 size-9" duration={0.9} />
            <span className="size-2 bg-[color:var(--zen-alert-accent)]" />
          </span>
          <span className="min-w-0 space-y-1">
            {title ? <span className="block text-sm font-semibold">{title}</span> : null}
            <span className="block text-xs/relaxed text-[color:color-mix(in_oklch,var(--zen-ink)_74%,transparent)]">
              {children}
            </span>
            {action ? <span className="mt-2 flex flex-wrap gap-2">{action}</span> : null}
          </span>
          <span
            className="absolute right-3 top-3 size-5 rotate-[-7deg] border border-[color:var(--zen-hanko)] text-[color:var(--zen-hanko)] opacity-70"
            aria-hidden="true"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export type { ZenAlertProps, ZenAlertVariant };
