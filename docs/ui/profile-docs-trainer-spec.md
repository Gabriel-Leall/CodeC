# KODAN Profile Screen Spec

## Arquivo de referência

Use este arquivo como fonte principal de implementação e leitura por IA:

- `docs/ui/profile-docs-trainer-spec.md`

Este documento descreve duas versões da mesma tela de perfil do KODAN:

1. `Light / Docs-Trainer`
2. `Dark / Nanquim Quente`

O objetivo é transformar o mock visual em especificação de produto. A imagem deixa de ser apenas inspiração e passa a virar contrato de UI.

---

## 1. Objetivo da tela

A tela de perfil do KODAN é o `study dossier` do usuário.

Ela não deve parecer:

- dashboard SaaS genérico
- perfil social estilo feed
- tela gamificada infantil
- página de analytics corporativo

Ela deve parecer:

- caderno técnico de evolução
- painel pessoal de treino
- histórico acadêmico com cara de produto premium

A função da tela é responder rapidamente:

1. Quem é este usuário dentro do sistema?
2. Como ele está evoluindo?
3. Em quais tópicos ele é mais forte?
4. O que ele treinou recentemente?
5. O que vale treinar agora?

---

## 2. Escopo desta especificação

Este documento cobre:

- layout completo da página
- anatomia visual das duas versões
- tokens de cor
- tipografia
- bordas
- espaçamento
- hierarquia de blocos
- regras de componenteização
- comportamento esperado de cada área

Este documento não cobre:

- schema do banco
- cálculo de analytics
- regras de recomendação
- lógica de autenticação

---

## 3. Estrutura geral da página

As duas telas compartilham a mesma anatomia base.

### 3.1 Shell global

A página é composta por 3 zonas principais:

1. `Top Header`
2. `Left Sidebar`
3. `Main Profile Content`

### 3.2 Grid macro

Use um grid em desktop com esta lógica:

- `Sidebar`: largura fixa entre `260px` e `280px`
- `Content`: ocupa todo o restante
- `Header`: altura fixa entre `72px` e `80px`

Estrutura mental:

```txt
+--------------------------------------------------------------+
| Header global                                                |
+-------------+------------------------------------------------+
| Sidebar     | Main content                                   |
| esquerda    | perfil                                         |
| fixa        |                                                |
+-------------+------------------------------------------------+
```

### 3.3 Largura do conteúdo

No miolo da página, o conteúdo deve respeitar um container confortável.

Recomendação:

- `max-width`: `1240px` a `1320px`
- `padding horizontal`: `24px` a `32px`
- `padding vertical`: `20px` a `28px`

---

## 4. Ordem visual do conteúdo

Dentro do `Main Profile Content`, a ordem é esta:

1. `User Identity Header`
2. `Stats Row`
3. `Analytics Row`
   - `ELO Evolution`
   - `Topic Mastery`
4. `Operational Row`
   - `Recent Diagnosis Sessions`
   - `Recommended Challenges`
5. `Achievements Row`

### 4.1 Regra de prioridade

Prioridade visual:

1. identidade do usuário
2. elo atual e rank
3. evolução do elo
4. domínio por tópico
5. sessões recentes e recomendações
6. conquistas

Conquistas são úteis, mas não devem competir com o núcleo de estudo.

---

## 5. Componentes que devem existir

## 5.1 Componentes de shell

Estes devem ser reutilizáveis:

- `ProfileAppShell`
- `ProfileTopHeader`
- `ProfileSidebar`
- `ProfileSidebarSection`
- `ProfileSidebarNavItem`
- `ProfileSidebarTopicTree`

## 5.2 Componentes de identidade

- `ProfileHero`
- `ProfileAvatar`
- `ProfileIdentityBlock`
- `ProfileRankSummary`
- `ProfileMetaList`

## 5.3 Componentes de dados

- `ProfileStatsRow`
- `ProfileStatCard`
- `ProfileChartCard`
- `ProfileTopicMasteryCard`
- `ProfileRecentSessionsCard`
- `ProfileRecommendationsCard`
- `ProfileAchievementsCard`

## 5.4 Componentes internos reutilizáveis

- `SectionCard`
- `SectionCardHeader`
- `SectionCardLink`
- `DataTable`
- `ProgressBar`
- `AchievementBadge`
- `InlineMetric`
- `TopicRow`

## 5.5 O que deve ser componente próprio

Crie componente próprio quando:

- o bloco tiver título, conteúdo, footer e estados
- ele puder aparecer em outra tela
- ele tiver regras de estilo específicas demais

Exemplo:

- `ProfileTopicMasteryCard` deve ser componente próprio
- a linha individual de progresso pode ser `TopicRow`

---

## 6. Versão 1, Light / Docs-Trainer

## 6.1 Direção visual

Esta versão é a de fundo claro mostrada na imagem.

Ela deve transmitir:

- clareza documental
- calma
- foco
- sofisticação leve
- sensação de plataforma editorial de treino

### 6.1.1 O que evitar

- brilho tecnológico exagerado
- gradientes agressivos
- cards muito inflados
- excesso de cor
- sombras pesadas

---

## 7. Light Theme Tokens

Estes são os tokens recomendados para transformar a imagem em implementação consistente.

## 7.1 Fundo e superfícies

- `--profile-bg`: `#F8F7F3`
  - fundo geral do app
  - usado no canvas principal

- `--profile-surface`: `#FCFBF8`
  - superfície principal dos cards grandes
  - usado em hero stats, chart cards, tabelas e conquistas

- `--profile-surface-elevated`: `#FFFFFF`
  - superfícies mais “limpas”, como inputs e blocos muito focais

## 7.2 Bordas e divisórias

- `--profile-border`: `#E7E2D8`
  - borda padrão dos cards
  - divisórias internas
  - contorno de botões secundários

- `--profile-border-strong`: `#D9D3C7`
  - bordas que precisam um pouco mais de definição
  - árvore lateral e separações de header

## 7.3 Texto

- `--profile-text-primary`: `#1B2230`
  - títulos
  - números principais
  - nome do usuário

- `--profile-text-secondary`: `#5F6B7D`
  - descrições
  - metadados
  - labels secundários

- `--profile-text-muted`: `#8691A3`
  - cabeçalhos de tabela
  - observações
  - itens de apoio

## 7.4 Acentos

- `--profile-accent-blue`: `#2563EB`
  - links
  - linha do gráfico de ELO
  - estado ativo da sidebar
  - progresso de domínio por tópico
  - números de ELO destacados

- `--profile-accent-blue-soft`: `#E9F1FF`
  - fundo do item ativo da sidebar
  - áreas de destaque suaves

- `--profile-success`: `#2E8B57`
  - resultado resolvido

- `--profile-warning`: `#E08A1E`
  - dificuldade média
  - sequência atual se for mantida

- `--profile-danger`: `#D04848`
  - dificuldade difícil

## 7.5 Sombras

Use sombras muito discretas.

- `--profile-shadow-sm`: `0 6px 18px rgba(16, 24, 40, 0.04)`
- `--profile-shadow-md`: `0 10px 28px rgba(16, 24, 40, 0.05)`

Uso:

- cards grandes: `shadow-sm`
- hero header: no máximo `shadow-sm`
- não usar sombra em tudo

---

## 8. Versão 2, Dark / Nanquim Quente

## 8.1 Direção visual

Esta versão é a de fundo escuro mostrada na imagem.

Ela deve transmitir:

- profundidade calma
- leitura noturna confortável
- elegância técnica
- sofisticação em OLED

Não pode parecer:

- gamer UI
- cyberpunk
- terminal neon
- dark mode de contraste agressivo

---

## 9. Dark Theme Tokens

## 9.1 Fundo e superfícies

- `--profile-dark-bg`: `#111111`
  - fundo absoluto da tela
  - canvas geral

- `--profile-dark-surface`: `#161616`
  - cards
  - painéis de dados
  - sidebar

- `--profile-dark-surface-elevated`: `#1B1B1B`
  - superfícies focais
  - inputs
  - cards com mais prioridade

## 9.2 Bordas

- `--profile-dark-border`: `#222222`
  - borda padrão
  - divisórias
  - outlines suaves

- `--profile-dark-border-strong`: `#2B2B2B`
  - separação extra quando necessário

## 9.3 Texto

- `--profile-dark-text-primary`: `#F6F3ED`
  - títulos
  - números fortes
  - labels principais

- `--profile-dark-text-secondary`: `rgba(246, 243, 237, 0.74)`
  - descrições
  - linhas de apoio

- `--profile-dark-text-muted`: `rgba(246, 243, 237, 0.56)`
  - cabeçalhos de tabela
  - informações menos prioritárias

## 9.4 Acentos

- `--profile-dark-accent-blue`: `#5A8DBF`
  - linha do gráfico
  - links
  - estados ativos
  - barras de domínio

- `--profile-dark-accent-blue-soft`: `rgba(90, 141, 191, 0.16)`
  - fundo do item ativo da sidebar

- `--profile-dark-success`: `#6FBF73`
  - resolvido

- `--profile-dark-warning`: `#F1A64B`
  - dificuldade média

- `--profile-dark-danger`: `#E36B6B`
  - dificuldade difícil

## 9.5 Profundidade

No escuro, a separação vem por elevação de superfície, não por sombra.

Regras:

- base `#111111`
- cards `#161616`
- cards focais `#1B1B1B`
- borda `#222222`

Não usar:

- sombra preta visível
- glow exagerado

---

## 10. Tipografia

## 10.1 Papéis tipográficos

Use dois registros:

- `Display / Editorial Serif`
- `Product Sans / UI Sans`

### 10.1.1 Serif

Uso:

- nome do usuário
- título de blocos principais
- rank label de alto destaque

Características:

- peso `500` a `600`
- tracking neutro
- contraste elegante

### 10.1.2 Sans

Uso:

- navegação
- tabelas
- labels
- subtítulos
- números pequenos
- metadados

Características:

- muito legível
- sem personalidade excessiva
- bom comportamento em dark mode

## 10.2 Escala sugerida

- `profile-page-title`: `40px`
- `profile-section-title`: `20px`
- `profile-card-title`: `18px`
- `profile-body`: `14px`
- `profile-small`: `12px`
- `profile-micro`: `11px`

## 10.3 Regras

- o nome do usuário deve usar o maior destaque tipográfico da tela
- o ELO atual é o número mais importante depois do nome
- labels de tabela devem ficar em caixa baixa ou title case discreto, nunca gritados

---

## 11. Anatomia detalhada da tela

## 11.1 Header global

### Função

Navegação global e identificação do sistema.

### Conteúdo

Esquerda:

- marca `KODAN`
- monograma `K`

Centro:

- busca global

Direita:

- rank atual
- ELO atual
- avatar/menu do usuário

### Regras de layout

- altura fixa: `72px` a `80px`
- alinhamento vertical central
- separador inferior 1px
- busca central com largura entre `420px` e `540px`

### Componente

- `ProfileTopHeader`
- subcomponentes:
  - `BrandLockup`
  - `GlobalSearchInput`
  - `HeaderRankBlock`
  - `HeaderUserMenu`

---

## 11.2 Sidebar esquerda

### Função

Dar contexto de navegação e reforçar a taxonomia de estudo.

### Blocos

1. `Perfil`
2. `Tecnologias`
3. `Botão Exportar dados`

### Seção Perfil

Itens:

- Visão geral
- Progresso
- Histórico
- Conquistas
- Recomendações
- Configurações

### Seção Tecnologias

Estrutura em árvore:

- React
  - Effects & Lifecycle
  - State & Rendering
  - Async UI & Races
  - Forms & Validation
  - Component Patterns
- TypeScript
  - Type System
  - Generics & Advanced Types
  - Utility Types
  - Narrowing & Inference
  - Modules & Tooling
  - Best Practices

### Estado ativo

Na imagem, o item ativo é `Visão geral`.

Regras:

- fundo suave azul no claro
- fundo azul suave translúcido no escuro
- texto com mais contraste
- sem virar botão primário

### Componente

- `ProfileSidebar`
- `ProfileSidebarSection`
- `ProfileSidebarNavItem`
- `ProfileSidebarTopicTree`
- `ProfileSidebarFooterAction`

---

## 11.3 User Identity Header

### Função

Mostrar quem é o usuário, sua posição dentro do sistema e seus metadados pessoais.

### Estrutura

Esquerda:

- avatar grande
- nome
- selo opcional (`PRO`, por exemplo)
- tagline curta
- linha de metadados

Direita:

- bloco visual de rank
- bloco visual de ELO atual

### Conteúdo mostrado

- avatar
- `Nakamura`
- badge `PRO`
- frase curta
- membro desde
- país
- fuso horário
- rank `RONIN`
- ELO atual `1687`
- top percentual

### Regras

- nome do usuário: maior texto da tela
- rank e ELO ficam visíveis sem competir com o nome
- metadados em linha única ou quebra elegante

### Componente

- `ProfileHero`
- `ProfileIdentityBlock`
- `ProfileRankSummary`
- `ProfileMetaList`

---

## 11.4 Stats Row

### Função

Resumo de produtividade e consistência.

### Itens

- Desafios resolvidos
- Sequência atual
- Taxa de acerto
- Horas de estudo / Tempo de estudo
- Tentativas de desafios

### Estilo

- faixa horizontal única
- cinco colunas
- números em destaque
- labels acima ou ao lado, discretos
- divisórias verticais entre métricas

### Regras

- não usar cinco cards separados com sombra
- usar um único `SectionCard` com grid interno

### Componente

- `ProfileStatsRow`
- `ProfileStatCard` pode existir internamente, mas visualmente a faixa deve parecer única

---

## 11.5 Card de Evolução do ELO

### Função

Mostrar tendência temporal do progresso técnico.

### Conteúdo

- título `Evolução do ELO`
- seletor de período
- gráfico de linha
- tooltip no último ponto

### Estilo do gráfico

Claro:

- linha `--profile-accent-blue`
- grid bem leve
- fundo neutro sem textura

Escuro:

- linha `--profile-dark-accent-blue`
- grid quase invisível
- tooltip mais elevado que o fundo

### Regras

- gráfico deve parecer ferramenta de estudo, não fintech
- sem múltiplas séries
- sem legenda complexa
- um ponto final destacado basta

### Componente

- `ProfileEloChartCard`
- `ProfileTimeRangeSelect`
- `EloLineChart`

---

## 11.6 Card de Domínio por tópico

### Função

Mostrar confiança e progresso por área de estudo.

### Conteúdo

Linhas por tópico:

- Effects & Lifecycle
- State & Rendering
- Async UI & Races
- Forms & Validation
- Component Patterns

Cada linha tem:

- nome do tópico
- barra horizontal
- percentual

### Estilo

- barra base neutra
- preenchimento em azul
- percentual alinhado à direita

### Regra de dados

Mesmo se o cálculo ainda for mockado, o componente deve aceitar payload real:

```ts
type TopicMasteryItem = {
  topicId: string
  label: string
  proficiency: number
}
```

### Componente

- `ProfileTopicMasteryCard`
- `TopicRow`
- `ProgressBar`

---

## 11.7 Card de Sessões de diagnóstico recentes

### Função

Mostrar histórico operacional recente.

### Colunas

- Data
- Desafio
- Dificuldade
- Resultado
- ELO

### Estado visual

Resultados:

- `Resolvido` em cor de sucesso
- `Em progresso` em azul
- `Não iniciado` em texto secundário

### Regras

- tabela limpa
- cabeçalhos discretos
- hover opcional
- link de footer `Ver histórico completo`

### Componente

- `ProfileRecentSessionsCard`
- `DataTable`
- `SessionStatusBadge`

---

## 11.8 Card de Próximos desafios recomendados

### Função

Conectar o perfil à ação seguinte.

### Colunas

- Desafio
- Tópico
- Dificuldade
- ELO possível

### Regras

- este card deve parecer “próximos passos”
- não usar cards individuais grandes
- usar tabela/lista compacta
- footer com link `Explorar todos os desafios`

### Componente

- `ProfileRecommendationsCard`
- `RecommendedChallengeTable`

---

## 11.9 Card de Conquistas recentes

### Função

Mostrar marcos desbloqueados sem transformar a tela em videogame.

### Estrutura

Cada item:

- ícone ou selo
- nome da conquista
- descrição curta
- data de desbloqueio

### Regras

- máximo 4 itens visíveis
- visual elegante e discreto
- badges não podem parecer adesivos infantis

### Componente

- `ProfileAchievementsCard`
- `AchievementBadge`
- `AchievementRow`

---

## 12. Diferenças entre claro e escuro

## 12.1 Claro

Sensação:

- mais editorial
- mais “docs premium”
- mais luminoso

### Regras específicas

- usar divisórias suaves
- usar sombra mínima
- evitar branco absoluto dominante

## 12.2 Escuro

Sensação:

- mais noturno
- mais íntimo
- mais técnico

### Regras específicas

- usar elevação por superfície
- usar `Washi` em vez de branco
- usar azul glacial sem glow

---

## 13. Estados e interações

## 13.1 Hover

Itens que podem ter hover:

- sidebar nav items
- links de footer
- linhas de tabela
- botões do header

Regras:

- hover sutil
- nunca exagerar cor de fundo
- sem animações chamativas

## 13.2 Focus

Inputs e ações precisam de foco visível.

Sugestão:

- outline em azul
- outline offset leve

## 13.3 Loading

Se a tela estiver carregando:

- usar skeletons em cards
- preservar layout final
- não usar spinner central como solução principal

## 13.4 Empty states

Exemplo:

- sem sessões recentes
- sem recomendações
- sem conquistas recentes

Cada bloco deve ter seu próprio empty state curto.

---

## 14. Responsividade

## 14.1 Desktop

Esta especificação é desktop-first.

### Breakpoints sugeridos

- `>= 1440px`: layout cheio
- `>= 1200px`: layout padrão
- `< 1200px`: cards da linha do meio podem empilhar
- `< 1024px`: sidebar deve colapsar ou virar drawer

## 14.2 Reflow sugerido

Quando a largura cair:

1. `ELO Evolution` e `Topic Mastery` empilham
2. `Recent Sessions` e `Recommendations` empilham
3. `Achievements` ocupa largura total

---

## 15. Regras de implementação para IA

Se uma IA for implementar esta tela, ela deve seguir estas prioridades:

1. construir o shell global
2. construir os tokens de tema claro e escuro
3. construir os `SectionCard`
4. montar a tela inteira com dados estáticos bem tipados
5. só depois plugar dados reais

### Regra importante

Não implementar cada bloco como solução totalmente isolada.

Criar primeiro:

- sistema de tokens
- card base
- tabela base
- progress bar base
- sidebar nav base

Depois especializar:

- `ProfileTopicMasteryCard`
- `ProfileRecentSessionsCard`
- `ProfileRecommendationsCard`
- `ProfileAchievementsCard`

---

## 16. Estrutura sugerida de arquivos

Exemplo recomendado:

```txt
apps/web/src/app/dashboard/profile/
  profile-page.tsx
  profile-shell.tsx
  profile-sidebar.tsx
  profile-hero.tsx
  profile-stats-row.tsx
  profile-elo-chart-card.tsx
  profile-topic-mastery-card.tsx
  profile-recent-sessions-card.tsx
  profile-recommendations-card.tsx
  profile-achievements-card.tsx
  profile-types.ts
  profile-theme.ts
```

Componentes base compartilháveis:

```txt
packages/ui/src/components/profile/
  section-card.tsx
  progress-bar.tsx
  achievement-badge.tsx
  data-table.tsx
```

---

## 17. O que não fazer

- não usar grid de cards idênticos para tudo
- não usar heatmap estilo GitHub
- não colocar `Pontos de atenção` fake sem dados reais
- não usar sombras pesadas no claro
- não usar glow no escuro
- não usar preto puro
- não usar branco puro
- não transformar a tela em dashboard financeiro

---

## 18. Resumo executivo

Esta tela de perfil deve ser construída como:

- `app shell` consistente
- `study dossier` pessoal
- `analytics calmo`
- `tabelas limpas`
- `gráfico simples`
- `hierarquia editorial`

### Nome do arquivo para referência da IA

Use sempre:

- `docs/ui/profile-docs-trainer-spec.md`

Esse é o arquivo que a IA deve ler para implementar a tela de perfil clara e escura do KODAN com fidelidade.
