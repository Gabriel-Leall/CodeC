---
id: ts-arch-004-repository-leaks-db-shape
title: Repositorio vazando shape do banco
language: typescript
theme: architecture-and-api-design
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1510
estimatedTime: 9
tags:
  - typescript
  - repository
  - boundaries
---

## Main Prompt
Explique por que esta interface enfraquece a fronteira entre dominio e persistencia.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
type UserRow = { id: string; created_at: string; deleted_at: string | null };

interface UserRepository {
  findById(id: string): Promise<UserRow | null>;
}
```

## Expected Answer Summary
A resposta deve mostrar que o repositorio esta expondo detalhes de naming e serializacao da infra. DTO ou mapeamento reduzem acoplamento.

## Expansion Notes
Pode crescer para Prisma e Neon.
