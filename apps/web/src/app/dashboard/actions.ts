"use server";

import { headers } from "next/headers";

import { isMockMode } from "@/lib/mock-mode";
import { getRuntimeSession } from "@/lib/runtime-data";
import {
  getChallengeById,
  getCurrentUser,
  listChallenges,
  listCurrentUserAttempts,
  submitChallengeAttempt,
  updateCurrentUserProfile,
} from "@/server/api/service";

async function requireAuth() {
  if (isMockMode()) return;

  const session = await getRuntimeSession(await headers());
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
}

export async function getLocalUser() {
  await requireAuth();
  return getCurrentUser();
}

export async function updateLocalUserProfile(params: {
  name: string;
  bio?: string;
  image?: string | null;
}) {
  await requireAuth();
  return updateCurrentUserProfile(params);
}

export async function getChallenges(params?: { limit?: number; offset?: number }) {
  await requireAuth();
  return listChallenges(params);
}

export async function getChallenge(id: string) {
  await requireAuth();
  return getChallengeById(id);
}

export async function submitAttempt(challengeId: string, userAnswer: string, usedHint?: boolean) {
  await requireAuth();
  return submitChallengeAttempt(challengeId, {
    userAnswer,
    usedHint: Boolean(usedHint),
  });
}

export async function getAttemptsHistory() {
  await requireAuth();
  return listCurrentUserAttempts();
}
