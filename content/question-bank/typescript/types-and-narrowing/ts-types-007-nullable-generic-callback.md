---
id: ts-types-007-nullable-generic-callback
title: Generic com null escondido no callback
language: typescript
theme: types-and-narrowing
challengeType: debug
difficulty: HARD
recommendedElo: 1650
estimatedTime: 12
tags:
  - typescript
  - generic
  - nullability
---

## Main Prompt
Explique onde esta API embaralha a responsabilidade entre chamador e callback.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
function mapLoaded<T>(value: T | null, project: (input: T) => string) {
  return value ? project(value) : null;
}
```

## Expected Answer Summary
A resposta deve discutir coerencia de retorno, nullability e como a API mistura mapa e branching. Talvez precise de outro nome ou outra forma.

## Expansion Notes
Pode crescer para helpers de loaders.
