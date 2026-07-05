---
id: ts-async-001-race-guard-after-await
title: Guarda temporal perdida apos await
language: typescript
theme: async-and-concurrency
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1450
estimatedTime: 9
tags:
  - typescript
  - async
  - race-condition
---

## Main Prompt
Explique por que a guarda inicial nao torna este fluxo seguro ate o final.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
type Draft = { status: "open" | "closed"; items: string[] };

async function persistDraft(draft?: Draft) {
  if (!draft || draft.status === "closed") return;
  await Promise.resolve();
  return draft.items[0].toUpperCase();
}
```

## Expected Answer Summary
A resposta deve mostrar que o await abre uma janela temporal; o objeto pode mudar antes do uso final. Snapshot ou revalidacao apos o await fecham o buraco.

## Expansion Notes
Pode crescer para save otimista com edicao concorrente.
