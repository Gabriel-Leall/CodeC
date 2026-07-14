import { describe, expect, test } from "bun:test";

import { isMockModeEnabled } from "./mock-mode";

describe("isMockModeEnabled", () => {
  test("não é ativado por uma variável de ambiente", () => {
    expect(isMockModeEnabled()).toBe(false);
  });
});
