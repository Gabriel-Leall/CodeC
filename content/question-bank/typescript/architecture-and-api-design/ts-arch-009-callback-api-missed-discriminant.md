---
id: ts-arch-009-callback-api-missed-discriminant
title: Callback sem discriminante suficiente
language: typescript
theme: architecture-and-api-design
challengeType: explain-code
difficulty: MEDIUM
recommendedElo: 1420
estimatedTime: 9
tags:
  - typescript
  - callback
  - discriminated-union
---

## Main Prompt
Explique por que este callback obriga o consumidor a inferir contexto por combinacao de opcionais.

## Coverage Checklist
1. Descrever o que o codigo esta tentando fazer
2. Explicar onde o contrato do codigo termina ou fica fragil
3. Apontar trade-offs, limites ou riscos da abordagem

## Mini Snippet
```ts
type Update = { value?: string; error?: string };

function subscribe(listener: (update: Update) => void) {}
```

## Expected Answer Summary
A resposta deve mostrar que estados invalidos ficam representaveis. Union discriminada ou eventos nomeados deixam a API mais legivel.

## Expansion Notes
Pode crescer para upload e feedback de treino.
