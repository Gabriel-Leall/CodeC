"use client";

import { HankoMarkSvg } from "@kodan/ui/assets/zen/sumi-strokes";
import { cn } from "@kodan/ui/lib/utils";
import type { ComponentProps, ReactNode } from "react";
import { ZenRankBadge } from "../progression/ZenRankBadge";
import type { ZenRank } from "../zen-types";

type ZenSidebarItem = {
  id?: string;
  label: ReactNode;
  href?: string;
  active?: boolean;
  icon?: ReactNode;
};

type ZenSidebarProps = ComponentProps<"aside"> & {
  items: ZenSidebarItem[];
  rank?: ZenRank;
  avatar?: ReactNode;
  title?: ReactNode;
};

export function ZenSidebar({ items, rank, avatar, title = "Dojo", className, ...props }: ZenSidebarProps) {
  return (
    <aside
      className={cn(
        "zen-paper zen-ink-edge flex min-h-80 w-full flex-col gap-4 border border-[color:var(--zen-border)] p-4 text-[color:var(--zen-ink)] md:max-w-72",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center border border-[color:var(--zen-hanko)] text-[color:var(--zen-hanko)]">
          {avatar ?? <HankoMarkSvg className="size-6" />}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{title}</div>
          <div className="text-[10px] uppercase text-[color:var(--zen-muted)]">Ritual continuo</div>
        </div>
      </div>
      {rank ? <ZenRankBadge rank={rank} className="min-w-0" /> : null}
      <nav className="flex flex-col gap-1" aria-label="Zen navigation">
        {items.map((item) => {
          const content = (
            <>
              <span
                className={cn(
                  "h-5 w-0.5 bg-transparent transition-colors",
                  item.active && "bg-[color:var(--zen-hanko)]",
                )}
                aria-hidden="true"
              />
              {item.icon ? <span className="text-[color:var(--zen-muted)]">{item.icon}</span> : null}
              <span className="truncate">{item.label}</span>
            </>
          );

          const classNameValue = cn(
            "zen-focus flex items-center gap-2 px-2 py-2 text-xs text-[color:var(--zen-muted)] transition-colors hover:text-[color:var(--zen-ink)]",
            item.active && "text-[color:var(--zen-ink)]",
          );

          return item.href ? (
            <a key={item.id ?? item.href ?? String(item.label)} href={item.href} className={classNameValue}>
              {content}
            </a>
          ) : (
            <button key={item.id ?? String(item.label)} type="button" className={classNameValue}>
              {content}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export type { ZenSidebarItem };
