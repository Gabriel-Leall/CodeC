import type { DifficultyFilter } from "./challenges-list-state";
import type {
  ChallengeTopicFilter,
  ChallengeTopicKey,
} from "./challenges-taxonomy";

export type NavigationTreeDensity = "desktop" | "drawer";

export interface ChallengesNavigationHandlers {
  onTopicChange: (topic: ChallengeTopicFilter) => void;
  onDifficultyChange: (difficulty: DifficultyFilter) => void;
}

export interface TopicNavigationHandlers {
  onTopicChange: (topic: ChallengeTopicKey) => void;
  onDifficultyChange: (difficulty: DifficultyFilter) => void;
}
