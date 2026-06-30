---
id: react-contracts-002-children-as-function-explain
title: children como funcao
language: react
theme: component-contracts-and-composition
challengeType: explain-code
difficulty: MEDIUM
recommendedElo: 1390
estimatedTime: 9
tags:
  - react
  - composition
  - render-props
---

## Main Prompt
Explique o que este componente oferece ao consumidor usando children como funcao.

## Coverage Checklist
1. Descrever o que o codigo esta tentando fazer
2. Explicar onde o contrato do codigo termina ou fica fragil
3. Apontar trade-offs, limites ou riscos da abordagem

## Mini Snippet
```tsx
function Loader({ children }: { children: (ready: boolean) => React.ReactNode }) {
  return children(true);
}
```

## Expected Answer Summary
A resposta deve mostrar que o container delega a renderizacao final ao consumidor enquanto fornece contexto. Isso aumenta flexibilidade e tambem custo cognitivo.

## Expansion Notes
Pode crescer para shells e wrappers do trainer.
