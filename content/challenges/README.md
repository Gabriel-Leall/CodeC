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
  "type": "debugging",
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

Tipos recomendados para `challenge.json`:

- `debugging`: quando o usuario precisa encontrar causa raiz, impacto e correcao segura.
- `explain-code`: quando o foco e leitura precisa de contrato, fluxo e limites do snippet.
- `explain-concept`: quando o foco e explicar um principio tecnico com base no caso.

Relacao com `content/question-bank/`:

- Seeds em `content/question-bank/` sao material editorial e nao entram direto no runtime.
- O mapeamento recomendado hoje e:
  - `debug` -> `debugging`
  - `explain-code` -> `explain-code`
  - `explain-concept` -> `explain-concept`
- So promova uma seed para `content/challenges/` quando ela ja tiver `challenge.json`, `code.tsx` e `solution.md` prontos para experiencia jogavel.

Índice:

- O arquivo `content/challenges/index.json` é gerado automaticamente a partir das pastas.
- Rode:
  - `bun run db:sync:challenges:index` para atualizar só o índice
  - `bun run db:seed:challenges` para atualizar índice + aplicar seed no banco
