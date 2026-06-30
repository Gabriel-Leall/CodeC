---
id: ts-generics-007-overload-vs-generic
title: Overload versus generic
language: typescript
theme: generics-and-inference
challengeType: explain-concept
difficulty: MEDIUM
recommendedElo: 1430
estimatedTime: 9
tags:
  - typescript
  - overload
  - generics
---

## Main Prompt
Explique quando overload comunica melhor a API do que um generic muito esperto.

## Coverage Checklist
1. Definir o conceito usando o snippet como base
2. Explicar por que esse conceito importa na pratica
3. Conectar o conceito a uma decisao de modelagem ou manutencao

## Mini Snippet
```ts
function format(value: Date): string;
function format(value: number): string;
function format(value: Date | number) {
  return String(value);
}
```

## Expected Answer Summary
A resposta deve distinguir familias finitas de chamadas de relacoes parametricas reais entre entrada e saida.

## Expansion Notes
Pode crescer para helpers compartilhados.
