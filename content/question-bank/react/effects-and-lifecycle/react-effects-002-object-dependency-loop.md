---
id: react-effects-002-object-dependency-loop
title: Loop por dependencia instavel
language: react
theme: effects-and-lifecycle
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1450
estimatedTime: 9
tags:
  - react
  - useEffect
  - dependencies
---

## Main Prompt
Explique por que este effect reexecuta sem necessidade.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```tsx
function Search({ query }: { query: string }) {
  const filters = { query };

  useEffect(() => {
    fetchResults(filters);
  }, [filters]);

  return null;
}
```

## Expected Answer Summary
A resposta deve mostrar que o objeto filters muda de identidade a cada render. Isso basta para reacender o effect.

## Expansion Notes
Pode crescer para filtros e busca.
