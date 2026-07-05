---
id: ts-generics-010-covariance-assumption-array
title: Covariancia inocente em array mutavel
language: typescript
theme: generics-and-inference
challengeType: debug
difficulty: HARD
recommendedElo: 1710
estimatedTime: 12
tags:
  - typescript
  - variance
  - arrays
---

## Main Prompt
Explique por que esta atribuicao abre um buraco de tipo na pratica.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
type Animal = { kind: "animal" };
type Dog = Animal & { bark(): void };

const dogs: Dog[] = [];
const animals: Animal[] = dogs;
animals.push({ kind: "animal" });
```

## Expected Answer Summary
A resposta deve conectar variancia a leitura versus escrita. Estruturas mutaveis nao aceitam a mesma conversa de uma colecao readonly.

## Expansion Notes
Pode crescer para colecoes expostas entre camadas.
