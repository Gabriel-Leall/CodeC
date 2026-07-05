# Question Bank Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar um banco-base versionado de seeds de TypeScript e React com toolkit minimo de geracao e validacao.

**Architecture:** O banco nasce de um manifesto TypeScript em `scripts/question-bank/`, e renderizado para Markdown em `content/question-bank/` e validado por testes e por um comando de validacao. O runtime atual de `content/challenges/` nao e alterado.

**Tech Stack:** Bun, TypeScript, Bun test, Markdown

---

## Task 1: Criar toolkit minimo do banco-base

**Files:**
- Create: `scripts/question-bank/question-bank.test.ts`
- Create: `scripts/question-bank/question-bank.ts`
- Create: `scripts/question-bank/bank-data.ts`
- Create: `scripts/question-bank/generate.ts`
- Create: `scripts/question-bank/validate.ts`
- Modify: `package.json`

- [ ] **Step 1: Escrever o teste vermelho do toolkit**

O teste deve verificar:
- renderizacao Markdown com todas as secoes
- validacao de Markdown invalido
- distribuicao minima de 75 seeds
- split de linguagem 50/25

- [ ] **Step 2: Rodar o teste e confirmar falha**

Run: `bun test scripts/question-bank/question-bank.test.ts`
Expected: FAIL por modulo/funcoes inexistentes

- [ ] **Step 3: Implementar manifesto, renderer e validador**

Criar:
- tipos de seed
- manifesto completo
- funcoes `renderSeedMarkdown`, `validateSeedMarkdown`, `collectQuestionBankStats`
- scripts `generate.ts` e `validate.ts`

- [ ] **Step 4: Rodar o teste e confirmar verde**

Run: `bun test scripts/question-bank/question-bank.test.ts`
Expected: PASS

## Task 2: Gerar o banco-base em Markdown

**Files:**
- Create: `content/question-bank/README.md`
- Create: `content/question-bank/typescript/**`
- Create: `content/question-bank/react/**`

- [ ] **Step 1: Gerar os arquivos**

Run: `bun run question-bank:generate`
Expected: `content/question-bank/` preenchido com 75 arquivos de seed + `README.md`

- [ ] **Step 2: Validar o banco gerado**

Run: `bun run question-bank:validate`
Expected: PASS com contagem total e por linguagem

## Task 3: Verificacao final

**Files:**
- Verify only

- [ ] **Step 1: Checar tipos**

Run: `bun run check-types`
Expected: PASS

- [ ] **Step 2: Reexecutar validacoes do banco**

Run: `bun test scripts/question-bank/question-bank.test.ts`
Expected: PASS

Run: `bun run question-bank:validate`
Expected: PASS
