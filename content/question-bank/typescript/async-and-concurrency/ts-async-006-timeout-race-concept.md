---
id: ts-async-006-timeout-race-concept
title: Race entre timeout e operacao
language: typescript
theme: async-and-concurrency
challengeType: explain-concept
difficulty: MEDIUM
recommendedElo: 1460
estimatedTime: 9
tags:
  - typescript
  - promise-race
  - timeout
---

## Main Prompt
Usando o snippet, explique por que Promise.race nao cancela sozinho o trabalho perdedor.

## Coverage Checklist
1. Definir o conceito usando o snippet como base
2. Explicar por que esse conceito importa na pratica
3. Conectar o conceito a uma decisao de modelagem ou manutencao

## Mini Snippet
```ts
function withTimeout(work: Promise<unknown>, ms: number) {
  return Promise.race([
    work,
    new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}
```

## Expected Answer Summary
A resposta deve separar resultado da interface e ciclo de vida real das tarefas. O perdedor continua vivo sem protocolo cooperativo de cancelamento.

## Expansion Notes
Pode crescer para fetch com AbortController.
