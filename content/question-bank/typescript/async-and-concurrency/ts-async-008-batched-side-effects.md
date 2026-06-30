---
id: ts-async-008-batched-side-effects
title: Lote com side effects fora de ordem
language: typescript
theme: async-and-concurrency
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1510
estimatedTime: 9
tags:
  - typescript
  - batch
  - side-effects
---

## Main Prompt
Explique por que este lote nao garante a ordem global que o time talvez suponha.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
async function processAll(ids: string[]) {
  await Promise.all(ids.map(async id => {
    await persist(id);
    audit(id);
  }));
}
```

## Expected Answer Summary
A resposta deve mostrar que o audit dispara por ordem de conclusao de cada item, nao pela ordem do array. Se a auditoria exigir ordem global, o desenho esta errado.

## Expansion Notes
Pode crescer para pipeline com etapas separadas.
