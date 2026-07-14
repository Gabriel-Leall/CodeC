import { describe, expect, test } from "bun:test";

import { isMockModeEnabled } from "./mock-mode";

describe("isMockModeEnabled", () => {
  test("ativa somente quando a variável recebe true", () => {
    expect(isMockModeEnabled("true")).toBe(true);
    expect(isMockModeEnabled("false")).toBe(false);
    expect(isMockModeEnabled(undefined)).toBe(false);
  });
});
