---
id: ts-generics-003-default-generic-masks-bug
title: Default generico mascara erro
language: typescript
theme: generics-and-inference
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1500
estimatedTime: 9
tags:
  - typescript
  - default-generic
  - api-design
---

## Main Prompt
Explique como o generic default aqui torna a API mais permissiva do que deveria.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
function pick<T = string>(value: T, key?: keyof T) {
  return key ? value[key] : value;
}
```

## Expected Answer Summary
A resposta deve mostrar que defaults podem esconder falta de especificacao real e gerar inferencia surpreendente. Talvez a API precise de overloads mais honestos.

## Expansion Notes
Pode crescer para utilitarios de forms.
