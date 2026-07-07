---
name: CodeC Design System
description: "The Grandmaster's Study: A flat, tactile, vintage chess club aesthetic for code training."
colors:
  primary: "#1f3d2f"
  secondary: "#8c2d19"
  neutral-bg: "#f5f2eb"
  neutral-fg: "#1e1f1c"
  neutral-bg-dark: "#1e1f1c"
  neutral-fg-dark: "#f5f2eb"
  border: "#dcd7cb"
  border-dark: "#3a3c36"
  accent-warm: "#d97706"
typography:
  display:
    fontFamily: "Courier Prime, Courier, Georgia, serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: "1.1"
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Courier Prime, Courier, Georgia, serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: "1.2"
  title:
    fontFamily: "Courier Prime, Courier, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: "1.3"
  body:
    fontFamily: "JetBrains Mono, Fira Code, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.6"
  label:
    fontFamily: "JetBrains Mono, Fira Code, monospace"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.05em"
rounded:
  none: "0px"
  sm: "2px"
  md: "4px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "#152a20"
  button-secondary:
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.neutral-fg}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
  button-secondary-hover:
    backgroundColor: "#eae4d7"
---

# Design System: CodeC

## 1. Overview

**Creative North Star: "The Grandmaster's Study"**

The CodeC design system is inspired by the quiet focus of a vintage chess tournament hall. It bridges the academic discipline of a classical study with the raw logic of an early terminal environment. We prioritize visual silence around the code editor/board to maximize cognitive bandwidth, using warm parchment backgrounds, dark charcoal text, and a flat, border-based grid layout.

This system rejects the soft, floating shadows, neon gradients, and playful elements typical of modern SaaS. Instead, it relies on crisp lines, sharp borders, physical textures, and structured monospace typography.

**Key Characteristics:**
- **Tactile Board Grid**: Solid 1px or 2px borders establish structure and division, echoing chess boards and retro textbooks.
- **High Focus Area**: Minimal decorative noise near the code panels to prevent eye strain and maintain concentration.
- **Scholarly Palette**: Natural pigments (forest green, vintage crimson, warm paper, walnut charcoal) evoke a classic, offline atmosphere.

## 2. Colors

The palette is composed of natural, organic pigments reflecting classic chess clubs, vintage notebooks, and dark ink.

### Primary
- **Tournament Board Green** (#1f3d2f): A deep, muted forest green representing the primary accent, used for success states, ratings, and navigation highlights.

### Secondary
- **Vintage Crimson** (#8c2d19): A deep, ink-like blood red used for destructive actions, error states, and critical warnings.

### Neutral
- **Warm Parchment** (#f5f2eb): A soft, off-white paper tint used for light backgrounds and panels, providing high contrast without the glare of pure white.
- **Dark Charcoal Ink** (#1e1f1c): A warm, near-black carbon color used for text, borders, and dark backgrounds, softer than absolute black.
- **Muted Paper Border** (#dcd7cb): A low-contrast neutral gray used for grid boundaries and layout dividers.

### Named Rules
**The 10% Accent Rule.** The primary board green accent is used on ≤10% of any given screen. It represents tactical emphasis (active ELO, submit buttons) rather than decoration.
**The No-Pure-Black Rule.** absolute black (#000000) and pure white (#ffffff) are forbidden. Every neutral is tinted toward charcoal or cream to preserve the offline, paper-like feeling.

## 3. Typography

**Display Font:** Courier Prime (with Courier, Georgia, serif)
**Body Font:** JetBrains Mono (with Fira Code, monospace)
**Label/Mono Font:** JetBrains Mono

**Character:** A pairing of slab-serif display headers (recalling classic typewriters and tournament notices) with crisp, high-legibility monospace for body text and code snippets.

### Hierarchy
- **Display** (Bold, clamp(2rem, 5vw, 3.5rem), 1.1): Used for large page titles and ASCII art headers.
- **Headline** (Bold, 1.75rem, 1.2): Used for primary section titles.
- **Title** (Bold, 1.25rem, 1.3): Used for card titles and arena headers.
- **Body** (Regular, 0.875rem, 1.6): Used for instructions, descriptions, and code blocks. Cap body line length at 70ch.
- **Label** (Semi-bold, 0.75rem, 1.2, uppercase): Used for tags, ratings, micro-headers, and action labels.

### Named Rules
**The Monospace Standard Rule.** All code, variables, ELO values, timer stats, and diagnostic labels must use JetBrains Mono (or a clean monospace fallback) to ensure strict alignment and technical readability.

## 4. Elevation

Depth is conveyed physically through flat, high-contrast borders and solid 2D offsets. We completely reject blurred shadows and soft ambient occlusion in favor of flat, vintage bookbinding grid structures.

### Shadow Vocabulary
- **Tactile Offset** (Solid 2px border + 3px solid charcoal offset): Surfaces are flat at rest. Cards or buttons can lift on hover using a solid offset, e.g., `box-shadow: 3px 3px 0px 0px #1e1f1c`.

### Named Rules
**The Flat-Grid Rule.** No soft, blurred box shadows or ambient drop-shadows may be used. Depth is established through nested borders, solid block offsets, or flat background fills.

## 5. Components

Every component is flat, border-bound, and structurally simple.

### Buttons
- **Shape**: Flat, sharp corners (0px border-radius).
- **Primary**: Tournament board green background, warm parchment text, with a 1px solid border. Padding (8px 16px).
- **Hover / Focus**: Shifts background to a deeper green (#152a20) and shifts offset slightly. Focus-visible outline is a solid 1px charcoal offset.
- **Secondary**: Warm parchment background, dark charcoal text, 1px solid border. Shifts background to deeper beige (#eae4d7) on hover.

### Cards / Containers
- **Corner Style**: Sharp corners (0px border-radius).
- **Background**: Warm parchment (#f5f2eb) in light mode; dark charcoal (#1e1f1c) in dark mode.
- **Border**: Solid 1px border (#dcd7cb in light, #3a3c36 in dark).
- **Internal Padding**: Structured steps (16px or 24px).

### Inputs / Fields
- **Style**: Warm parchment background, dark charcoal text, solid 1px border.
- **Focus**: Displays a solid 2px forest green border. No glowing halos or blurs.

### Navigation
- **Style**: A minimal top bar or sidebar defined by a solid 1px border, featuring capital monospace text links. Current page link is marked by a forest green background block or high-contrast border outline.

## 6. Do's and Don'ts

### Do:
- **Do** use JetBrains Mono for all code and technical data to ensure clear character recognition.
- **Do** use warm parchment (#f5f2eb) as the light background to reduce glare.
- **Do** use flat, solid 1px or 2px borders to structure panels and containers.
- **Do** use OKLCH color tints to adapt secondary UI states to theme changes smoothly.

### Don't:
- **Don't** use standard SaaS light-blue primary buttons or soft rounded corners.
- **Don't** use blurred drop shadows or soft gradients to indicate elevation.
- **Don't** use neon gradients or flashing animations.
- **Don't** use Inter, Geist, or other generic geometric sans-serif fonts for primary text.
- **Don't** use side-stripe borders (e.g. `border-left-4` as an accent) on callouts or alert cards.
