---
id: ts-types-003-user-defined-type-guard-lie
title: Type guard que mente
language: typescript
theme: types-and-narrowing
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1490
estimatedTime: 9
tags:
  - typescript
  - type-guard
  - runtime
---

## Main Prompt
Explique por que este type guard e perigoso mesmo deixando o codigo mais elegante.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
function isLoaded(value: unknown): value is { id: string; ready: true } {
  return Boolean(value);
}
```

## Expected Answer Summary
A resposta deve mostrar que o predicado promete demais ao compilador e prova de menos em runtime. Validacao frouxa gera falsa seguranca.

## Expansion Notes
Pode crescer para parsers e schema validation.
