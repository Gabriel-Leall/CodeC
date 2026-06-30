---
id: react-contracts-001-controlled-uncontrolled-input
title: Input alterna entre controlado e nao controlado
language: react
theme: component-contracts-and-composition
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1450
estimatedTime: 9
tags:
  - react
  - forms
  - controlled
---

## Main Prompt
Explique por que este componente pode alternar entre dois contratos de input.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```tsx
function NameField({ value }: { value?: string }) {
  return <input value={value} />;
}
```

## Expected Answer Summary
A resposta deve mostrar que undefined em alguns renders e string em outros pode alternar o contrato do input. O componente precisa de uma escolha consistente.

## Expansion Notes
Pode crescer para onboarding e form builder.
