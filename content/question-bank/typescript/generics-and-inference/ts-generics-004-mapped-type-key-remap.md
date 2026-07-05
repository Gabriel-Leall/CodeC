---
id: ts-generics-004-mapped-type-key-remap
title: Prefixando chaves em mapped type
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
Explique como esse mapped type renomeia chaves e por que esse tipo de transformacao e util.

## Coverage Checklist
1. Definir o conceito usando o snippet como base
2. Explicar por que esse conceito importa na pratica
3. Conectar o conceito a uma decisao de modelagem ou manutencao

## Mini Snippet
```ts
type PrefixKeys<T> = {
  [K in keyof T as `prefix_${string & K}`]: T[K];
};
```

## Expected Answer Summary
A resposta deve explicar que o mapped type reaproveita os valores de T enquanto cria novas chaves com prefixo. Em producao isso ajuda em adapters, payloads serializados e contratos derivados.

## Expansion Notes
Pode crescer para serializacao, clients e nomes derivados por convencao.
