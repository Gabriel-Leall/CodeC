---
id: ts-types-010-assert-function-contract
title: Assert function com contrato fraco
language: typescript
theme: types-and-narrowing
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1480
estimatedTime: 9
tags:
  - typescript
  - asserts
  - contract
---

## Main Prompt
Explique por que esta assert function e mais perigosa do que parece.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
function assertHasId(value: unknown): asserts value is { id: string } {
  if (!value) throw new Error("missing value");
}
```

## Expected Answer Summary
A resposta deve mostrar que asserts muda o fluxo de tipos de forma forte; se a checagem nao prova a existencia de id, o contrato mente para todo o codigo seguinte.

## Expansion Notes
Pode crescer para helpers de parsing.
