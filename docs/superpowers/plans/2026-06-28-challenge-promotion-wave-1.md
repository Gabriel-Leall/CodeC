# Challenge Promotion Wave 1 Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promover a primeira leva de 12 seeds do question bank para challenges reais em `content/challenges/`.

**Architecture:** A wave 1 será materializada como conteúdo split (`challenge.json` + `code.tsx` + `solution.md`) e validada por um teste de presença/shape dos arquivos promovidos. O runtime e o schema existentes não serão alterados; apenas o corpus crescerá.

**Tech Stack:** Bun, TypeScript, Markdown, JSON

---

### Task 1: Teste de promoção

**Files:**
- Create: `scripts/question-bank/promote-wave-1.test.ts`

- [ ] **Step 1: Escrever o teste vermelho**

O teste deve verificar:
- presença dos 12 diretórios promovidos
- presença de `challenge.json`, `code.tsx` e `solution.md`
- `question` no formato que a arena atual entende

- [ ] **Step 2: Rodar o teste e confirmar falha**

Run: `bun test ./scripts/question-bank/promote-wave-1.test.ts`
Expected: FAIL por arquivos inexistentes

### Task 2: Materializar os 12 challenges

**Files:**
- Create: `scripts/question-bank/promote-wave-1.ts`
- Create: `content/challenges/**`

- [ ] **Step 1: Implementar o gerador da wave 1**

Criar manifesto com os 12 challenges priorizados e gerar:
- `challenge.json`
- `code.tsx`
- `solution.md`

- [ ] **Step 2: Rodar o gerador**

Run: `bun run ./scripts/question-bank/promote-wave-1.ts`
Expected: 12 challenges escritos em `content/challenges/`

- [ ] **Step 3: Atualizar o índice**

Run: `bun run db:sync:challenges:index`
Expected: `content/challenges/index.json` atualizado com a nova wave

### Task 3: Verificação final

**Files:**
- Verify only

- [ ] **Step 1: Reexecutar o teste da wave**

Run: `bun test ./scripts/question-bank/promote-wave-1.test.ts`
Expected: PASS

- [ ] **Step 2: Validar tipos**

Run: `bun run check-types`
Expected: PASS
