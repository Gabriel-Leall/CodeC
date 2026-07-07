import type { Challenge, Difficulty } from "./ema-challenge-card-helpers";
import { getChallengeTags, isDifficulty } from "./ema-challenge-card-helpers";

export type ChallengeTopicKey =
  | "effects-lifecycle"
  | "state-rendering"
  | "async-races"
  | "forms-validation"
  | "component-patterns";

export type ChallengeTopicFilter = "ALL" | ChallengeTopicKey;

export interface ChallengeTopicDefinition {
  key: ChallengeTopicKey;
  label: string;
  description: string;
}

export interface ChallengeTopicSection extends ChallengeTopicDefinition {
  count: number;
  difficulties: Record<"ALL" | Difficulty, number>;
}

export const CHALLENGE_TOPICS: readonly ChallengeTopicDefinition[] = [
  {
    key: "effects-lifecycle",
    label: "Effects & Lifecycle",
    description: "useEffect, closures, dependências e ciclo de vida.",
  },
  {
    key: "state-rendering",
    label: "State & Rendering",
    description: "estado, renderização, derivação e memoização.",
  },
  {
    key: "async-races",
    label: "Async UI & Races",
    description: "fetch, concorrência, ordenação e sincronização de interface.",
  },
  {
    key: "forms-validation",
    label: "Forms & Validation",
    description: "inputs, contratos controlados e validação previsível.",
  },
  {
    key: "component-patterns",
    label: "Component Patterns",
    description: "composição, boundaries, APIs e contratos entre componentes.",
  },
] as const;

const TOPIC_MATCHERS: Record<ChallengeTopicKey, readonly string[]> = {
  "effects-lifecycle": [
    "hooks",
    "react-hooks",
    "stale-closure",
    "useeffect",
    "effect",
    "effects",
    "dependency",
    "dependencies",
    "cleanup",
    "strict-mode",
  ],
  "state-rendering": [
    "state-management",
    "state",
    "rendering",
    "immutability",
    "derived-state",
    "memoization",
    "usememo",
  ],
  "async-races": [
    "race",
    "race-condition",
    "data-fetching",
    "async",
    "promise",
    "fetch",
    "abort",
    "concurrency",
  ],
  "forms-validation": [
    "form",
    "forms",
    "validation",
    "input",
    "controlled",
    "uncontrolled",
  ],
  "component-patterns": [
    "composition",
    "component",
    "components",
    "contracts",
    "children",
    "context",
    "ref",
    "architecture",
    "api",
  ],
};

export function getChallengeTopicKey(
  challenge: Pick<Challenge, "id" | "tags" | "title">,
): ChallengeTopicKey {
  const normalizedTags = getChallengeTags(challenge.tags).map((tag) =>
    tag.toLocaleLowerCase(),
  );
  const normalizedId = challenge.id.toLocaleLowerCase();
  const normalizedTitle = challenge.title.toLocaleLowerCase();
  const primarySearchable = [...normalizedTags, normalizedId];
  const titleSearchable = [normalizedTitle];

  if (matchesAnyTopicToken(primarySearchable, TOPIC_MATCHERS["async-races"])) {
    return "async-races";
  }

  if (
    matchesAnyTopicToken(primarySearchable, TOPIC_MATCHERS["forms-validation"])
  ) {
    return "forms-validation";
  }

  if (
    matchesAnyTopicToken(primarySearchable, TOPIC_MATCHERS["component-patterns"])
  ) {
    return "component-patterns";
  }

  if (
    matchesAnyTopicToken(primarySearchable, TOPIC_MATCHERS["effects-lifecycle"])
  ) {
    return "effects-lifecycle";
  }

  if (matchesAnyTopicToken(primarySearchable, TOPIC_MATCHERS["state-rendering"])) {
    return "state-rendering";
  }

  if (matchesAnyTopicToken(titleSearchable, TOPIC_MATCHERS["async-races"])) {
    return "async-races";
  }

  if (matchesAnyTopicToken(titleSearchable, TOPIC_MATCHERS["forms-validation"])) {
    return "forms-validation";
  }

  if (
    matchesAnyTopicToken(titleSearchable, TOPIC_MATCHERS["component-patterns"])
  ) {
    return "component-patterns";
  }

  if (
    matchesAnyTopicToken(titleSearchable, TOPIC_MATCHERS["effects-lifecycle"])
  ) {
    return "effects-lifecycle";
  }

  if (matchesAnyTopicToken(titleSearchable, TOPIC_MATCHERS["state-rendering"])) {
    return "state-rendering";
  }

  return "state-rendering";
}

function getChallengeTopicMeta(topicKey: ChallengeTopicKey) {
  return (
    CHALLENGE_TOPICS.find((topic) => topic.key === topicKey) ??
    CHALLENGE_TOPICS[0]!
  );
}

export function getChallengeTopicLabel(topicKey: ChallengeTopicKey) {
  return getChallengeTopicMeta(topicKey).label;
}

export function getChallengeTopicDescription(topicKey: ChallengeTopicKey) {
  return getChallengeTopicMeta(topicKey).description;
}

export function matchesChallengeTopic(
  challenge: Pick<Challenge, "id" | "tags" | "title">,
  topicFilter: ChallengeTopicFilter,
) {
  if (topicFilter === "ALL") {
    return true;
  }

  return getChallengeTopicKey(challenge) === topicFilter;
}

export function buildChallengeTopicSections(
  challenges: Challenge[],
): ChallengeTopicSection[] {
  return CHALLENGE_TOPICS.map((topic) => {
    const difficulties = {
      ALL: 0,
      EASY: 0,
      MEDIUM: 0,
      HARD: 0,
    } satisfies Record<"ALL" | Difficulty, number>;

    for (const challenge of challenges) {
      if (getChallengeTopicKey(challenge) !== topic.key) {
        continue;
      }

      difficulties.ALL += 1;
      if (isDifficulty(challenge.difficulty)) {
        difficulties[challenge.difficulty] += 1;
      }
    }

    return {
      ...topic,
      count: difficulties.ALL,
      difficulties,
    };
  });
}

export function getChallengeTopicTagline(
  challenge: Pick<Challenge, "id" | "tags" | "title">,
) {
  const topicLabel = getChallengeTopicLabel(getChallengeTopicKey(challenge));
  const topicTags: string[] = [];

  for (const rawTag of getChallengeTags(challenge.tags)) {
    const normalizedTag = normalizeChallengeTag(rawTag);
    if (
      normalizedTag.length === 0 ||
      normalizedTag === "React" ||
      normalizedTag === "Interview" ||
      normalizedTag === "Debugging"
    ) {
      continue;
    }

    topicTags.push(normalizedTag);
    if (topicTags.length === 3) {
      break;
    }
  }

  if (topicTags.length === 0) {
    return topicLabel;
  }

  return `${topicLabel} · ${topicTags.join(" · ")}`;
}

function matchesAnyTopicToken(searchable: string[], tokens: readonly string[]) {
  return searchable.some((entry) =>
    tokens.some((token) => entry.includes(token)),
  );
}

function normalizeChallengeTag(tag: string) {
  if (tag === "useEffect") {
    return tag;
  }

  return tag
    .split("-")
    .map((part) =>
      part.length > 0
        ? `${part[0]!.toLocaleUpperCase()}${part.slice(1)}`
        : part,
    )
    .join(" ");
}
