"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@kodan/ui/lib/utils";
import type { NavigationTreeDensity } from "./challenges-navigation-types";

export function ChallengesTreeGroup({
  label,
  icon,
  expanded,
  density,
  iconClassName,
  children,
}: {
  label: string;
  icon: ReactNode;
  expanded: boolean;
  density: NavigationTreeDensity;
  iconClassName?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div
        className={cn(
          "flex items-center justify-between rounded-[8px] px-2.5",
          density === "desktop" ? "py-2.5" : "py-2",
          expanded
            ? "bg-[var(--challengers-panel-strong)]"
            : "bg-transparent",
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "inline-flex size-6 shrink-0 items-center justify-center rounded-[5px] border border-[color:var(--challengers-blue-border)] bg-[var(--challengers-blue-soft)] text-[var(--challengers-blue)]",
              iconClassName,
            )}
          >
            {icon}
          </span>
          <span className="truncate text-[0.85rem] font-medium text-[var(--challengers-ink)]">
            {label}
          </span>
        </div>
        {expanded ? (
          <ChevronDown className="size-3.5 text-[var(--challengers-muted)]" />
        ) : (
          <ChevronRight className="size-3.5 text-[var(--challengers-muted)]" />
        )}
      </div>
      {expanded ? <div className="mt-2 space-y-1">{children}</div> : null}
    </div>
  );
}
