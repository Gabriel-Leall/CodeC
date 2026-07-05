---
id: react-state-001-nested-state-mutation
title: Mutacao de estado aninhado
language: react
theme: state-and-rendering
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1450
estimatedTime: 9
tags:
  - react
  - state
  - mutation
---

## Main Prompt
Explique por que esta atualizacao pode falhar em disparar o rerender esperado.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```tsx
const [profile, setProfile] = useState({ prefs: { compact: false } });

function enableCompact() {
  profile.prefs.compact = true;
  setProfile(profile);
}
```

## Expected Answer Summary
A resposta deve mostrar mutacao direta do objeto anterior e reuso da mesma referencia. React depende de identidade para detectar mudanca.

## Expansion Notes
Pode crescer para settings e forms.
