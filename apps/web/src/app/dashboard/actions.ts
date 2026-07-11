"use server";

import {
  getChallengeById,
  getCurrentUser,
  listChallenges,
  listCurrentUserAttempts,
  submitChallengeAttempt,
  updateCurrentUserProfile,
} from "@/server/api/service";

export async function getLocalUser() {
  return getCurrentUser();
}

export async function updateLocalUserProfile(params: {
  name: string;
  bio?: string;
  image?: string | null;
}) {
  return updateCurrentUserProfile(params);
}

export async function getChallenges(params?: { limit?: number; offset?: number }) {
  return listChallenges(params);
}

export async function getChallenge(id: string) {
  return getChallengeById(id);
}

export async function submitAttempt(challengeId: string, userAnswer: string, usedHint?: boolean) {
  return submitChallengeAttempt(challengeId, {
    userAnswer,
    usedHint: Boolean(usedHint),
  });
}

export async function getAttemptsHistory() {
  return listCurrentUserAttempts();
}
