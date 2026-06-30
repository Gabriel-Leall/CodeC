---
id: ts-generics-009-builder-pattern-inference-stall
title: Builder trava inferencia acumulada
language: typescript
theme: generics-and-inference
challengeType: explain-code
difficulty: HARD
recommendedElo: 1690
estimatedTime: 12
tags:
  - typescript
  - builder
  - inference
---

## Main Prompt
Explique o que esta API quer modelar e por que retornar this puro trava a especializacao do tipo.

## Coverage Checklist
1. Descrever o que o codigo esta tentando fazer
2. Explicar onde o contrato do codigo termina ou fica fragil
3. Apontar trade-offs, limites ou riscos da abordagem

## Mini Snippet
```ts
class QueryBuilder<T extends object> {
  select<K extends keyof T>(key: K) {
    return this;
  }
}
```

## Expected Answer Summary
A resposta deve mostrar que fluent APIs precisam carregar novo estado de tipo no retorno. this cru costuma congelar a inferencia.

## Expansion Notes
Pode crescer para form builder ou query builder.
