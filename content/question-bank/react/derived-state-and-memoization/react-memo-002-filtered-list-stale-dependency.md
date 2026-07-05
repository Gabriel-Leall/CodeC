---
id: react-memo-002-filtered-list-stale-dependency
title: Memo com dependencia faltando
language: react
theme: derived-state-and-memoization
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1460
estimatedTime: 9
tags:
  - react
  - useMemo
  - dependencies
---

## Main Prompt
Explique por que esta lista memoizada pode ficar velha quando a busca muda.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```tsx
const visible = useMemo(() => {
  return items.filter(item => item.name.includes(query));
}, [items]);
```

## Expected Answer Summary
A resposta deve mostrar que o resultado depende de query e items. Sem a dependencia completa, a memoizacao devolve valor stale.

## Expansion Notes
Pode crescer para filtros do dashboard.
