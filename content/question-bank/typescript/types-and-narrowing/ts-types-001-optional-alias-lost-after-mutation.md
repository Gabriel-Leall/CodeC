---
id: ts-types-001-optional-alias-lost-after-mutation
title: Alias invalida narrowing
language: typescript
theme: types-and-narrowing
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1440
estimatedTime: 9
tags:
  - typescript
  - narrowing
  - aliasing
---

## Main Prompt
Explique por que este narrowing nao continua valido apos a mutacao por outro alias.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
type Session = { user?: { name: string } };

function greet(session: Session) {
  if (!session.user) return;
  const same = session;
  same.user = undefined;
  return session.user.name;
}
```

## Expected Answer Summary
A resposta deve mostrar que o narrowing foi invalidado por mutacao do mesmo objeto atraves de outro alias. Snapshot da propriedade ou imutabilidade resolvem melhor.

## Expansion Notes
Pode crescer para contextos mutaveis por referencia.
