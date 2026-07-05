---
id: ts-types-002-discriminated-union-exhaustiveness
title: Exhaustividade em uniao discriminada
language: typescript
theme: types-and-narrowing
challengeType: explain-code
difficulty: EASY
recommendedElo: 1250
estimatedTime: 7
tags:
  - typescript
  - union
  - never
---

## Main Prompt
Explique o papel do branch com never neste switch.

## Coverage Checklist
1. Descrever o que o codigo esta tentando fazer
2. Explicar onde o contrato do codigo termina ou fica fragil
3. Apontar trade-offs, limites ou riscos da abordagem

## Mini Snippet
```ts
type Result =
  | { kind: "ok"; value: string }
  | { kind: "error"; message: string };

function label(result: Result) {
  switch (result.kind) {
    case "ok":
      return result.value;
    case "error":
      return result.message;
    default: {
      const _exhaustive: never = result;
      return _exhaustive;
    }
  }
}
```

## Expected Answer Summary
A resposta deve explicar como o discriminante permite narrowing preciso e como never vira alarme de manutencao quando novos casos entram no dominio.

## Expansion Notes
Pode crescer para status de treino ou pagamento.
