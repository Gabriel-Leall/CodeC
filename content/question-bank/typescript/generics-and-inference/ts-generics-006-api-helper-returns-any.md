---
id: ts-generics-006-api-helper-returns-any
title: Generic declarativo com any escondido
language: typescript
theme: generics-and-inference
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1510
estimatedTime: 9
tags:
  - typescript
  - any
  - generics
  - api
---

## Main Prompt
Explique por que este helper parece tipado, mas devolve pouca seguranca real.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json() as any;
}
```

## Expected Answer Summary
A resposta deve mostrar que o generic apenas ecoa a expectativa do chamador sem validacao nenhuma. Parser real ou retorno mais honesto melhoram o contrato.

## Expansion Notes
Pode crescer para borda HTTP do produto.
