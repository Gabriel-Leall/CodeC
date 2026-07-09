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
  {
    key: "date",
    header: "Data",
    className: "w-[17%] whitespace-nowrap",
    render: (item) => item.dateLabel,
  },
  {
    key: "challenge",
    header: "Desafio",
    className: "w-[32%] break-words",
    render: (item) => item.challenge,
  },
  {
    key: "difficulty",
    header: "Dificuldade",
    className: "w-[18%]",
    render: (item) => formatDifficultyLabel(item.difficulty),
  },
  {
    key: "result",
    header: "Resultado",
    className: "w-[21%]",
    render: (item) => (
      <span className={getStatusClassName(item.result)}>
        {formatSessionStatusLabel(item.result)}
      </span>
    ),
  },
  {
    key: "elo",
    header: "ELO",
    className: "w-[12%] whitespace-nowrap text-right",
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
          href="/challenges"
          className="profile-focusable inline-flex items-center gap-2 rounded-[4px] text-sm font-medium text-[var(--profile-accent-blue)]"
        >
          Continuar treinando
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
