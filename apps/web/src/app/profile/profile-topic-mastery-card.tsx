import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ProgressBar, SectionCard } from "@kodan/ui/components/profile";
import type { TopicMasteryItem } from "./profile-types";

export function ProfileTopicMasteryCard({
  topics,
}: {
  topics: TopicMasteryItem[];
}) {
  return (
    <SectionCard
      title="Domínio por tópico"
      footer={
        <Link
          href="/challenges"
          className="profile-focusable inline-flex items-center gap-2 rounded-[4px] text-sm font-medium text-[var(--profile-accent-blue)]"
        >
          Ver todos os tópicos
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      }
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2">
        <div className="text-[0.68rem] uppercase tracking-[0.12em] text-[var(--profile-text-muted)]">
          Tópico
        </div>
        <div className="text-right text-[0.68rem] uppercase tracking-[0.12em] text-[var(--profile-text-muted)]">
          Proficiência
        </div>
        {topics.map((topic) => (
          <TopicRow key={topic.topicId} topic={topic} />
        ))}
      </div>
    </SectionCard>
  );
}

function TopicRow({ topic }: { topic: TopicMasteryItem }) {
  return (
    <>
      <div className="grid min-w-0 grid-cols-[minmax(120px,1fr)_minmax(120px,0.95fr)] items-center gap-4">
        <span className="truncate text-sm text-[var(--profile-text-primary)]">
          {topic.label}
        </span>
        <ProgressBar
          value={topic.proficiency}
          label={`${topic.label}: ${topic.proficiency}%`}
        />
      </div>
      <div className="text-right text-sm tabular-nums text-[var(--profile-text-primary)]">
        {topic.proficiency}%
      </div>
    </>
  );
}
