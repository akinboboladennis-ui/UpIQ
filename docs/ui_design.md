# UI Design System — UpIQ

## Design Philosophy

UpIQ's visual language should communicate **intelligence and precision**. The UI is a tool for serious professionals, not a consumer app. Every design decision should reduce cognitive load and increase confidence in the data being presented.

Reference quality bar: Linear, Vercel, Raycast. The aesthetic is calm, dense, and informational — not playful, not decorative.

---

## Typography

### Type Scale

We use a single typeface system: **Inter** (variable font) for all text, with **JetBrains Mono** for code, scores, and data labels.

| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `text-display` | 36px | 700 | 1.1 | Page titles, hero scores |
| `text-heading-1` | 24px | 600 | 1.2 | Section headings |
| `text-heading-2` | 18px | 600 | 1.3 | Card titles |
| `text-heading-3` | 15px | 600 | 1.4 | Sub-section labels |
| `text-body` | 14px | 400 | 1.6 | Body copy, descriptions |
| `text-body-sm` | 13px | 400 | 1.5 | Secondary info, captions |
| `text-label` | 12px | 500 | 1.4 | Badges, tags, input labels |
| `text-mono` | 13px | 400 | 1.4 | Scores, code, data |

### Typography Rules

- Line length: 60–72 characters for body text.
- Headings never wrap past 2 lines.
- Score values always render in `text-mono` to prevent layout shift.
- Never use more than 2 type sizes within a single card.

---

## Color Palette

### Base Colors (CSS Custom Properties)

```css
:root {
  /* Backgrounds */
  --color-bg-base:        #0a0a0b;   /* Page background */
  --color-bg-surface:     #111113;   /* Card/panel background */
  --color-bg-elevated:    #1a1a1e;   /* Modal, dropdown, hover state */
  --color-bg-overlay:     #26262c;   /* Active state, selected */

  /* Borders */
  --color-border-subtle:  #1e1e24;   /* Subtle dividers */
  --color-border-default: #2a2a32;   /* Card borders, input outlines */
  --color-border-strong:  #3d3d4a;   /* Focus rings, prominent borders */

  /* Text */
  --color-text-primary:   #f0f0f2;   /* Primary content */
  --color-text-secondary: #8b8b9a;   /* Secondary labels, captions */
  --color-text-tertiary:  #55555f;   /* Placeholder, disabled */
  --color-text-inverse:   #0a0a0b;   /* Text on light backgrounds */

  /* Brand */
  --color-brand:          #6366f1;   /* Indigo — primary action, active states */
  --color-brand-hover:    #4f52d9;
  --color-brand-subtle:   #1e1f3d;   /* Brand tint for backgrounds */
  --color-brand-muted:    #3b3d8f;   /* Brand tint for borders */

  /* Semantic */
  --color-success:        #22c55e;
  --color-success-subtle: #0d2416;
  --color-warning:        #f59e0b;
  --color-warning-subtle: #271d05;
  --color-error:          #ef4444;
  --color-error-subtle:   #250e0e;
  --color-info:           #3b82f6;
  --color-info-subtle:    #0d1829;

  /* Score Colors */
  --color-score-excellent: #22c55e;   /* 80–100 */
  --color-score-good:      #84cc16;   /* 60–79 */
  --color-score-developing:#f59e0b;   /* 40–59 */
  --color-score-needs-work:#ef4444;   /* 0–39 */
}
```

### Light Mode (optional Phase 2)

A light mode variant is planned for Phase 2. CSS custom properties make this a token swap, not a redesign.

---

## Spacing System

Based on a 4px base unit. Components use only values from this scale.

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Micro gaps (icon + label) |
| `space-2` | 8px | Tight groupings |
| `space-3` | 12px | Element padding |
| `space-4` | 16px | Card padding, form spacing |
| `space-5` | 20px | Section gaps |
| `space-6` | 24px | Card margins |
| `space-8` | 32px | Section headers |
| `space-10` | 40px | Major section spacing |
| `space-12` | 48px | Page top padding |

---

## Border Radius

```css
--radius-sm:   4px;    /* Tags, badges, small inputs */
--radius-md:   8px;    /* Cards, buttons, inputs */
--radius-lg:   12px;   /* Modals, panels */
--radius-xl:   16px;   /* Full-page overlays */
--radius-full: 9999px; /* Pills, avatars */
```

---

## Shadow System

```css
--shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.4);
--shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.4);
--shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.6), 0 4px 6px -4px rgb(0 0 0 / 0.5);
--shadow-glow-brand: 0 0 20px -4px rgb(99 102 241 / 0.4);  /* Active score rings */
```

---

## Core Components

### ScoreRing

A circular progress indicator used to display dimension and overall scores.

```
Props:
  score: number (0–100)
  size: 'sm' | 'md' | 'lg'
  label?: string
  animated?: boolean

Sizes:
  sm — 48px diameter, used in dimension breakdown cards
  md — 80px diameter, used in summary rows
  lg — 120px diameter, used in the hero score display

Color: derived from score value using score color tokens
Animation: ring draws in over 600ms on mount (no animation on cached results)
```

### RecommendationCard

```
Structure:
  ┌─────────────────────────────────────────────────┐
  │  [impact badge]  [dimension tag]                 │
  │  Gap: <short gap description>                    │
  │  Action: <specific action in imperative voice>   │
  │                                                  │
  │  [Rewrite] button → expands inline rewrite       │
  │  [Dismiss] [Mark Complete]                       │
  └─────────────────────────────────────────────────┘

Impact badge colors:
  critical — error red
  high     — warning amber
  medium   — brand indigo
  low      — secondary text
```

### ProposalScoreCard

```
Structure:
  ┌────────────────────────────────────────────────────────┐
  │  Overall Score: 68        Bid Strength: ● Medium       │
  ├────────────────────────────────────────────────────────┤
  │  Relevance    ████████░░  75    Social Proof  ███████░░ 70  │
  │  Specificity  █████░░░░░  55    Tone          ████████░░ 80  │
  │  CTA          ██████░░░░  60                              │
  ├────────────────────────────────────────────────────────┤
  │  [Original]  [Rewrite ✨]                               │
  └────────────────────────────────────────────────────────┘
```

### DiffViewer

Side-by-side view of original proposal vs. rewrite with change highlighting.

- Removed text: `--color-error` with strikethrough
- Added text: `--color-success` with underline
- Annotation tooltips appear on hover over annotated sentences

### StatCard

```
Structure:
  ┌────────────────────┐
  │  Label             │
  │  42                │  ← text-display, text-mono
  │  +8% vs. last week │  ← text-body-sm, success/error color
  └────────────────────┘
```

---

## Dashboard Layout

### Shell Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  Sidebar (240px fixed, collapsible to 60px icon rail)           │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Logo                                                        ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │  ○ Dashboard                                                ││
│  │  ○ Profile                                                  ││
│  │  ○ Proposals                                                ││
│  │  ○ Market                                                   ││
│  │  ○ Growth                                                   ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │  ○ Settings                                                 ││
│  │  ○ Help                                                     ││
│  │  [Avatar] [Name]                                            ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  Main Content Area (flex-1)                                     │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Page Header: [Title]              [Primary CTA]            ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │  Page Content                                               ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Dashboard Home Layout

```
┌──────────────────────────────────────────────────────────────┐
│  Profile Score      Proposals      Market Position            │
│  [ScoreRing lg]     10 optimized   p62 in Web Dev            │
│      72             +3 this week   ↑ from p55                │
├──────────────────────────────────────────────────────────────┤
│  Top Recommendations (3 cards, highest impact first)         │
│  [RecommendationCard] [RecommendationCard] [RecommendationCard]│
├─────────────────────────────────┬────────────────────────────┤
│  Score Breakdown                │  Recent Activity           │
│  Title       ████░░  65         │  ● Profile analyzed 2h ago│
│  Overview    ████████░ 80       │  ● Proposal scored 1d ago  │
│  Portfolio   █████░░  55        │  ● Market updated today    │
│  Skills      ███████░ 70        │                            │
│  Rates       █████████ 90       │                            │
└─────────────────────────────────┴────────────────────────────┘
```

---

## Responsive Behavior

| Breakpoint | Layout change |
|---|---|
| < 640px (mobile) | Sidebar collapses to bottom nav (5 icons). Cards stack vertically. ScoreRings scale down. |
| 640–1024px (tablet) | Sidebar collapses to icon rail (60px). Main content uses single-column layout. |
| > 1024px (desktop) | Full sidebar (240px). Dashboard uses 2–3 column grid. |

---

## Accessibility Requirements

- **Keyboard navigation:** All interactive elements reachable and operable by keyboard. Tab order follows visual reading order.
- **Focus rings:** Visible focus rings on all interactive elements (3px, brand color, offset 2px).
- **Color contrast:** All text meets WCAG 2.1 AA minimum (4.5:1 for body, 3:1 for large text). Score colors meet contrast against card backgrounds.
- **Screen readers:** All charts and score rings have descriptive `aria-label` values (e.g., "Profile score: 72 out of 100, Good").
- **Motion:** All animations respect `prefers-reduced-motion`. Animations are decorative only — no functionality depends on animation.
- **Form labels:** All form inputs have associated `<label>` elements or `aria-label` attributes.
- **Error messages:** All validation errors are associated with their input via `aria-describedby`.

---

## Animation

- Interactions: 120ms ease-out (snappy, not sluggish)
- Page transitions: 200ms fade (unobtrusive)
- Score ring draw: 600ms ease-in-out (on first load only)
- Streaming text: character-by-character render for AI-generated content (typewriter effect, respects reduced-motion with instant reveal)

All animations use CSS transitions or Framer Motion — no GSAP dependency.

---

## Icon System

Icons are sourced from **Lucide React** (consistent stroke weight, MIT license). Custom icons are SVGs placed in `packages/ui/icons/`. All icons are `aria-hidden="true"` when decorative, with `aria-label` when functional.
