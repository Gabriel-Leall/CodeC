---
id: react-memo-005-selector-over-derive-state
title: Seletor versus state derivado duplicado
language: react
theme: derived-state-and-memoization
challengeType: explain-concept
difficulty: MEDIUM
recommendedElo: 1410
estimatedTime: 9
tags:
  - react
  - selectors
  - derived-state
---

## Main Prompt
Explique quando um seletor derivado e melhor do que guardar mais state.

## Coverage Checklist
1. Definir o conceito usando o snippet como base
2. Explicar por que esse conceito importa na pratica
3. Conectar o conceito a uma decisao de modelagem ou manutencao

## Mini Snippet
```tsx
const visibleAttempts = attempts.filter(attempt => attempt.score >= minScore);
```

## Expected Answer Summary
A resposta deve mostrar que seletor preserva uma unica fonte de verdade e evita sincronizacao manual. Memoizacao entra apenas quando identidade ou custo importam.

## Expansion Notes
Pode crescer para stores e filtros.
