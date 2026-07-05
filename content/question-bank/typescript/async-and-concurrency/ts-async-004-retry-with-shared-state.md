---
id: ts-async-004-retry-with-shared-state
title: Retry com estado mutavel compartilhado
language: typescript
theme: async-and-concurrency
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1520
estimatedTime: 9
tags:
  - typescript
  - retry
  - mutable-state
---

## Main Prompt
Explique por que este retry mistura controle de tentativas com estado de dominio.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
async function retrySend(job: { attempts: number; payload: string }) {
  job.attempts++;
  try {
    return await send(job.payload);
  } catch {
    if (job.attempts < 3) return retrySend(job);
    throw new Error("failed");
  }
}
```

## Expected Answer Summary
A resposta deve mostrar que as tentativas reutilizam e mutam o mesmo objeto, o que polui log, auditoria e raciocinio. Contador separado ou snapshot tornam o fluxo mais honesto.

## Expansion Notes
Pode crescer para fila com backoff.
