# Challenge Promotion Wave 2 Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promover a segunda leva de 8 seeds que precisavam de pequena expansão para virarem challenges reais do `CC`.

**Architecture:** A wave 2 segue o mesmo modelo split da wave 1. O conteúdo será gerado por manifesto em `scripts/question-bank/`, validado por teste dedicado de presença e formato de pergunta, depois incorporado ao índice oficial de challenges.

**Tech Stack:** Bun, TypeScript, Markdown, JSON, React Doctor

---

### Task 1: Teste de promoção da wave 2

**Files:**
- Create: `scripts/question-bank/promote-wave-2.test.ts`

- [ ] **Step 1: Escrever o teste vermelho**

O teste deve verificar:
- presença dos 8 diretórios promovidos
- presença de `challenge.json`, `code.tsx` e `solution.md`
- `question` no formato que a arena atual entende

- [ ] **Step 2: Rodar o teste e confirmar falha**

Run: `bun test ./scripts/question-bank/promote-wave-2.test.ts`
Expected: FAIL por arquivos inexistentes

### Task 2: Materializar os 8 challenges

**Files:**
- Create: `scripts/question-bank/promote-wave-2.ts`
- Create: `content/challenges/**`

- [ ] **Step 1: Implementar o gerador da wave 2**

Criar manifesto com os 8 challenges da faixa `Promote After Small Expansion`.

- [ ] **Step 2: Rodar o gerador**

Run: `bun run ./scripts/question-bank/promote-wave-2.ts`
Expected: 8 challenges escritos em `content/challenges/`

- [ ] **Step 3: Atualizar o índice**

Run: `bun run db:sync:challenges:index`
Expected: `content/challenges/index.json` atualizado

### Task 3: Verificação final

**Files:**
- Verify only

- [ ] **Step 1: Reexecutar o teste da wave**

Run: `bun test ./scripts/question-bank/promote-wave-2.test.ts`
Expected: PASS

- [ ] **Step 2: Validar tipos**

Run: `bun run check-types`
Expected: PASS

- [ ] **Step 3: Rodar React Doctor**

Run: `npx react-doctor@latest --verbose --diff`
Expected: score sem regressão relevante; findings avaliados tecnicamente
