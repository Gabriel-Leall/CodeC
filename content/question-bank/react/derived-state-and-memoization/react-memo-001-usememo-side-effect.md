---
id: react-memo-001-usememo-side-effect
title: Side effect dentro de useMemo
language: react
theme: derived-state-and-memoization
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1490
estimatedTime: 9
tags:
  - react
  - useMemo
  - side-effects
---

## Main Prompt
Explique por que este useMemo esta sendo usado para a responsabilidade errada.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```tsx
const total = useMemo(() => {
  analytics.track("cart-recalculated");
  return items.reduce((sum, item) => sum + item.price, 0);
}, [items]);
```

## Expected Answer Summary
A resposta deve separar memoizacao de calculo puro e side effect observavel. O tracking precisa de outro lugar mais explicito.

## Expansion Notes
Pode crescer para metricas e tracing.
