import { describe, expect, it } from "bun:test";

import {
  formatDifficultyLabel,
  formatSessionStatusLabel,
} from "./profile-formatters";
import type { ProfileDifficulty, ProfileSessionStatus } from "./profile-types";

describe("profile-formatters", () => {
  it("maps profile difficulty values into display labels", () => {
    expect(formatDifficultyLabel("EASY")).toBe("Fácil");
    expect(formatDifficultyLabel("MEDIUM")).toBe("Média");
    expect(formatDifficultyLabel("HARD")).toBe("Difícil");
  });

  it("maps profile session status values into display labels", () => {
    expect(formatSessionStatusLabel("resolved")).toBe("Resolvido");
    expect(formatSessionStatusLabel("in_progress")).toBe("Em progresso");
    expect(formatSessionStatusLabel("not_started")).toBe("Não iniciado");
  });

  it("rejects unsupported profile formatter values", () => {
    expect(() =>
      formatDifficultyLabel("UNKNOWN" as ProfileDifficulty),
    ).toThrow("Unsupported profile difficulty: UNKNOWN");
    expect(() =>
      formatSessionStatusLabel("paused" as ProfileSessionStatus),
    ).toThrow("Unsupported profile session status: paused");
  });
});
