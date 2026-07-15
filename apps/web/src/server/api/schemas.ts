import { z } from "zod";

export const apiErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const difficultySchema = z.enum(["EASY", "MEDIUM", "HARD"]);

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

export const challengeAttemptSummarySchema = z.object({
  id: z.string(),
  score: z.number(),
  eloChange: z.number().int().optional(),
  createdAt: z.iso.datetime().optional(),
});

export const challengeSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  difficulty: difficultySchema,
  recommendedElo: z.number().int(),
  tags: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  attempts: z.array(challengeAttemptSummarySchema),
});

export const challengeDetailSchema = challengeSummarySchema.extend({
  code: z.string(),
  question: z.string(),
  solution: z.string(),
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
    feedback: feedbackSchema,
  }),
});

export const attemptsResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(attemptSchema),
});
