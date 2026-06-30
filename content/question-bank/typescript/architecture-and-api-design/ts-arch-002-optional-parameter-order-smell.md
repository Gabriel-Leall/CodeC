---
id: ts-arch-002-optional-parameter-order-smell
title: Opcionais em cascata na assinatura
language: typescript
theme: architecture-and-api-design
challengeType: explain-code
difficulty: EASY
recommendedElo: 1260
estimatedTime: 7
tags:
  - typescript
  - api-design
  - parameters
---

## Main Prompt
Explique por que esta assinatura tende a envelhecer mal.

## Coverage Checklist
1. Descrever o que o codigo esta tentando fazer
2. Explicar onde o contrato do codigo termina ou fica fragil
3. Apontar trade-offs, limites ou riscos da abordagem

## Mini Snippet
```ts
function createAttempt(userId: string, score?: number, hintsUsed?: boolean, source?: string) {}
```

## Expected Answer Summary
A resposta deve apontar legibilidade ruim da chamada, acoplamento a ordem e manutencao pior do contrato.

## Expansion Notes
Pode crescer para APIs de analytics e scoring.
