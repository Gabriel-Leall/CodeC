import { ArrowRight, LockKeyhole } from "lucide-react";
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
          href="/desafios"
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
  if (topic.locked) {
    return (
      <>
        <div className="grid min-w-0 grid-cols-[minmax(120px,1fr)_minmax(120px,0.95fr)] items-center gap-4 opacity-55">
          <span className="min-w-0 text-sm text-[var(--profile-text-secondary)]">
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <LockKeyhole className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{topic.label}</span>
            </span>
            <span className="mt-0.5 block truncate text-[0.68rem] text-[var(--profile-text-muted)]">
              {topic.unlockHint}
            </span>
          </span>
          <div
            className="h-1.5 rounded-full bg-[color:var(--profile-border)]"
            aria-label={`${topic.label}: métrica bloqueada`}
          />
        </div>
        <div className="text-right text-sm tabular-nums text-[var(--profile-text-muted)] opacity-55">
          —
        </div>
      </>
    );
  }

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
