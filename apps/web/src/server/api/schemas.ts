import { z } from "zod";
import {
  challengeDetailSchema,
  challengeSummarySchema,
  difficultySchema,
} from "./challenge-contract";

export {
  challengeAttemptSummarySchema,
  challengeDetailSchema,
  challengeSummarySchema,
  difficultySchema,
} from "./challenge-contract";

export const apiErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  bio: z.string().nullable(),
  image: z.string().nullable(),
  elo: z.number().int(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const updateCurrentUserSchema = z.object({
  name: z.string().trim().min(2).max(60),
  bio: z.string().trim().max(180).optional(),
  image: z.string().nullable().optional(),
});

export const listChallengesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(15),
  offset: z.coerce.number().int().min(0).default(0),
});

export const feedbackSchema = z.object({
  score: z.number().min(0).max(10),
  summary: z.string(),
  strengths: z.array(z.string()),
  blindspots: z.array(z.string()),
  seniorSolution: z.string(),
});

export const submitAttemptSchema = z.object({
  userAnswer: z.string().trim().min(30),
  usedHint: z.boolean().optional().default(false),
});

export const attemptSchema = z.object({
  id: z.string(),
  userId: z.string(),
  challengeId: z.string(),
  userAnswer: z.string(),
  feedbackJson: z.string(),
  score: z.number(),
  eloChange: z.number().int(),
  attemptNumber: z.number().int().positive(),
  sessionStatus: z.enum([
    "RETRY_AVAILABLE",
    "SOLVED",
    "ELO_EXHAUSTED",
    "REVEALED",
  ]),
  createdAt: z.iso.datetime(),
  challenge: challengeSummarySchema.omit({ attempts: true }).optional(),
});

export const currentUserResponseSchema = z.object({
  success: z.literal(true),
  data: userSchema,
});

export const challengesResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    items: z.array(challengeSummarySchema),
    total: z.number().int(),
    offset: z.number().int(),
    nextOffset: z.number().int(),
    hasMore: z.boolean(),
    userElo: z.number().int(),
  }),
});

export const challengeResponseSchema = z.object({
  success: z.literal(true),
  data: challengeDetailSchema,
});

export const submitAttemptResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    score: z.number().min(0).max(10),
    eloChange: z.number().int(),
    newElo: z.number().int(),
    isFirstAttempt: z.boolean(),
    attemptNumber: z.number().int().positive(),
    status: z.enum([
      "RETRY_AVAILABLE",
      "SOLVED",
      "ELO_EXHAUSTED",
      "REVEALED",
    ]),
    canRetry: z.boolean(),
    canRevealSolution: z.boolean(),
    remainingEvaluatedAttempts: z.number().int().min(0),
    nextEloPotentialPercent: z.number().int().min(0).max(100),
    eloFinalized: z.boolean(),
    feedback: feedbackSchema,
  }),
});

export const attemptsResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(attemptSchema),
});
