import { ArrowRight } from "lucide-react";
import Link from "next/link";

import {
  DataTable,
  SectionCard,
  type DataTableColumn,
} from "@kodan/ui/components/profile";
import { formatDifficultyLabel } from "./profile-formatters";
import type { RecommendedChallengeItem } from "./profile-types";

const COLUMNS: DataTableColumn<RecommendedChallengeItem>[] = [
  {
    key: "challenge",
    header: "Desafio",
    className: "w-[36%] break-words",
    render: (item) => item.challenge,
  },
  {
    key: "topic",
    header: "Tópico",
    className: "w-[28%] break-words",
    render: (item) => item.topic,
  },
  {
    key: "difficulty",
    header: "Dificuldade",
    className: "w-[19%]",
    render: (item) => formatDifficultyLabel(item.difficulty),
  },
  {
    key: "possible-elo",
    header: "ELO",
    className: "w-[17%] whitespace-nowrap text-right",
    render: (item) => `+${item.possibleElo}`,
  },
];

export function ProfileRecommendationsCard({
  recommendations,
}: {
  recommendations: RecommendedChallengeItem[];
}) {
  return (
    <SectionCard
      title="Próximos desafios recomendados"
      footer={
        <Link
          href="/challenges"
          className="profile-focusable inline-flex items-center gap-2 rounded-[4px] text-sm font-medium text-[var(--profile-accent-blue)]"
        >
          Explorar todos os desafios
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      }
    >
      <DataTable
        columns={COLUMNS}
        items={recommendations}
        emptyMessage="Nenhuma recomendação disponível agora."
      />
    </SectionCard>
  );
}
