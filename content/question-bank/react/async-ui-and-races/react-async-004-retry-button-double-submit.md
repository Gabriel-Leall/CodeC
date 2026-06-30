---
id: react-async-004-retry-button-double-submit
title: Retry permite double submit
language: react
theme: async-ui-and-races
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1480
estimatedTime: 9
tags:
  - react
  - retry
  - double-submit
---

## Main Prompt
Explique por que cliques rapidos ainda podem duplicar envios aqui.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```tsx
const [submitting, setSubmitting] = useState(false);

async function retry() {
  if (submitting) return;
  setSubmitting(true);
  await submit();
  setSubmitting(false);
}
```

## Expected Answer Summary
A resposta deve mostrar janela entre evento e render com lock efetivo. Ref, serializacao ou disable imediato ajudam.

## Expansion Notes
Pode crescer para forms e attempts.
