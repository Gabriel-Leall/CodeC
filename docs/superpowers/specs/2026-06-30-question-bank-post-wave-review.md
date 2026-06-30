# Question Bank Post-Wave Review

## Goal

Registrar o estado do banco apos as tres primeiras waves de promocao e ordenar o backlog restante de seeds que ainda nao viraram challenges reais.

## Current State

As primeiras tres waves cobriram todo o lote inicialmente marcado como:

- `Promote Now`
- `Promote After Small Expansion`

Resultado consolidado:

- banco-base mantido com `75` seeds
- `24` seeds promovidas para `content/challenges/`
- indice sincronizado em `74` challenges totais no runtime atual

## What Is Left

Restam os seeds que ja tinham sido classificados como `Hold For Later` na primeira revisao editorial:

1. `react-effects-004-strict-mode-double-invoke`
2. `react-state-005-state-machine-vs-boolean-matrix`
3. `react-async-005-cache-stampede-in-component`
4. `react-contracts-003-prop-drilling-vs-context`
5. `ts-arch-001-result-object-vs-throw`
6. `ts-arch-007-event-payload-versioning`
7. `ts-async-010-semaphore-fairness`
8. `ts-generics-009-builder-pattern-inference-stall`

## Why They Were Held

O padrao comum entre esses itens nao e baixa qualidade. O problema e outro:

- pedem mais contexto de produto do que o snippet entrega sozinho
- tendem a gerar resposta abstrata demais para o runtime atual da arena
- alguns funcionam melhor como design review ou architecture interview do que como bug diagnosis curto

## Revised Queue

Com base no corpus ja promovido, o melhor caminho agora e revisitar primeiro os itens que conseguem virar challenge real com reframing pequeno, sem exigir uma mudanca de produto.

### Tier 1: Revisit First

1. `react-effects-004-strict-mode-double-invoke`

Melhor caminho:

- reenquadrar como incidente observavel de duplicacao de efeito em ambiente de desenvolvimento
- pedir causa raiz + impacto + correcao segura para efeitos idempotentes

Motivo:

- o tema e atual
- conversa bem com engenharia React real
- ainda cabe em formato curto se o sintoma for concreto

2. `ts-arch-001-result-object-vs-throw`

Melhor caminho:

- reenquadrar como API inconsistente entre dois call sites
- trocar debate filosofico por um contrato observavel e contraditorio

Motivo:

- tem bom valor diagnostico
- pode funcionar como challenge de TypeScript/arquitetura se o snippet mostrar a incoerencia com clareza

3. `react-async-005-cache-stampede-in-component`

Melhor caminho:

- expandir para um componente com deduplicacao ausente entre renders ou entre interacoes rapidas
- mostrar repeticao concreta de chamadas

Motivo:

- assunto relevante
- ainda esta perto do runtime atual porque continua sendo problema observavel de UI/async

4. `ts-arch-007-event-payload-versioning`

Melhor caminho:

- trocar abstracao de contrato evolutivo por um producer e um consumer em conflito direto
- focar na quebra concreta em runtime

Motivo:

- forte editorialmente
- hoje esta abstrato demais, mas pode ficar bom com um incidente mais localizado

### Tier 2: Revisit Later

5. `react-contracts-003-prop-drilling-vs-context`

Motivo:

- tende a virar debate de design em vez de diagnostico
- bom para trilha de arquitetura, mas nao para proxima leva imediata

6. `ts-generics-009-builder-pattern-inference-stall`

Motivo:

- tema forte, mas exige snippet maior para ser justo
- ainda parece avancado demais para a leitura rapida da arena atual

### Tier 3: Keep Parked

7. `react-state-005-state-machine-vs-boolean-matrix`

Motivo:

- o valor principal esta em modelagem de estado, nao em bug curto
- ficaria melhor em outro formato de avaliacao

8. `ts-async-010-semaphore-fairness`

Motivo:

- complexo demais para o posicionamento atual do corpus
- alto risco de medir familiaridade teorica em vez de leitura pratica de codigo

## Recommendation

Se a proxima etapa voltar a ser implementacao, a melhor ordem e:

1. abrir uma `wave 4` apenas com `react-effects-004-strict-mode-double-invoke`
2. em seguida promover `ts-arch-001-result-object-vs-throw`
3. so depois decidir se vale abrir uma micro-wave com `react-async-005` e `ts-arch-007`

## Why This Order

- mantem o corpus avancando sem perder aderencia ao runtime atual
- evita entrar cedo demais em seeds que pedem formato novo de avaliacao
- preserva densidade diagnostica alta nas proximas promocoes
