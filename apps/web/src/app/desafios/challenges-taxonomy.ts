import {
  CHALLENGE_TOPICS,
  getChallengeTopicDescription,
  getChallengeTopicKey,
  getChallengeTopicLabel,
  type ChallengeTopicDefinition,
  type ChallengeTopicKey,
} from "@/lib/challenge-topics";
import type { Challenge, Difficulty } from "./ema-challenge-card-helpers";
import { getChallengeTags, isDifficulty } from "./ema-challenge-card-helpers";

export {
  CHALLENGE_TOPICS,
  getChallengeTopicDescription,
  getChallengeTopicKey,
  getChallengeTopicLabel,
  type ChallengeTopicDefinition,
  type ChallengeTopicKey,
};

export type ChallengeTopicFilter = "ALL" | ChallengeTopicKey;

export interface ChallengeTopicSection extends ChallengeTopicDefinition {
  count: number;
  difficulties: Record<"ALL" | Difficulty, number>;
}

export function matchesChallengeTopic(
  challenge: Pick<Challenge, "id" | "tags" | "title">,
  topicFilter: ChallengeTopicFilter,
) {
  return topicFilter === "ALL" || getChallengeTopicKey(challenge) === topicFilter;
}

export function buildChallengeTopicSections(challenges: Challenge[]): ChallengeTopicSection[] {
  return CHALLENGE_TOPICS.map((topic) => {
    const difficulties = {
      ALL: 0,
      EASY: 0,
      MEDIUM: 0,
      HARD: 0,
    } satisfies Record<"ALL" | Difficulty, number>;

    for (const challenge of challenges) {
      if (getChallengeTopicKey(challenge) !== topic.key) continue;
      difficulties.ALL += 1;
      if (isDifficulty(challenge.difficulty)) difficulties[challenge.difficulty] += 1;
    }

    return { ...topic, count: difficulties.ALL, difficulties };
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
    ) continue;

    topicTags.push(normalizedTag);
    if (topicTags.length === 3) break;
  }

  return topicTags.length === 0 ? topicLabel : `${topicLabel} · ${topicTags.join(" · ")}`;
}

function normalizeChallengeTag(tag: string) {
  if (tag === "useEffect") return tag;
  return tag
    .split("-")
    .map((part) => part.length > 0 ? `${part[0]!.toLocaleUpperCase()}${part.slice(1)}` : part)
    .join(" ");
}
