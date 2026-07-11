import type { ReactNode } from "react";

import { cn } from "@kodan/ui/lib/utils";

export function SectionCard({
  title,
  action,
  footer,
  className,
  children,
}: {
  title?: string;
  action?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "profile-panel overflow-hidden rounded-[8px] border text-[var(--profile-text-primary)]",
        className,
      )}
    >
      {title || action ? (
        <div className="flex items-center justify-between gap-4 px-5 pb-2 pt-4">
          {title ? (
            <h2 className="font-serif text-[1.05rem] font-semibold leading-tight">
              {title}
            </h2>
          ) : (
            <span aria-hidden="true" />
          )}
          {action}
        </div>
      ) : null}
      <div className="px-5 pb-4">{children}</div>
      {footer ? (
        <div className="border-t border-[color:var(--profile-border)] px-5 py-2.5">
          {footer}
        </div>
      ) : null}
    </section>
  );
}
