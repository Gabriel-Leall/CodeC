---
id: react-contracts-004-component-api-incompatible-default
title: Default de prop quebra contrato
language: react
theme: component-contracts-and-composition
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1470
estimatedTime: 9
tags:
  - react
  - component-api
  - defaults
---

## Main Prompt
Explique por que este default e tecnicamente valido, mas editorialmente ruim para a API.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```tsx
function Avatar({ size = 0 }: { size?: number }) {
  return <img width={size} height={size} />;
}
```

## Expected Answer Summary
A resposta deve mostrar que defaults precisam ter semantica util. Um 0 aqui cria comportamento invisivel ou invalido por padrao.

## Expansion Notes
Pode crescer para pacote UI compartilhado.
