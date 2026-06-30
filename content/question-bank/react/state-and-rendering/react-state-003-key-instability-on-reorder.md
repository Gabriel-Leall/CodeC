---
id: react-state-003-key-instability-on-reorder
title: Key instavel em lista reordenavel
language: react
theme: state-and-rendering
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1480
estimatedTime: 9
tags:
  - react
  - keys
  - lists
---

## Main Prompt
Explique por que usar indice como key pode misturar estado visual entre linhas.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```tsx
items.map((item, index) => <Row key={index} item={item} />);
```

## Expected Answer Summary
A resposta deve mostrar que indice nao representa identidade quando a ordem muda. O React pode reaproveitar a instancia errada.

## Expansion Notes
Pode crescer para trees e tabelas editaveis.
