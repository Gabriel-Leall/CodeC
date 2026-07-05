---
id: ts-state-007-array-sort-mutates-source
title: sort muta a fonte original
language: typescript
theme: state-and-immutability
challengeType: debug
difficulty: EASY
recommendedElo: 1230
estimatedTime: 7
tags:
  - typescript
  - array
  - sort
  - mutation
---

## Main Prompt
Explique por que esta funcao altera o input original mesmo parecendo apenas calcular uma visao ordenada.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
function ordered(scores: number[]) {
  return scores.sort((a, b) => a - b);
}
```

## Expected Answer Summary
A resposta deve apontar sort como operacao mutavel e sugerir copia antes da ordenacao.

## Expansion Notes
Pode crescer para rankings e feeds.
