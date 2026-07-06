import { describe, expect, it } from "bun:test";

import { getChallengeTags, getStatusPresentation } from "./ema-challenge-card-helpers";

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

  it("normaliza as tags do desafio para uso nos componentes", () => {
    expect(getChallengeTags("react, hooks,  race condition ,,")).toEqual([
      "react",
      "hooks",
      "race condition",
    ]);
  });
});
