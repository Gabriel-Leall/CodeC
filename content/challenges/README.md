# Challenges Content

Cada desafio deve ficar em sua própria pasta:

`content/challenges/<categoria>/<slug>/`

Arquivos obrigatórios:

- `challenge.json` (metadados)
- `code.tsx` (código do desafio)
- `solution.md` (solução explicada)

Exemplo de `challenge.json`:

```json
{
  "id": "react-hooks-stale-closure-useeffect",
  "title": "O Fechamento Obsoleto (Stale Closure) no useEffect",
  "difficulty": "MEDIUM",
  "recommendedElo": 1400,
  "question": "Por que o contador trava no número 1?",
  "tags": ["useEffect", "stale-closure", "react-hooks"],
  "language": "react",
  "type": "find-bug",
  "estimatedTime": 8
}
```

Opcional em `challenge.json`:

- `codeFile`: nome do arquivo de código (padrão: `code.tsx`)
- `solutionFile`: nome do arquivo de solução (padrão: `solution.md`)
- `expectedAnswerFile`: alias de `solutionFile`
- `status`: ex.: `ACTIVE`, `DRAFT`
- `rubric`, `hints`, `commonMistakes` (metadados para avaliação)

Regras:

- `id` deve ser único em todo o repositório.
- Evite editar múltiplos desafios no mesmo commit sem necessidade.
- Prefira manter cada desafio autocontido na sua pasta.

Índice:

- O arquivo `content/challenges/index.json` é gerado automaticamente a partir das pastas.
- Rode:
  - `bun run db:sync:challenges:index` para atualizar só o índice
  - `bun run db:seed:challenges` para atualizar índice + aplicar seed no banco
