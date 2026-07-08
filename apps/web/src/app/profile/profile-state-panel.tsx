import type { ReactNode } from "react";

import { SectionCard } from "@kodan/ui/components/profile";

export function ProfileStatePanel({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <SectionCard>
      <div className="flex flex-col items-start gap-3 py-4 text-sm text-[var(--profile-text-secondary)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-base font-semibold text-[var(--profile-text-primary)]">
            {title}
          </h2>
          <p className="mt-1">{description}</p>
        </div>
        {action}
      </div>
    </SectionCard>
  );
}
