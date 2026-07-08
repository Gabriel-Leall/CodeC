import { ArrowRight } from "lucide-react";
import Link from "next/link";

import {
  DataTable,
  SectionCard,
  type DataTableColumn,
} from "@kodan/ui/components/profile";
import {
  formatDifficultyLabel,
  formatSessionStatusLabel,
  formatSignedElo,
} from "./profile-formatters";
import type { RecentSessionItem } from "./profile-types";

const COLUMNS: DataTableColumn<RecentSessionItem>[] = [
  { key: "date", header: "Data", render: (item) => item.dateLabel },
  { key: "challenge", header: "Desafio", render: (item) => item.challenge },
  {
    key: "difficulty",
    header: "Dificuldade",
    render: (item) => formatDifficultyLabel(item.difficulty),
  },
  {
    key: "result",
    header: "Resultado",
    render: (item) => (
      <span className={getStatusClassName(item.result)}>
        {formatSessionStatusLabel(item.result)}
      </span>
    ),
  },
  {
    key: "elo",
    header: "ELO",
    className: "text-right",
    render: (item) => formatSignedElo(item.eloChange),
  },
];

export function ProfileRecentSessionsCard({
  sessions,
}: {
  sessions: RecentSessionItem[];
}) {
  return (
    <SectionCard
      title="Sessões de diagnóstico recentes"
      footer={
        <Link
          href="/profile"
          className="profile-focusable inline-flex items-center gap-2 rounded-[4px] text-sm font-medium text-[var(--profile-accent-blue)]"
        >
          Ver histórico completo
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      }
    >
      <DataTable
        columns={COLUMNS}
        items={sessions}
        emptyMessage="Nenhuma sessão recente registrada."
      />
    </SectionCard>
  );
}

function getStatusClassName(status: RecentSessionItem["result"]) {
  if (status === "resolved") {
    return "font-medium text-[var(--profile-success)]";
  }

  if (status === "in_progress") {
    return "font-medium text-[var(--profile-accent-blue)]";
  }

  return "text-[var(--profile-text-secondary)]";
}
