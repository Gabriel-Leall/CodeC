---
id: ts-state-006-clone-structured-vs-json
title: JSON clone versus clone real
language: typescript
theme: state-and-immutability
challengeType: explain-concept
difficulty: MEDIUM
recommendedElo: 1410
estimatedTime: 9
tags:
  - typescript
  - clone
  - serialization
---

## Main Prompt
Explique onde JSON.parse(JSON.stringify(...)) ajuda e onde ele quebra silenciosamente.

## Coverage Checklist
1. Definir o conceito usando o snippet como base
2. Explicar por que esse conceito importa na pratica
3. Conectar o conceito a uma decisao de modelagem ou manutencao

## Mini Snippet
```ts
const snapshot = JSON.parse(JSON.stringify({ createdAt: new Date(), tags: new Set(["a"]) }));
```

## Expected Answer Summary
A resposta deve mostrar que serializacao JSON perde tipos nao JSON como Date, Set e Map. Clonagem e serializacao sao problemas diferentes.

## Expansion Notes
Pode crescer para exportacao e snapshot.
