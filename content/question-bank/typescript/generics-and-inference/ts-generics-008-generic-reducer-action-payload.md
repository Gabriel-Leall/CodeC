---
id: ts-generics-008-generic-reducer-action-payload
title: Reducer generico enfraquece payload
language: typescript
theme: generics-and-inference
challengeType: debug
difficulty: HARD
recommendedElo: 1670
estimatedTime: 12
tags:
  - typescript
  - reducer
  - actions
  - generics
---

## Main Prompt
Explique por que este reducer generico perde o vinculo entre tipo de acao e payload.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
type Action<T> = { type: string; payload: T };

function reducer<T>(state: T, action: Action<T>) {
  if (action.type === "reset") return action.payload;
  return state;
}
```

## Expected Answer Summary
A resposta deve mostrar que um generic unico para todas as acoes nao representa familias diferentes de eventos. Union discriminada comunica melhor.

## Expansion Notes
Pode crescer para stores e command reducers.
