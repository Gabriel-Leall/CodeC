---
id: ts-state-001-shallow-copy-nested-state
title: Copia rasa em estado aninhado
language: typescript
theme: state-and-immutability
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1450
estimatedTime: 9
tags:
  - typescript
  - immutability
  - object-spread
---

## Main Prompt
Explique por que esta atualizacao parece imutavel, mas ainda compartilha estrutura perigosa.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
type Preferences = { theme: { contrast: "low" | "high" } };

function update(state: Preferences) {
  const next = { ...state };
  next.theme.contrast = "high";
  return next;
}
```

## Expected Answer Summary
A resposta deve mostrar que o spread copia apenas o primeiro nivel; theme continua compartilhado e mutavel para leitores antigos.

## Expansion Notes
Pode crescer para stores e snapshots.
