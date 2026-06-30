# Challenge Promotion Wave 3

## Goal

Promover os quatro seeds restantes marcados como `Promote Now` na revisão editorial para `content/challenges/`, mantendo o contrato split (`challenge.json`, `code.tsx`, `solution.md`) e o formato de pergunta da arena.

## Scope

Seeds desta wave:

1. `react-memo-002-filtered-list-stale-dependency`
2. `ts-async-003-abort-controller-leak`
3. `ts-generics-006-api-helper-returns-any`
4. `ts-types-005-in-operator-on-partial-record`

## Tasks

### Task 1: Teste de promoção da wave 3

- Criar `scripts/question-bank/promote-wave-3.test.ts`
- Verificar existência dos quatro diretórios promovidos
- Verificar presença de `challenge.json`, `code.tsx` e `solution.md`
- Verificar que `question` mantém o formato:
  - `Na sua resposta, cubra:`
  - `1)`
  - `2)`
  - `3)`

### Task 2: Gerador da wave 3

- Criar `scripts/question-bank/promote-wave-3.ts`
- Expandir os seeds em desafios completos no mesmo contrato das waves 1 e 2
- Preservar categorias coerentes com o runtime atual:
  - `react-rendering`
  - `typescript-async`
  - `typescript-generics`
  - `typescript-types`

### Task 3: Integração e validação

- Rodar `bun test ./scripts/question-bank/promote-wave-3.test.ts`
- Rodar `bun run ./scripts/question-bank/promote-wave-3.ts`
- Rodar `bun run db:sync:challenges:index`
- Rodar:
  - `bun test ./scripts/question-bank/question-bank.test.ts`
  - `bun test ./scripts/question-bank/promote-wave-1.test.ts`
  - `bun test ./scripts/question-bank/promote-wave-2.test.ts`
  - `bun test ./scripts/question-bank/promote-wave-3.test.ts`
  - `bun run check-types`
  - `bun run question-bank:validate`
  - `npx react-doctor@latest --scope changed --base main --verbose`
