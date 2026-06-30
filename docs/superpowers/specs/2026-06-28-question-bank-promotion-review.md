# Question Bank Promotion Review

## Goal

Avaliar o banco-base gerado em `content/question-bank/` e separar quais seeds devem ser promovidas primeiro a challenges reais do `CC`.

## Review Criteria

Cada seed foi avaliada com base em quatro critérios:

1. **Clareza do prompt**
2. **Legibilidade do snippet**
3. **Densidade diagnóstica**
4. **Aderência ao runtime atual do CC**

O runtime atual favorece itens que:

- mostram comportamento observável claro
- funcionam bem como leitura de snippet curto
- aceitam resposta livre com causa raiz + impacto + correção
- não dependem de UI nova ou rubric muito abstrata

## Findings

### O banco está forte em casos promocionáveis agora

Os melhores candidatos são os seeds de `debug` e parte dos `explain-code` com bug ou contrato claro no snippet. Eles já casam bem com o modelo atual de arena.

### O banco está mais forte em React do que em TypeScript puro para a primeira leva

Isso não é problema editorial. É consequência natural do runtime atual e do corpus existente do produto. React já conversa melhor com o formato presente de challenge.

### Parte dos `explain-concept` deve esperar

Os itens conceituais são bons para o banco-base, mas vários ainda estão abstratos demais para virarem os primeiros challenges reais. Eles tendem a pedir mais contexto, mais rubric ou evolução do posicionamento do produto.

### Alguns snippets curtos demais precisam de expansão leve antes da promoção

Os seeds continuam bons, mas alguns funcionam melhor como “semente editorial” do que como arena final de treino. Nesses casos, o ideal é expandir de 3-6 linhas para um cenário curto, porém situacional.

## Promote Now

Estas são as seeds com melhor relação entre qualidade editorial, sinal diagnóstico e compatibilidade com o `CC` atual.

### Wave 1A: React

1. `react-effects-001-stale-closure-interval`
Motivo: bug clássico, observável, fácil de pontuar, ótimo para entrada de corpus.

2. `react-effects-002-object-dependency-loop`
Motivo: alinha com bug real de produção, tem boa legibilidade e conversa com o padrão atual dos challenges React.

3. `react-effects-005-event-listener-stale-prop`
Motivo: mistura lifecycle e stale closure de forma madura sem ficar grande demais.

4. `react-async-001-fetch-out-of-order`
Motivo: excelente caso de race real em UI, fácil de expandir para cenário de produto.

5. `react-async-003-loading-flag-shared-between-requests`
Motivo: ensina concorrência de UI com efeito prático claro para usuário.

6. `react-state-001-nested-state-mutation`
Motivo: muito compatível com o modelo de “diagnose o bug e explique a correção”.

7. `react-state-003-key-instability-on-reorder`
Motivo: forte valor de entrevista e manutenção; bom equilíbrio entre conceito e sintoma.

8. `react-memo-001-usememo-side-effect`
Motivo: excelente para separar memoização de efeito colateral, com chance alta de boa avaliação automática.

9. `react-memo-002-filtered-list-stale-dependency`
Motivo: claro, curto e muito alinhado com problemas reais de dependência.

10. `react-contracts-001-controlled-uncontrolled-input`
Motivo: caso simples, conhecido e com feedback técnico bem objetivo.

### Wave 1B: TypeScript

1. `ts-types-003-user-defined-type-guard-lie`
Motivo: ótimo primeiro challenge puro de TypeScript; une type system e risco de runtime.

2. `ts-arch-003-overload-contract-drift`
Motivo: muito forte editorialmente, com bug conceitual claro e snippet curto.

3. `ts-state-001-shallow-copy-nested-state`
Motivo: ótimo ponto de entrada para imutabilidade em TypeScript, com boa observabilidade.

4. `ts-async-003-abort-controller-leak`
Motivo: caso moderno, relevante e com potencial de expansão sem perder clareza.

5. `ts-generics-006-api-helper-returns-any`
Motivo: excelente para mostrar generic “decorativo” e contrato mentiroso.

6. `ts-types-005-in-operator-on-partial-record`
Motivo: curto, pedagógico e bom para testar leitura precisa do narrowing.

## Promote After Small Expansion

Estas seeds são boas, mas eu não promoveria antes de uma expansão editorial pequena.

1. `react-async-004-retry-button-double-submit`
Precisa de um contexto de botão/form para o sintoma ficar mais concreto.

2. `react-state-004-optimistic-counter-race`
Boa seed, mas pede cenário um pouco mais real de concorrência para ficar memorável.

3. `react-contracts-004-component-api-incompatible-default`
Hoje está correta, mas ainda parece mais heurística de design do que incidente de produto.

4. `ts-async-001-race-guard-after-await`
Boa, mas ganha muito se o objeto mutável tiver contexto de domínio mais concreto.

5. `ts-async-007-stale-cache-write`
Forte tecnicamente; precisa de mais contexto de “quem escreve no cache” para avaliação melhor.

6. `ts-state-009-defensive-copy-at-boundary`
Boa seed, mas se beneficia de consumidor externo explícito para tornar o bug menos abstrato.

7. `ts-generics-001-generic-constraint-too-wide`
Funciona, mas ainda parece levemente “acadêmica” no formato atual.

8. `ts-generics-008-generic-reducer-action-payload`
Boa densidade, porém precisa de duas ou três actions para ficar mais legível como challenge.

## Hold For Later

Estas seeds devem permanecer no banco-base por enquanto. O problema não é qualidade baixa; o problema é aderência menor ao runtime atual do produto.

1. `react-effects-004-strict-mode-double-invoke`
Boa conceitualmente, mas tende a virar resposta abstrata demais.

2. `react-state-005-state-machine-vs-boolean-matrix`
Ótima para design e arquitetura, fraca como arena curta hoje.

3. `react-async-005-cache-stampede-in-component`
Conceito bom, mas o snippet ainda está simples demais para sustentar a discussão sozinho.

4. `react-contracts-003-prop-drilling-vs-context`
Mais debate de arquitetura do que diagnóstico de snippet.

5. `ts-arch-001-result-object-vs-throw`
Excelente material didático, mas não para primeira leva de challenge real.

6. `ts-arch-007-event-payload-versioning`
Tema importante, porém abstrato demais para o posicionamento atual da arena.

7. `ts-async-010-semaphore-fairness`
Conceitualmente rico, mas exige contexto mais avançado do que o snippet entrega.

8. `ts-generics-009-builder-pattern-inference-stall`
Tema bom, porém pede mais código e mais contexto para avaliação justa.

## Recommendation

### First promotion batch

Promover primeiro 12 seeds:

- `react-effects-001-stale-closure-interval`
- `react-effects-002-object-dependency-loop`
- `react-effects-005-event-listener-stale-prop`
- `react-async-001-fetch-out-of-order`
- `react-async-003-loading-flag-shared-between-requests`
- `react-state-001-nested-state-mutation`
- `react-state-003-key-instability-on-reorder`
- `react-memo-001-usememo-side-effect`
- `react-contracts-001-controlled-uncontrolled-input`
- `ts-types-003-user-defined-type-guard-lie`
- `ts-arch-003-overload-contract-drift`
- `ts-state-001-shallow-copy-nested-state`

### Why this batch

- mistura React forte com 3 TypeScript puros para abrir a nova trilha sem forçar demais o runtime
- privilegia bugs observáveis e respostas fáceis de rubricar
- evita começar por seeds muito filosóficas ou abstratas
- dá diversidade suficiente de hooks, estado, async, contratos e types

## Next Step

Se a próxima etapa for implementação, a ordem recomendada é:

1. promover esses 12 seeds para `content/challenges/`
2. manter estrutura split (`challenge.json` + `code.tsx` + `solution.md`)
3. calibrar `question` no formato que a arena atual entende
4. só depois abrir uma segunda leva com os itens “Promote After Small Expansion”
