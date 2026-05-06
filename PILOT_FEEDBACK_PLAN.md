# SAM Pilot Feedback + Design Doc — Master Plan

Source: pilot session 2026-05-06 (29 items, 12 areas) + client design briefing
`design_doc.docx` (Sam Website Launch Briefing v4 — May 2026).

This plan supersedes the previous one. Everything still open from the pilot is
listed alongside design tasks so we have one place to track readiness.

---

## STATUS — pilot batch (22/29 shipped pre-design)

Shipped: #1 #2 #3 #4 #5 #6 #7 #8 #9 #10 #11 #13 #14 #16 #17 #18 #21 #22 #23 #24
#25 #27 #28 #29.
Still open and addressed by this plan: #12 #15 #19 #20 #26.

---

## STATUS — what design forces us to change beyond the pilot

The design briefing is materially bigger than the pilot punch list. Three big
positioning shifts:

1. **6-domain framework**, not 5. SAM analysis types already include
   `exitPotential`, but landing copy + framework grid still talk about 5
   domains (Team / Market / Product / Traction / Financials). All copy gets
   updated to 6 (… + Exit).
2. **"Structured first-screening layer for investors"** as the primary
   positioning. "AI investment associate" demoted to supporting language.
   "Time is judgment / spend it well" hero replaced by **"From deck to decision."**
3. **Naming**: tiers become **Angel / Pro / Fund**, not Starter / Professional /
   Fund. Quota field becomes **"Pitch deck analyses per month"** rather than
   "memos" / "signals".

---

## PHASE A — pilot close-out (today)

### #20 Tier prices alignment (was #61)
Design table:

| Tier  | Price       | Analyses/mo | Seats  |
|-------|-------------|-------------|--------|
| Angel | €149/month  | 10          | 1      |
| Pro   | €299/month  | 30          | 3      |
| Fund  | Custom      | Custom      | Custom |

Current `tier-config.ts`:
- starter (€49, 5/mo, 1 seat) → must become **Angel €149, 10/mo, 1 seat**
- professional (€149, 25/mo, 1 seat) → must become **Pro €299, 30/mo, 3 seats**
- fund (€399, unlimited, 5 seats) → keep `price=null` for Custom; seats unlimited

Files: `src/lib/tier-config.ts`, plus any usage that prints "Starter"/"Professional".

### #26 Exec summary layout (was #68)
Pilot's preferred layout (validated by design's "investment thesis text, score
donut, performance radar, domain sub-scores"):
1. Company details (left, narrow column)
2. Investment thesis (center, wide)
3. Confidence score + performance overview (right, two graphs side by side)
   Then: domain sub-scores row underneath.

Files: `src/app/(dashboard)/deals/[dealId]/summary/page.tsx`.

### #19 First-deck-free trial (was #69) — DROP
Design: "Use launch discounts in outreach campaigns, not as the permanent
headline on the pricing page." No free-tier mechanism. Mark task as
intentionally not-shipping — replaced by an early-access discount strategy
that lives in marketing copy, not in code.

### #12 Sevvy upload — REPORT-ONLY
Sevvy isn't in Juriaan's `pitch-decks/` storage tree (only 14 other decks
present). The upload failed before write, so we cannot repro without the file.
Findings remain as written in Wave 1: top suspect is the unpdf swap (commit
`5c5f436`) when the deck is image-heavy. **Action:** mark task blocked, ask
client for the actual PDF, then a 5-min repro + fix.

### #15 SALVIO LinkedIn — INVESTIGATE
Found Juriaan's deal: company name extracted as **"Salfio"** (mis-extraction
from "SALVIO"); deal id `e2652b85-b929-4842-9ed8-fed63fab51cd`; file
`Salfio_Pitch_Deck.pdf` in storage at
`3fba34b2…/uploads/a2f0e78b…/Salfio_Pitch_Deck.pdf`. Pull the matching n8n
Flow 3 execution, see which of the three failure modes (single-name match /
empty `organic_results[0]` / non-de/ch locale) hit, then fix.

---

## PHASE B — design Phase 1 (homepage + pricing + sample assessment)

Design says Phase 1 = "Homepage + Sample Assessment + Pricing + Analyse a
deck".

**Decision (per user, this session):** use **`/mockup4`** as the design base
rather than the existing landing components. Mockup4 already has the
ramp-style structure, framer-motion animations, lime marquee, bone band, and
two-tone editorial typography that match the design's "private-capital
software" feel. We update mockup4's copy + sections to match the briefing,
then promote it to `/` (replace `src/app/page.tsx`).

### B1 — Visual tokens
Update theme tokens to design spec:
- Off-white background `#F9F8F6`
- Deep green primary `#1A5C3A`
- Card radius `12px`
- Border `#E5E7EB`
- Typeface `Inter` (already loaded — verify usage)

Files: `tailwind.config.ts` / `src/app/globals.css`. Audit current uses of
custom colours `#0F3D2E`, `#0A2E22`, `#00A86B` — keep brand recognisable but
re-anchor primary to `#1A5C3A`.

### B2 — Hero rewrite
- Headline: **"From deck to decision."**
- Subheadline: "Sam turns pitch decks into structured, source-aware investment
  assessments — so every deal is reviewed with the same discipline, before you
  spend partner time."
- Bullets: six-domain investment analysis · fund-fit scoring · missing
  information and founder follow-up questions · Ask Sam / Co-Pilot · EU-hosted
  confidential workflows.
- CTAs: **Analyse a deck** (primary) / **View sample assessment** (secondary).

Files: `src/components/landing/hero.tsx` + `src/components/landing/hero-primary.tsx`.

### B3 — Founder narrative section
New section (or repurpose Problem section): "Built from real investor workflows."
Copy lifted directly from design para 11–14.

Files: new `src/components/landing/founder-narrative.tsx`.

### B4 — Six-domain framework
Update from 5 to 6 domains. Add **Exit**.

Files: `src/components/landing/framework.tsx`.

### B5 — Not a prompt wrapper
New section: "The model is not the product. The investment framework is."
Four proof cards: fixed framework / fund-specific context / knowledge-backed
analysis / source-aware outputs.

Files: new `src/components/landing/not-a-wrapper.tsx`.

### B6 — Source attribution callout
New section. Show a sample claim with `[Source: LinkedIn]` /
`[Source: Pitch Deck — UNVALIDATED]` tags. Headline: "Every insight is
source-tagged."

Files: new `src/components/landing/source-attribution.tsx`.

### B7 — Missing information section
New. Headline: "Know exactly what still needs to be asked." Note that
missing info does NOT reduce score — flagged separately.

Files: new `src/components/landing/missing-info.tsx`.

### B8 — Ask Sam / Co-Pilot section
New. Headline: "Ask Sam anything — in the context of the deal you just
analysed." Show example prompt pills (4 from design para 147).

Files: new `src/components/landing/ask-sam.tsx`.

### B9 — Pricing page rewrite
- Update `src/components/landing/pricing.tsx` tier copy
- Tier names Angel/Pro/Fund, prices €149/€299/Custom
- "Pitch deck analyses per month" naming
- Feature comparison table aligned with design Table 3
- FAQ block updated per design (not investment advice / no public model
  training / fund mandate upload / not replacing analysts / PDF export /
  source attribution explained)

### B10 — Conversion page (Analyse a deck)
Existing `/register?tier=…` flow already serves this. Verify the headline +
copy match design's "Analyse your next pitch deck with Sam". Adjust if
needed.

### B11 — Section order in `src/app/page.tsx`
Per design Phase 1 spec:
1. Hero
2. Founder narrative (B3)
3. Problem (existing)
4. Product snapshot (existing — repurpose)
5. Six-domain framework (B4)
6. Not a prompt wrapper (B5)
7. Source attribution (B6)
8. Missing info (B7)
9. Ask Sam / Co-Pilot (B8)
10. Fund fit (existing — keep)
11. Security trust strip (existing — keep, drop SOC2 if unconfirmed)
12. Pricing (existing)
13. Final CTA (existing)
14. Footer

Drop: Partners (move to lower-priority page), Reviews (kept but de-emphasised
or moved off homepage).

---

## PHASE C — design Phase 2 (Product page rebuild)

Design Section 5 has a copy/paste prompt for the Product page. Restructure
existing `/product` (or create if missing) per Section 9 (screenshot mapping)
and Section 5 prompt. Defer until Phase B is done.

---

## PHASE D — design Phase 3 (Use Cases + Security)

Existing `/for-angels`, `/for-vc-funds`, `/how-it-works` pages need to be
consolidated into a single `/use-cases` page per design. Security page is
new.

---

## DROPPED / SKIPPED

- **#19 First-deck-free** — design says no.
- **"AI investment associate"** as primary positioning — design demotes it.
- **Phases C and D** (separate Product / Use Cases / Security pages) —
  defer until Phase A + B ship and the client has reviewed.

---

## CRON_SECRET

Generated for `/api/cron/sweep-stuck-analyses` — paste into Vercel project
env (Production + Preview):

```
80bb2fd6480ec2c1575df02aed52d7ad43c3cb310641ad9ce4db605b0984a19e
```

---

## EXECUTION ORDER

1. Phase A (pilot close-out) — ~2 hours.
2. Phase B1 (visual tokens) — 30 min, drives everything else.
3. Phase B2–B11 (homepage + pricing rewrites) — bulk of the work.
4. Test build + restart sam-test + commit + push.
5. Hand off Phase C / D after sign-off.
