import type { ReactNode } from "react";

import { cn } from "@kodan/ui/lib/utils";

export interface DataTableColumn<TItem> {
  key: string;
  header: string;
  className?: string;
  render: (item: TItem) => ReactNode;
}

export function DataTable<TItem extends { id: string }>({
  columns,
  items,
  emptyMessage,
}: {
  columns: DataTableColumn<TItem>[];
  items: TItem[];
  emptyMessage: string;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-[8px] border border-dashed border-[color:var(--profile-border)] px-4 py-5 text-sm text-[var(--profile-text-secondary)]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-hidden">
      <table className="w-full table-fixed text-left text-sm">
        <thead>
          <tr className="border-b border-[color:var(--profile-border)] text-[0.68rem] uppercase tracking-[0.12em] text-[var(--profile-text-muted)]">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                    "px-2 pb-3 font-medium first:pl-0 last:pr-0",
                  column.className,
                )}
                scope="col"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[color:var(--profile-border)]">
          {items.map((item) => (
            <tr key={item.id} className="profile-table-row transition-colors">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    "px-2 py-2.5 align-top leading-6 first:pl-0 last:pr-0",
                    column.className,
                  )}
                >
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
