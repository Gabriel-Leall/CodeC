---
id: react-contracts-003-prop-drilling-vs-context
title: Prop drilling versus context
language: react
theme: component-contracts-and-composition
challengeType: explain-concept
difficulty: MEDIUM
recommendedElo: 1420
estimatedTime: 9
tags:
  - react
  - context
  - props
---

## Main Prompt
Explique quando prop drilling e apenas composicao honesta e quando context passa a valer a pena.

## Coverage Checklist
1. Definir o conceito usando o snippet como base
2. Explicar por que esse conceito importa na pratica
3. Conectar o conceito a uma decisao de modelagem ou manutencao

## Mini Snippet
```tsx
function Page({ theme }: { theme: string }) {
  return <Sidebar theme={theme} />;
}
```

## Expected Answer Summary
A resposta deve mostrar que context nao e premio por poucas props. Ele vale quando a dependencia e transversal de verdade e tem varios consumidores.

## Expansion Notes
Pode crescer para theme, auth e config.
