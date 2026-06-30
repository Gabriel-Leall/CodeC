---
id: ts-arch-007-event-payload-versioning
title: Versionamento de payload de evento
language: typescript
theme: architecture-and-api-design
challengeType: explain-concept
difficulty: HARD
recommendedElo: 1670
estimatedTime: 12
tags:
  - typescript
  - events
  - versioning
---

## Main Prompt
Explique por que payload de evento precisa de estrategia de evolucao e nao apenas de novos campos.

## Coverage Checklist
1. Definir o conceito usando o snippet como base
2. Explicar por que esse conceito importa na pratica
3. Conectar o conceito a uma decisao de modelagem ou manutencao

## Mini Snippet
```ts
type AttemptScoredV1 = {
  type: "attempt.scored";
  payload: { attemptId: string; score: number };
};
```

## Expected Answer Summary
A resposta deve conectar contrato de evento a consumidores independentes no tempo, replay e compatibilidade.

## Expansion Notes
Pode crescer para analytics e projections.
