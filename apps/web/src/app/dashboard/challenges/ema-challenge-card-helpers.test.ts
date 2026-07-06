import { describe, expect, it } from "bun:test";

import { getStatusPresentation } from "./ema-challenge-card-helpers";

describe("ema-challenge-card-helpers", () => {
  it("retorna estado intacto quando nao ha tentativas", () => {
    expect(getStatusPresentation([])).toEqual(
      expect.objectContaining({
        label: "Intacto",
        note: "Sem tentativas registradas",
      }),
    );
  });

  it("retorna estado resolvido quando a ultima tentativa passou", () => {
    expect(getStatusPresentation([{ id: "a1", score: 8 }])).toEqual(
      expect.objectContaining({
        label: "Resolvido",
      }),
    );
  });

  it("retorna estado revisar quando a ultima tentativa falhou", () => {
    expect(getStatusPresentation([{ id: "a1", score: 3 }])).toEqual(
      expect.objectContaining({
        label: "Revisar",
      }),
    );
  });
});
