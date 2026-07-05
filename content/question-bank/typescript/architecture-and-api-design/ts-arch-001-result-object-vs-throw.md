---
id: ts-arch-001-result-object-vs-throw
title: Resultado tipado versus throw
language: typescript
theme: architecture-and-api-design
challengeType: explain-concept
difficulty: MEDIUM
recommendedElo: 1400
estimatedTime: 9
tags:
  - typescript
  - result
  - exceptions
---

## Main Prompt
Explique a diferenca entre modelar falha como retorno tipado e modelar falha como excecao.

## Coverage Checklist
1. Definir o conceito usando o snippet como base
2. Explicar por que esse conceito importa na pratica
3. Conectar o conceito a uma decisao de modelagem ou manutencao

## Mini Snippet
```ts
type SaveResult =
  | { ok: true; id: string }
  | { ok: false; reason: "conflict" | "offline" };
```

## Expected Answer Summary
A resposta deve comparar fluxo explicito, ergonomia e propagacao. Result object torna falha parte do contrato publico.

## Expansion Notes
Pode crescer para actions e importadores.
