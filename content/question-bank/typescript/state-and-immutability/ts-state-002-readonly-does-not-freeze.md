---
id: ts-state-002-readonly-does-not-freeze
title: Readonly nao congela runtime
language: typescript
theme: state-and-immutability
challengeType: explain-concept
difficulty: EASY
recommendedElo: 1240
estimatedTime: 7
tags:
  - typescript
  - readonly
  - runtime
---

## Main Prompt
Explique por que readonly ajuda no contrato sem congelar o objeto em memoria.

## Coverage Checklist
1. Definir o conceito usando o snippet como base
2. Explicar por que esse conceito importa na pratica
3. Conectar o conceito a uma decisao de modelagem ou manutencao

## Mini Snippet
```ts
type User = { readonly name: string };
const user: User = { name: "Ana" };
```

## Expected Answer Summary
A resposta deve separar garantia de compilacao de garantia de runtime. readonly melhora API, mas nao substitui estrategia de imutabilidade real.

## Expansion Notes
Pode crescer para fronteiras entre pacotes.
