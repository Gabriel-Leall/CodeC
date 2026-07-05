---
id: ts-types-008-filter-boolean-narrowing
title: filter(Boolean) e narrowing
language: typescript
theme: types-and-narrowing
challengeType: explain-concept
difficulty: EASY
recommendedElo: 1290
estimatedTime: 7
tags:
  - typescript
  - array-filter
  - narrowing
---

## Main Prompt
Explique quando filter(Boolean) limpa dados em runtime sem comunicar o tipo desejado ao compilador.

## Coverage Checklist
1. Definir o conceito usando o snippet como base
2. Explicar por que esse conceito importa na pratica
3. Conectar o conceito a uma decisao de modelagem ou manutencao

## Mini Snippet
```ts
const raw: Array<string | undefined> = ["a", undefined, "b"];
const cleaned = raw.filter(Boolean);
```

## Expected Answer Summary
A resposta deve separar limpeza em runtime e type guard formal. Em varios contextos o compilador continua sem o narrowing ideal.

## Expansion Notes
Pode crescer para pipelines de normalizacao.
