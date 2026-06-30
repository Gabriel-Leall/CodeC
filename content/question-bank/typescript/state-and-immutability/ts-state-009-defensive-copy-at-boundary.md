---
id: ts-state-009-defensive-copy-at-boundary
title: Falta de copia defensiva na borda
language: typescript
theme: state-and-immutability
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1470
estimatedTime: 9
tags:
  - typescript
  - defensive-copy
  - api-boundary
---

## Main Prompt
Explique por que essa classe continua exposta a mutacao externa mesmo sem setter publico.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
class SessionStore {
  constructor(private readonly sessions: string[]) {}

  list() {
    return this.sessions;
  }
}
```

## Expected Answer Summary
A resposta deve mostrar que encapsulamento por referencia e diferente de encapsulamento por sintaxe. Sem copia defensiva, o estado interno continua escapando.

## Expansion Notes
Pode crescer para stores e caches.
