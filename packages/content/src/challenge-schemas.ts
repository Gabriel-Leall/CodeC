import { z } from "zod";

export const difficultySchema = z.enum(["EASY", "MEDIUM", "HARD"]);

export const rubricCriterionSchema = z.object({
  criterion: z.string().trim().min(1),
  points: z.number().int().min(0),
});

const baseChallengeSchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(1),
  difficulty: difficultySchema,
  recommendedElo: z.number().int().min(0),
  question: z.string().trim().min(1),
  tags: z.array(z.string().trim().min(1)).min(1),
  language: z.string().trim().min(1).optional(),
  type: z.string().trim().min(1).optional(),
  estimatedTime: z.number().int().min(1).max(180).optional(),
  status: z.string().trim().min(1).optional(),
  rubric: z.array(rubricCriterionSchema).optional(),
  hints: z.array(z.string().trim().min(1)).optional(),
  commonMistakes: z.array(z.string().trim().min(1)).optional(),
});

export const challengeLegacySchema = baseChallengeSchema.extend({
  code: z.string().trim().min(1),
  solution: z.string().trim().min(1),
  expectedAnswer: z.string().trim().min(1).optional(),
});

export const challengeSplitMetaSchema = baseChallengeSchema.extend({
  codeFile: z.string().trim().min(1).optional(),
  solutionFile: z.string().trim().min(1).optional(),
  expectedAnswerFile: z.string().trim().min(1).optional(),
  rubricFile: z.string().trim().min(1).optional(),
  hintsFile: z.string().trim().min(1).optional(),
  commonMistakesFile: z.string().trim().min(1).optional(),
});

export const challengeIndexEntrySchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(1),
  language: z.string().trim().min(1),
  difficulty: difficultySchema,
  type: z.string().trim().min(1),
  tags: z.array(z.string().trim().min(1)),
  estimatedTime: z.number().int().min(1).max(180),
  recommendedElo: z.number().int().min(0),
  status: z.string().trim().min(1),
});

export const challengeIndexSchema = z.array(challengeIndexEntrySchema);

export type ChallengeLegacy = z.infer<typeof challengeLegacySchema>;
export type ChallengeSplitMeta = z.infer<typeof challengeSplitMetaSchema>;
export type ChallengeIndexEntry = z.infer<typeof challengeIndexEntrySchema>;
