# Question Bank Authoring Guide

Guia canonico para criar, revisar e promover seeds do Kodan.

## O que este banco e

- `content/question-bank/` guarda seeds editoriais, nao desafios jogaveis finais.
- A fonte de verdade humana fica em `scripts/question-bank/bank-data.ts`.
- Os arquivos Markdown sao artefatos gerados para revisao, curadoria e futura promocao.

## Tipos de pergunta aceitos

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

## Regras editoriais

- Portugues por padrao.
- Snippet curto, cirurgico e com potencial de expansao.
- O prompt deve pedir raciocinio, nao apenas resposta decorada.
- `Expected Answer Summary` descreve o que uma boa resposta precisa cobrir.
- `Expansion Notes` registra como a seed poderia crescer para um desafio real.

## Fluxo recomendado

1. Escolha `language`, `theme` e `challengeType` antes de escrever o prompt.
2. Escreva o snippet minimo que ancora o raciocinio pedido.
3. Use o checklist canonico do tipo de pergunta, ajustando apenas a redacao do prompt.
4. Rode `bun run question-bank:generate`.
5. Rode `bun run question-bank:validate`.
6. Se a seed evoluir para runtime, crie uma pasta em `content/challenges/` com `challenge.json`, `code.tsx` e `solution.md`.

## Ponte para runtime

- Seed `debug` promove naturalmente para runtime `debugging`.
- Seed `explain-code` pode virar runtime `explain-code` ou permanecer sem `type` explicito, se o consumidor aceitar o default.
- Seed `explain-concept` vira runtime `explain-concept` quando a avaliacao pede explicacao de principio e trade-off.

## Temas atuais

- architecture-and-api-design: 10 seed(s)
- async-and-concurrency: 10 seed(s)
- async-ui-and-races: 5 seed(s)
- component-contracts-and-composition: 5 seed(s)
- derived-state-and-memoization: 5 seed(s)
- effects-and-lifecycle: 5 seed(s)
- generics-and-inference: 10 seed(s)
- state-and-immutability: 10 seed(s)
- state-and-rendering: 5 seed(s)
- types-and-narrowing: 10 seed(s)
