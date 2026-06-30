---
id: ts-types-004-satisfies-vs-as
title: satisfies versus as
language: typescript
theme: types-and-narrowing
challengeType: explain-concept
difficulty: MEDIUM
recommendedElo: 1410
estimatedTime: 9
tags:
  - typescript
  - satisfies
  - as
  - inference
---

## Main Prompt
Explique a diferenca entre satisfies e as usando este exemplo.

## Coverage Checklist
1. Definir o conceito usando o snippet como base
2. Explicar por que esse conceito importa na pratica
3. Conectar o conceito a uma decisao de modelagem ou manutencao

## Mini Snippet
```ts
const config = {
  mode: "strict",
  retries: 3,
} satisfies Record<string, string | number>;

const unsafe = {
  mode: "strict",
  retries: 3,
} as Record<string, string | number>;
```

## Expected Answer Summary
A resposta deve mostrar que satisfies checa compatibilidade sem perder inferencia precisa do valor original, enquanto as apenas força uma visao possivelmente enganosa.

## Expansion Notes
Pode crescer para config e design tokens.
