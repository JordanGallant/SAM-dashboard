# Design System — SAM

## Memorable thing

> **"Built by a VC — every screen knows what a partner actually cares about."**

This is the design north star. Every decision (hierarchy, type, color, density, motion) serves this sentence. A partner who reads 20 memos a week should open SAM and feel: *"whoever made this has sat in an IC meeting."* Not generic SaaS. Not a toy.

## Product context

- **What:** AI-powered investment due-diligence platform for European VCs and angel investors. Users upload a pitch deck; SAM generates a structured 9-section investment memo (summary, team, market, product, traction, finance, exit, fund-fit, missing info); the user decides faster and more rigorously.
- **Who:** VC partners and principals at €50M–€500M European funds; angel investors evaluating 5-20 deals/month; scout analysts doing first-pass screening.
- **Industry:** Institutional fintech / VC tooling. Privacy-sensitive (GDPR). Peers: Affinity, Harmonic, Specter, Dealroom, Pitchbook.
- **Project type:** Authenticated dashboard + public marketing site + sample memo page.

## Aesthetic direction

**Institutional-Terminal.** Bloomberg-meets-Linear. Dense where density earns its keep (tables, verdict chips, score bars). Spacious where it doesn't (thesis prose, summaries, empty states). Warm, not clinical. The amber accent is the "terminal cursor" — it marks decisions, not decoration.

**Not:** SaaS gradients, hero illustrations, rounded playful cards, generic blue-gray dashboards, stock photography.
**Yes:** monospace labels, verdict chips as first-class primitives, thin rules, dense grids, editorial whitespace around prose that matters, subtle paper grain for materiality.

## Typography

- **Display / Heading:** Geist (Bold 700 / Semibold 600) — geometric, institutional, neutral. `letter-spacing: -0.02em` on h1–h6.
- **Body:** Geist (Regular 400 / Medium 500).
- **Data / Labels:** JetBrains Mono (Regular 400 / Medium 500), `font-variant-numeric: tabular-nums`. Every label, every score, every €, every date, every count is mono.
- **Scale:**
  - H1 — 32px (page title) / 24px (sub-page)
  - H2 — 24px
  - H3 — 18px
  - Body — 14px (default in app), 16px (marketing)
  - Small — 13px
  - Caption — 12px
  - Micro — 10–11px (mono SectionLabel, tracking-widest uppercase)

**Rule:** Any number that represents data (score, count, €, %, date) must be JetBrains Mono with tabular-nums.

## Color

Amber is primary. This is deliberate — the memorable thing is "terminal for a VC", and amber reads as a terminal cursor far more than blue does.

### Primary palette (light — default)

| Token         | Hex       | Usage                                                      |
| ------------- | --------- | ---------------------------------------------------------- |
| `--primary`   | `#B45309` | amber-700 — primary CTAs, active tabs, focus rings         |
| `--accent`    | `#D97706` | amber-600 — mono eyebrow labels, score numbers, highlights |
| `--info`      | `#2563EB` | blue-600 — links, info badges, `/sample` "demo" chips      |
| `--success`   | `#059669` | emerald-600 — STRONG BUY verdict, positive deltas          |
| `--warning`   | `#D97706` | amber-600 — EXPLORE verdict, pending states                |
| `--destructive` | `#DC2626` | red-600 — DENY verdict, errors, critical risks           |

### Neutrals (warm stone)

| Token                  | Hex       | Usage                      |
| ---------------------- | --------- | -------------------------- |
| `--background`         | `#FAFAF9` | page base (stone-50)       |
| `--card`               | `#FFFFFF` | surface cards              |
| `--foreground`         | `#1C1917` | primary text (stone-900)   |
| `--muted-foreground`   | `#78716C` | secondary text (stone-500) |
| `--border`             | `#E7E5E4` | borders (stone-200)        |
| `--muted`              | `#F5F5F4` | subtle fills (stone-100)   |

### Verdict palette (first-class)

Verdicts are chips, not prose. Always mono, uppercase.

| Verdict     | Text color | Background color |
| ----------- | ---------- | ---------------- |
| STRONG BUY  | emerald-700 `#047857` | emerald-50 `#ECFDF5` |
| EXPLORE     | amber-700 `#B45309`   | amber-50 `#FFFBEB`   |
| PASS        | zinc-700 `#3F3F46`    | zinc-100 `#F4F4F5`   |
| DENY        | red-700 `#B91C1C`     | red-50 `#FEF2F2`     |

### Dark mode

Not a priority for v1. Light-first. Revisit once the light system is settled.

## Spacing & density

- **Base:** 4px grid.
- **Scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.
- **Density policy:**
  - Data table rows: compact (`py-2`, 32–40px row height)
  - Card padding: balanced (`py-4 px-4` — match the Card component's own `py-4`, do NOT stack `pt-5` on top)
  - Section gaps between meaningful regions: `space-y-6` (24px)
  - Page margins: `p-4 md:p-6`

**Padding anti-pattern:** Never add `pt-5` / `pt-6` on `CardContent` when the Card already has `py-4`. That stacks and produces unbalanced vertical rhythm (36px top, 16px bottom). Let the Card own vertical padding; `CardContent` owns horizontal padding only.

## Layout primitives

- **SectionLabel** — the amber mono eyebrow (10px, uppercase, `tracking-widest`, amber-600). The one cross-cutting wayfinding primitive. Every page header, every card section, every sidebar group uses it.
- **VerdictChip** — first-class. Always mono, uppercase, colored pill per the verdict palette above.
- **ScoreDisplay** — large mono amber-600 number with stone-500 `/100` suffix. `tabular-nums` mandatory.
- **DomainBar** — 3px tall, stone-200 track, amber/emerald/red fill based on score band.
- **Card** — `ring-1 ring-foreground/10`, rounded-xl, py-4. No shadow by default; hover lifts to `shadow-sm`.
- **Radii:** 4 / 8 / 12. Cards & panels 12. Buttons & inputs 8. Chips & badges 9999.

## Motion

- **Philosophy:** Functional, not decorative. Every animation explains state or guides attention.
- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` (institutional ease-out).
- **Durations:** micro 100ms (hover), short 200ms (state change), medium 300ms (reveal), long 500ms (layout shift).
- **Used for:** score count-up on analysis reveal, domain-bar fill on mount, verdict-chip color crossfade, tab underline slide, toast enter/exit.
- **Not used for:** decoration, scroll-jacking, parallax, spinners that outlive their purpose.

## Grain / materiality

Subtle SVG `feTurbulence` noise overlay at 2% opacity, `position: fixed`, `pointer-events: none`, `z-index: 9999`. Gives surfaces a paper-like materiality; prevents generic SaaS flatness. Applied globally via `body::after`.

## Page posture

### `/deals` (dealroom)
The executive summary is the thing partners actually want. Deal cards surface the *thesis one-liner* directly — no click-through required for triage. Verdict + score are the visual anchor. Metadata (stage, sector, geo) is demoted.

### `/deals/[id]/summary`
The memo. Top: company meta row (mono), verdict chip, score, confidence. Middle: thesis prose in editorial column width (max-w-prose). Scorecard: 6 domain rows with mono scores and color-banded sparkline bars. Below: strengths / risks / next steps as typed findings.

### `/deals/[id]/{tab}`
One domain per tab. Dense data table on top, prose analysis below. Mono for all numeric claims.

### `/settings/*`
Tabbed nav (Fund Profile / Billing / Security). Forms use `space-y-4` inside cards. Inline helpers explain VC jargon (e.g. "Check size: the range you typically invest per deal").

### Marketing (`/`, `/how-it-works`, `/for-angels`, `/for-vc-funds`, `/sample`)
More editorial spacing. Larger hero type (48–72px). But terminal-chrome data blocks (e.g. sample scorecard on the hero) keep the institutional-terminal feel consistent with the app.

## Decisions log

| Date       | Decision                                                          | Rationale                                                                                                        |
| ---------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 2026-04-22 | Initial design system from /design-consultation                   | Memorable thing: "Built by a VC". Amber-primary, blue-demoted-to-info. Ledger/memo posture over generic SaaS.    |
| 2026-04-22 | `/deals` redesign: thesis-first card layout                       | User direction: simplify, exec-summary-first. Removes click-through for first-pass triage.                       |
| 2026-04-22 | Grain overlay (2% SVG noise, body::after)                         | Adds materiality to flat surfaces. Reinforces the "this is a document" feeling consistent with memo posture.     |
| 2026-04-22 | Primary swap: blue-600 → amber-700                                | Amber reads as "terminal cursor"; blue-600 as primary was generic-SaaS. Blue retained as `--info` for links/chips. |
