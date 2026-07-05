---
id: ts-arch-008-service-locator-hidden-dependency
title: Dependencia escondida por service locator
language: typescript
theme: architecture-and-api-design
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1530
estimatedTime: 9
tags:
  - typescript
  - service-locator
  - testing
---

## Main Prompt
Explique por que esta funcao parece simples, mas fica pior de testar e de entender localmente.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
export async function scoreAttempt(id: string) {
  return container.aiScorer.score(id);
}
```

## Expected Answer Summary
A resposta deve mostrar que a assinatura nao revela dependencias reais. Injecao explicita melhora previsibilidade e teste.

## Expansion Notes
Pode crescer para AI scorer e adapters.
