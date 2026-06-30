---
id: ts-generics-004-mapped-type-key-remap
title: Remapeamento de chaves em mapped type
language: typescript
theme: generics-and-inference
challengeType: explain-concept
difficulty: MEDIUM
recommendedElo: 1420
estimatedTime: 9
tags:
  - typescript
  - mapped-types
  - template-literal-types
---

## Main Prompt
Explique o conceito de remapeamento de chaves e por que ele e util.

## Coverage Checklist
1. Definir o conceito usando o snippet como base
2. Explicar por que esse conceito importa na pratica
3. Conectar o conceito a uma decisao de modelagem ou manutencao

## Mini Snippet
```ts
type PrefixKeys<T> = {
  [K in keyof T as K]: T[K];
};
```

## Expected Answer Summary
A resposta deve explicar como mapped types conseguem transformar a superficie de um tipo de forma mecanica e segura. Em producao isso ajuda em adapters e contratos derivados.

## Expansion Notes
Pode crescer para serializacao e clients.
