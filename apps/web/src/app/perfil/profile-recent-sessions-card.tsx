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
    className: "w-[14%] whitespace-nowrap",
    render: (item) => (item.placeholder ? "" : item.dateLabel),
  },
  {
    key: "challenge",
    header: "Desafio",
    className: "w-[39%] break-words",
    render: (item) =>
      item.placeholder ? (
        <span className="text-[var(--profile-text-muted)] opacity-60">
          {item.challenge}
        </span>
      ) : (
        item.challenge
      ),
  },
  {
    key: "difficulty",
    header: "Dif.",
    className: "w-[13%]",
    render: (item) => (item.placeholder ? "" : formatDifficultyLabel(item.difficulty)),
  },
  {
    key: "result",
    header: "Resultado",
    className: "w-[22%]",
    render: (item) => (
      <span className={getStatusClassName(item.result)}>
        {item.placeholder ? "" : formatSessionStatusLabel(item.result)}
      </span>
    ),
  },
  {
    key: "elo",
    header: "ELO",
    className: "w-[12%] whitespace-nowrap text-right",
    render: (item) => (item.placeholder ? "" : formatSignedElo(item.eloChange)),
  },
];

export function ProfileRecentSessionsCard({
  sessions,
}: {
  sessions: RecentSessionItem[];
}) {
  const rows = fillSessionPlaceholders(sessions);

  return (
    <SectionCard
      title="Sessões de diagnóstico recentes"
      footer={
        <Link
          href="/desafios"
          className="profile-focusable inline-flex items-center gap-2 rounded-[4px] text-sm font-medium text-[var(--profile-accent-blue)]"
        >
          Continuar treinando
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      }
    >
      <DataTable
        columns={COLUMNS}
        items={rows}
        emptyMessage="Nenhuma sessão recente registrada."
      />
    </SectionCard>
  );
}

function fillSessionPlaceholders(sessions: RecentSessionItem[]) {
  const rows = sessions.slice(0, 5);
  const missingRows = Math.max(0, 5 - rows.length);

  return [
    ...rows,
    ...Array.from({ length: missingRows }, (_, index) => ({
      id: `session-placeholder-${index}`,
      dateLabel: "",
      challenge: "Sua próxima sessão de treino aparecerá aqui...",
      difficulty: "EASY" as const,
      result: "not_started" as const,
      eloChange: null,
      placeholder: true,
    })),
  ];
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
