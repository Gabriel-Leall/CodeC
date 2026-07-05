---
id: react-state-004-optimistic-counter-race
title: Race em update otimista
language: react
theme: state-and-rendering
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1500
estimatedTime: 9
tags:
  - react
  - optimistic-ui
  - state
---

## Main Prompt
Explique por que cliques rapidos podem deixar este contador em valor errado.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```tsx
const [likes, setLikes] = useState(0);

async function like() {
  setLikes(likes + 1);
  await saveLike();
}
```

## Expected Answer Summary
A resposta deve mostrar colisao entre eventos que usam o mesmo snapshot antigo. Update funcional reduz o problema.

## Expansion Notes
Pode crescer para reactions e attempts.
