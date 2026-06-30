---
id: react-state-005-state-machine-vs-boolean-matrix
title: Boolean matrix versus state machine
language: react
theme: state-and-rendering
challengeType: explain-concept
difficulty: HARD
recommendedElo: 1620
estimatedTime: 12
tags:
  - react
  - state-machine
  - booleans
---

## Main Prompt
Explique por que varias flags de UI independentes tendem a criar estados invalidos representaveis.

## Coverage Checklist
1. Definir o conceito usando o snippet como base
2. Explicar por que esse conceito importa na pratica
3. Conectar o conceito a uma decisao de modelagem ou manutencao

## Mini Snippet
```tsx
const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState(false);
const [error, setError] = useState(false);
```

## Expected Answer Summary
A resposta deve mostrar combinacoes impossiveis como loading+success ao mesmo tempo. Uniao discriminada ou state machine tornam o dominio mais honesto.

## Expansion Notes
Pode crescer para auth, submit e importadores.
