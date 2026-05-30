# Zen UI Pack — Estrutura Completa do Design System

## Visão Geral

Este documento define a estrutura do **Zen UI Pack**, um sistema visual inspirado em:

* Zen japonês
* sumi-e
* ensō
* papel washi
* progressão Dan/Kyu
* minimalismo feudal moderno

Objetivo:
Criar uma identidade visual própria para o projeto sem depender de bibliotecas prontas com aparência genérica.

---

# Filosofia Visual

## Conceitos Centrais

| Conceito        | Aplicação                       |
| --------------- | ------------------------------- |
| Silêncio visual | espaços vazios                  |
| Ritual          | animações lentas e intencionais |
| Progressão      | sistema Dan/Kyu                 |
| Imperfeição     | pinceladas orgânicas            |
| Materialidade   | textura de papel e tinta        |
| Fluxo           | transições suaves               |

---

# Estrutura do Projeto

```txt
src/
  app/
  components/
    ui/
    zen/
      feedback/
      navigation/
      forms/
      progression/
      layout/
      motion/
      display/

  assets/
    zen/
      vector/
      texture/
      lottie/
      audio/

  styles/
    zen-tokens.css
    zen-paper.css
    zen-motion.css

  lib/
    zen/
      motion.ts
      tokens.ts
      utils.ts
```

---

# Tokens do Sistema

## Cores

```css
:root {
  --zen-washi: #f5f0e6;
  --zen-ink: #111111;
  --zen-sumi: #2b2b2b;
  --zen-hanko: #c4432b;
  --zen-moss: #68745c;
  --zen-gold: #c7a45d;
  --zen-border: #d9d1c7;
}
```

---

# Tipografia

## Sugestões

### Texto principal

* IBM Plex Mono
* JetBrains Mono
* Inter

### Decorativo

* Noto Serif JP
* Zen Old Mincho
* Shippori Mincho

---

# Sistema de Motion

## Filosofia

As animações devem:

* ser lentas
* suaves
* respirarem
* não parecerem “gaming UI exagerada”

---

## Motion Presets

```ts
export const zenFade = {
  hidden: {
    opacity: 0,
    y: 8
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35
    }
  }
}
```

---

## Presets recomendados

| Nome        | Uso            |
| ----------- | -------------- |
| zenFade     | entrada padrão |
| brushReveal | pincelada      |
| sealImpact  | conquistas     |
| calmFloat   | hover          |
| inkSpread   | loading        |
| paperSlide  | modais         |

---

# Sistema de Textura

## Objetivo

Simular:

* papel washi
* tinta seca
* material orgânico

---

## Regras

### NÃO usar:

* texturas pesadas
* JPG gigantes
* overlays exagerados

### Preferir:

* CSS gradients
* noise sutil
* blend modes leves

---

## Classe base

```css
.zen-paper {
  background:
    linear-gradient(
      rgba(255,255,255,0.03),
      rgba(0,0,0,0.02)
    );
}
```

---

# Assets

## Vetoriais (SVG)

Use para:

* ensō
* ícones
* divisores
* selos
* badges

---

## Animações

## Motion no código

Use para:

* hover
* modal
* toast
* alert
* transitions

---

## Lottie / Rive

Use para:

* conquistas
* rank up
* selo batendo
* tinta espalhando

---

# Componentes do Sistema

# 1. Feedback

---

## ZenToast

### Objetivo

Feedback rápido e elegante.

### Visual

* papel pequeno
* selo vermelho
* fade lateral

### Variantes

* success
* error
* warning
* info

---

## ZenAlert

### Objetivo

Interrupção contextual.

### Visual

* borda sumi
* selo lateral
* textura leve

---

## ZenSkeleton

### Objetivo

Loading elegante.

### Visual

* shimmer tipo tinta
* pincelada horizontal

---

## ZenTooltip

### Objetivo

Explicações pequenas.

### Visual

* mini pergaminho
* sombra leve

---

# 2. Navegação

---

## ZenSidebar

### Elementos

* rank atual
* avatar
* divisores sumi
* indicador ativo vertical

---

## ZenTabs

### Estilo

* underline em pincelada
* hover com expansão de tinta

---

## ZenBreadcrumb

### Estrutura

```txt
DOJO / SHODAN / KATA / MISSÃO
```

---

## ZenCommandMenu

### Inspiração

CMD + K moderno.

### Visual

* fundo escuro sumi
* blur leve
* itens aparecendo em cascata

---

# 3. Inputs

---

## ZenInput

### Características

* borda fina
* focus elegante
* animação lenta
* label flutuante

---

## ZenTextarea

### Ideia

Área de escrita como pergaminho.

---

## ZenSelect

### Visual

* dropdown suspenso
* hover sumi
* transição suave

---

## ZenCheckbox

### Visual

* selo marcando
* tinta preenchendo

---

# 4. Progressão

---

## DanProgress

### Objetivo

Mostrar evolução do usuário.

### Visual

* barra sumi
* tinta preenchendo

---

## ZenRankBadge

### Objetivo

Exibir Dan/Kyu.

### Visual

* selo
* borda orgânica
* glow leve

---

## ZenAchievementSeal

### Objetivo

Conquista.

### Animação

* impacto
* poeira/tinta
* som opcional

---

## ZenStreak

### Objetivo

Dias consecutivos.

### Tema

“Ritual contínuo”

---

# 5. Layout

---

## ZenPaper

### IMPORTANTE

Componente central do sistema.

### Responsável por:

* textura
* borda
* sombra
* padding
* identidade visual

---

## ZenCard

### Uso

Containers principais.

---

## ZenDivider

### Variantes

* brush
* bamboo
* seal
* sumi

---

## ZenModal

### Entrada

paperSlide

### Fundo

blur suave

---

# 6. Display Components

---

## EnsoCircle

### Tipos

* loading
* progress
* decorative
* rank

---

## ZenAvatar

### Visual

* moldura sumi
* selo opcional

---

## ZenProfileCard

### Dados

* rank
* xp
* streak
* achievements

---

# 7. Gamificação

---

## Ritual System

Substituir:

* task
* challenge
* mission

Por:

* kata
* ritual
* jornada
* disciplina

---

## Rank Hierarchy

```txt
Novice
Mushin Kyu
Shodan
Nidan
Sandan
Yondan
Godan
Master
Sage
```

---

## Achievement Naming

Evitar:

* XP gained
* Level Up

Preferir:

* Nova Marca
* Ritual Completo
* Fluxo Mantido
* Ascensão

---

# Tema Light/Dark

---

## Washi Mode

### Características

* fundo claro
* papel
* contraste suave

---

## Ink Mode

### Características

* preto sumi
* vermelho profundo
* brilho mínimo

---

# Estrutura Recomendada de Pastas

```txt
src/components/zen/

  feedback/
    ZenToast.tsx
    ZenAlert.tsx
    ZenTooltip.tsx

  forms/
    ZenInput.tsx
    ZenSelect.tsx
    ZenCheckbox.tsx

  navigation/
    ZenSidebar.tsx
    ZenTabs.tsx
    ZenBreadcrumb.tsx

  progression/
    DanProgress.tsx
    ZenRankBadge.tsx
    ZenAchievementSeal.tsx

  display/
    EnsoCircle.tsx
    ZenAvatar.tsx
    ZenProfileCard.tsx

  layout/
    ZenPaper.tsx
    ZenCard.tsx
    ZenDivider.tsx
    ZenModal.tsx

  motion/
    presets.ts
```

---

# Pipeline de Criação

## Ordem ideal

### Fase 1

Base visual:

* tokens
* paper
* button
* input
* card

### Fase 2

Motion:

* fade
* brush
* seal impact

### Fase 3

Gamificação:

* ranks
* xp
* streak
* achievements

### Fase 4

Navegação:

* sidebar
* tabs
* command menu

### Fase 5

Refinamento:

* partículas
* áudio
* micro detalhes

---

# Prompt Mestre para IA

```txt
Crie componentes React para um Design System chamado Zen UI.

Stack:
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn/ui como base opcional

Estética:
- zen japonês
- papel washi
- sumi-e
- ensō
- selos vermelhos
- minimalismo feudal moderno

Regras:
- componentes reutilizáveis
- acessíveis
- animações suaves
- sem exagero visual
- sem aparência genérica SaaS
- sem assets externos

Estrutura:
src/components/zen/
src/assets/zen/
src/styles/

Criar:
- variantes
- animações
- tokens
- dark/light mode
- SVGs reutilizáveis
```

---

# Referências Visuais

## Inspirações ideais

* Ghost of Tsushima UI
* Persona 5 menus
* Sekiro menus
* Journey
* Zen Brush
* Japanese editorial minimalism

---

# O que evitar

## NÃO fazer

* excesso de kanji
* vermelho em tudo
* glow exagerado
* animações rápidas demais
* UI estilo “anime genérico”
* textura pesada
* partículas excessivas

---

# Resultado Esperado

O sistema deve parecer:

* calmo
* elegante
* ritualístico
* artesanal
* minimalista
* vivo

E não:

* cyberpunk
* neon
* anime UI genérica
* dashboard SaaS comum
