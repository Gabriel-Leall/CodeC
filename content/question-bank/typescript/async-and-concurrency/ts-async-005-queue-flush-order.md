---
id: ts-async-005-queue-flush-order
title: Fila serial simplificada
language: typescript
theme: async-and-concurrency
challengeType: explain-code
difficulty: EASY
recommendedElo: 1280
estimatedTime: 7
tags:
  - typescript
  - queue
  - microtask
---

## Main Prompt
Explique quais garantias de ordem esta fila realmente oferece.

## Coverage Checklist
1. Descrever o que o codigo esta tentando fazer
2. Explicar onde o contrato do codigo termina ou fica fragil
3. Apontar trade-offs, limites ou riscos da abordagem

## Mini Snippet
```ts
let current = Promise.resolve();

export function enqueue(task: () => Promise<void>) {
  current = current.then(task);
  return current;
}
```

## Expected Answer Summary
A resposta deve mostrar que a fila serializa o encadeamento, mas erros podem quebrar a esteira se nao forem tratados, e nao ha durabilidade nenhuma.

## Expansion Notes
Pode crescer para executor com recovery por tarefa.
