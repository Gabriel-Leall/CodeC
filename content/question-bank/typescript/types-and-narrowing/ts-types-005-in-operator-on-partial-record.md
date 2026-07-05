---
id: ts-types-005-in-operator-on-partial-record
title: in em Record parcial
language: typescript
theme: types-and-narrowing
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1460
estimatedTime: 9
tags:
  - typescript
  - in-operator
  - record
---

## Main Prompt
Explique por que a existencia da chave ainda nao garante um valor utilizavel.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
function render(map: Partial<Record<string, string>>, key: string) {
  if (key in map) {
    return map[key].toUpperCase();
  }
}
```

## Expected Answer Summary
A resposta deve mostrar que in prova presenca da propriedade, nao valor definido. O contrato do tipo continua permitindo undefined.

## Expansion Notes
Pode crescer para dados hidratados do servidor.
