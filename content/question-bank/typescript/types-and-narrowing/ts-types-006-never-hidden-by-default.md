---
id: ts-types-006-never-hidden-by-default
title: Default escondendo falta de exaustividade
language: typescript
theme: types-and-narrowing
challengeType: explain-code
difficulty: MEDIUM
recommendedElo: 1430
estimatedTime: 9
tags:
  - typescript
  - switch
  - never
---

## Main Prompt
Explique por que este default enfraquece a manutencao do switch.

## Coverage Checklist
1. Descrever o que o codigo esta tentando fazer
2. Explicar onde o contrato do codigo termina ou fica fragil
3. Apontar trade-offs, limites ou riscos da abordagem

## Mini Snippet
```ts
type Status = "draft" | "published";

function badge(status: Status) {
  switch (status) {
    case "draft":
      return "D";
    default:
      return "P";
  }
}
```

## Expected Answer Summary
A resposta deve mostrar que o default absorve novos casos silenciosamente e tira do compilador o papel de avisar sobre evolucao incompleta do dominio.

## Expansion Notes
Pode crescer para status de challenge.
