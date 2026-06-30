---
id: ts-generics-002-infer-lost-in-wrapper
title: Inferencia perdida em wrapper
language: typescript
theme: generics-and-inference
challengeType: explain-code
difficulty: MEDIUM
recommendedElo: 1440
estimatedTime: 9
tags:
  - typescript
  - generics
  - inference
  - wrapper
---

## Main Prompt
Explique por que este wrapper apaga parte importante da assinatura do callback.

## Coverage Checklist
1. Descrever o que o codigo esta tentando fazer
2. Explicar onde o contrato do codigo termina ou fica fragil
3. Apontar trade-offs, limites ou riscos da abordagem

## Mini Snippet
```ts
function withLog(fn: (...args: any[]) => any) {
  return (...args: any[]) => {
    console.log(args);
    return fn(...args);
  };
}
```

## Expected Answer Summary
A resposta deve mostrar que o wrapper perde relacao entre parametros e retorno. Generic sobre args e retorno preservaria melhor a API original.

## Expansion Notes
Pode crescer para decorators e adapters.
