---
id: ts-arch-005-command-handler-idempotency
title: Handler e idempotencia
language: typescript
theme: architecture-and-api-design
challengeType: explain-code
difficulty: HARD
recommendedElo: 1640
estimatedTime: 12
tags:
  - typescript
  - commands
  - idempotency
---

## Main Prompt
Explique o que significa idempotencia neste handler e o que ainda falta para ela ser confiavel.

## Coverage Checklist
1. Descrever o que o codigo esta tentando fazer
2. Explicar onde o contrato do codigo termina ou fica fragil
3. Apontar trade-offs, limites ou riscos da abordagem

## Mini Snippet
```ts
async function completeAttempt(command: { attemptId: string }) {
  if (await alreadyCompleted(command.attemptId)) return;
  await markCompleted(command.attemptId);
}
```

## Expected Answer Summary
A resposta deve mostrar que a intencao existe, mas garantia real depende de persistencia atomica, isolamento e chave de deduplicacao.

## Expansion Notes
Pode crescer para submitAttempt e pagamentos.
