---
id: ts-generics-001-generic-constraint-too-wide
title: Constraint generico largo demais
language: typescript
theme: generics-and-inference
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1470
estimatedTime: 9
tags:
  - typescript
  - generics
  - constraint
---

## Main Prompt
Explique por que este helper aceita entradas demais e depois compensa com cast.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
function firstId<T extends object>(items: T[]) {
  return items[0] && (items[0] as { id: string }).id;
}
```

## Expected Answer Summary
A resposta deve mostrar que o constraint quase nao comunica nada util. Se a funcao precisa de id, isso deveria aparecer no contrato do tipo.

## Expansion Notes
Pode crescer para repositorios e selects.
