---
id: ts-state-003-map-mutation-hidden-in-helper
title: Mutacao escondida em helper de Map
language: typescript
theme: state-and-immutability
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1490
estimatedTime: 9
tags:
  - typescript
  - map
  - mutation
---

## Main Prompt
Explique por que este helper devolve a mesma estrutura viva e por que isso e perigoso.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
function addUser(state: Map<string, string>, id: string, name: string) {
  state.set(id, name);
  return state;
}
```

## Expected Answer Summary
A resposta deve mostrar que Map e mutavel por natureza; retornar a mesma referencia sabota cache, snapshots e comparacoes por identidade.

## Expansion Notes
Pode crescer para historico e undo/redo.
