import "server-only";

import { currentTrainingAdapter } from "@/server/training/current-training-adapter";
import type {
  ChallengeCatalogAdapter,
  PractitionerAdapter,
} from "@/server/training/training-adapter";

const practitionerAdapter: PractitionerAdapter = currentTrainingAdapter;
const challengeCatalogAdapter: ChallengeCatalogAdapter = currentTrainingAdapter;

export async function loadProfileData(userId?: string) {
  const user = userId
    ? await practitionerAdapter.getUserById(userId)
    : await practitionerAdapter.getOptionalUser();
  if (!user) throw new Error("Unauthorized");

  const attempts = await practitionerAdapter.listAttempts(user.id);
  const recommendations = await challengeCatalogAdapter.listRecommendations(
    user.id,
    attempts.map((attempt) => attempt.challengeId),
    5,
  );

  return { user, attempts, recommendations };
}
