---
id: ts-async-010-semaphore-fairness
title: Fairness em semaforo caseiro
language: typescript
theme: async-and-concurrency
challengeType: explain-concept
difficulty: HARD
recommendedElo: 1720
estimatedTime: 12
tags:
  - typescript
  - semaphore
  - fairness
---

## Main Prompt
Explique por que limitar concorrencia nao implica justica entre tarefas.

## Coverage Checklist
1. Definir o conceito usando o snippet como base
2. Explicar por que esse conceito importa na pratica
3. Conectar o conceito a uma decisao de modelagem ou manutencao

## Mini Snippet
```ts
class Semaphore {
  private active = 0;
  constructor(private readonly limit: number) {}

  async run<T>(task: () => Promise<T>) {
    while (this.active >= this.limit) await Promise.resolve();
    this.active++;
    try {
      return await task();
    } finally {
      this.active--;
    }
  }
}
```

## Expected Answer Summary
A resposta deve definir fairness e mostrar que polling nao estabelece fila justa. Algumas tarefas podem ser continuamente ultrapassadas.

## Expansion Notes
Pode crescer para fila FIFO real.
