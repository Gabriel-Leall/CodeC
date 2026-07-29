import { describe, expect, test } from "bun:test";

import { createMockTrainingStore } from "@/server/api/mock-store";
import { createInMemoryTrainingAdapter } from "./in-memory-training-adapter";
import { selectTrainingAdapter } from "./training-adapter";

describe("selectTrainingAdapter", () => {
  test("seleciona o adapter in-memory para o modo mock", () => {
    const inMemory = { kind: "in-memory" };
    const integrated = { kind: "integrated" };

    expect(selectTrainingAdapter(true, { inMemory, integrated })).toBe(inMemory);
  });

  test("seleciona o adapter integrado fora do modo mock", () => {
    const inMemory = { kind: "in-memory" };
    const integrated = { kind: "integrated" };

    expect(selectTrainingAdapter(false, { inMemory, integrated })).toBe(integrated);
  });

  test("a implementação in-memory oferece todas as capacidades do contrato", () => {
    const requiredMethods = [
      "getOptionalUser",
      "getUserById",
      "updateUser",
      "listAttempts",
      "listChallenges",
      "getChallengeById",
      "listRecommendations",
      "submitAttempt",
      "revealAttemptSolution",
    ] as const;

    const adapter = createInMemoryTrainingAdapter(createMockTrainingStore());
    for (const method of requiredMethods) {
      expect(adapter[method]).toBeFunction();
    }
  });

  test("o adapter in-memory preserva a sessão entre envio e revelação", async () => {
    const adapter = createInMemoryTrainingAdapter(createMockTrainingStore({
      feedbackForAnswer: () => ({
        score: 4,
        summary: "Ainda não.",
        strengths: ["Boa hipótese."],
        blindspots: ["Revise o efeito."],
      }),
    }));
    const user = await adapter.getOptionalUser();
    const challenge = await adapter.getChallengeById("mock-effect-dependencies");

    expect(user).not.toBeNull();
    expect(challenge).not.toBeNull();
    const submitted = await adapter.submitAttempt(user!.id, challenge!.id, {
      userAnswer: "O efeito está com dependências incompletas.",
    });
    const revealed = await adapter.revealAttemptSolution(user!.id, challenge!.id);
    const restored = await adapter.getChallengeById(challenge!.id, user!.id);

    expect(submitted.status).toBe("RETRY_AVAILABLE");
    expect(revealed.status).toBe("REVEALED");
    expect(restored?.attempts?.[0]).toMatchObject({
      sessionStatus: "REVEALED",
      userAnswer: "O efeito está com dependências incompletas.",
    });
  });
});
