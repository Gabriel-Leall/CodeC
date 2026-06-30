---
id: ts-generics-005-conditional-type-distribution
title: Distribuicao de conditional type
language: typescript
theme: generics-and-inference
challengeType: explain-code
difficulty: HARD
recommendedElo: 1660
estimatedTime: 12
tags:
  - typescript
  - conditional-types
  - distribution
---

## Main Prompt
Explique o que este tipo calcula quando recebe uma uniao e por que isso surpreende.

## Coverage Checklist
1. Descrever o que o codigo esta tentando fazer
2. Explicar onde o contrato do codigo termina ou fica fragil
3. Apontar trade-offs, limites ou riscos da abordagem

## Mini Snippet
```ts
type Boxed<T> = T extends string ? { value: T } : never;
type Result = Boxed<"a" | "b">;
```

## Expected Answer Summary
A resposta deve explicar distribuicao sobre unioes nuas e como embrulhar em tupla evita essa distribuicao quando ela nao e desejada.

## Expansion Notes
Pode crescer para transformacoes de schema.
