# Question Bank

Banco-base editorial para futura promocao de seeds a desafios reais do Kodan.

## Totais

- Total: 75
- TypeScript: 50
- React: 25
- Debug: 38
- Explain-code: 22
- Explain-concept: 15

## Estrutura

Cada seed vive em um arquivo Markdown independente:

`content/question-bank/<language>/<theme>/<id>.md`

## Secoes obrigatorias

- Main Prompt
- Coverage Checklist
- Mini Snippet
- Expected Answer Summary
- Expansion Notes

## Tipos oficiais

### debug

- Runtime type sugerido: `debugging`
- Quando usar: quando o usuario precisa encontrar o erro, explicar impacto e propor fix.
- Cobertura minima:
  - Identificar a causa raiz no snippet
  - Explicar o impacto observavel para o usuario ou para o sistema
  - Propor a correcao minima segura com justificativa

### explain-code

- Runtime type sugerido: `explain-code`
- Quando usar: quando o valor esta em ler o snippet com precisao e explicar seu contrato.
- Cobertura minima:
  - Descrever o que o codigo esta tentando fazer
  - Explicar onde o contrato do codigo termina ou fica fragil
  - Apontar trade-offs, limites ou riscos da abordagem

### explain-concept

- Runtime type sugerido: `explain-concept`
- Quando usar: quando o foco e explicar um principio tecnico usando o snippet como ancora.
- Cobertura minima:
  - Definir o conceito usando o snippet como base
  - Explicar por que esse conceito importa na pratica
  - Conectar o conceito a uma decisao de modelagem ou manutencao

## Fluxo editorial

1. Edite `scripts/question-bank/bank-data.ts` para adicionar ou revisar seeds.
2. Rode `bun run question-bank:generate` para regenerar Markdown e docs derivadas.
3. Rode `bun run question-bank:validate` para validar contagem, estrutura e colisao de paths.
4. Promova para `content/challenges/` apenas quando a seed virar um desafio jogavel de verdade.

## Temas

- architecture-and-api-design: 10
- async-and-concurrency: 10
- async-ui-and-races: 5
- component-contracts-and-composition: 5
- derived-state-and-memoization: 5
- effects-and-lifecycle: 5
- generics-and-inference: 10
- state-and-immutability: 10
- state-and-rendering: 5
- types-and-narrowing: 10
