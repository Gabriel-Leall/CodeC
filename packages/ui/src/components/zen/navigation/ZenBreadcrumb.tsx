import { cn } from "@kodan/ui/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type ZenBreadcrumbItem = {
  id?: string;
  label: ReactNode;
  href?: string;
};

type ZenBreadcrumbProps = ComponentProps<"nav"> & {
  items: ZenBreadcrumbItem[];
};

export function ZenBreadcrumb({ items, className, ...props }: ZenBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-[10px] font-semibold uppercase", className)} {...props}>
      <ol className="flex flex-wrap items-center gap-2 text-[color:var(--zen-muted)]">
        {items.map((item, index) => (
          <li key={item.id ?? item.href ?? String(item.label)} className="flex items-center gap-2">
            {item.href ? (
              <a className="zen-focus text-[color:var(--zen-ink)] hover:text-[color:var(--zen-hanko)]" href={item.href}>
                {item.label}
              </a>
            ) : (
              <span aria-current={index === items.length - 1 ? "page" : undefined}>{item.label}</span>
            )}
            {index < items.length - 1 ? <span aria-hidden="true">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export type { ZenBreadcrumbItem };
