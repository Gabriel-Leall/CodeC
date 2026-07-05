---
id: ts-async-007-stale-cache-write
title: Stale write em cache
language: typescript
theme: async-and-concurrency
challengeType: debug
difficulty: HARD
recommendedElo: 1680
estimatedTime: 12
tags:
  - typescript
  - cache
  - stale-write
---

## Main Prompt
Explique como uma resposta lenta pode sobrescrever um valor mais novo no cache.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
const cache = new Map<string, string>();

async function refreshUser(id: string) {
  const value = await fetchUser(id);
  cache.set(id, value);
}
```

## Expected Answer Summary
A resposta deve apontar que ordem de disparo e ordem de conclusao divergem. Sem versao, token ou compare-and-set, uma resposta antiga pode vencer no armazenamento.

## Expansion Notes
Pode crescer para UI concorrente e optimistic update.
