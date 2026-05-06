# SAM Pilot Feedback — Plan

Source: pilot-feedback session (2026-05-06), 29 items across 12 areas. This plan covers
the more functional client; the second session is parked until shared. Implementation
waits on design hand-off from the user.

## Severity legend

- **P0 — pilot blocker.** Customer can't complete a core flow, or the output is wrong
  in a way that breaks trust (mis-scored, ghost verdicts, silent failure).
- **P1 — pilot-critical.** Degrades quality or trust, must ship before broader rollout.
- **P2 — polish.** UX papercuts, naming, layout.
- **P3 — new product flow.** Genuine new behaviour, not a fix.

Effort key: XS <30 min · S <2 h · M 2–6 h · L >6 h.

## Triage table

| # | Area | Item (short) | Sev | Effort |
|---|---|---|---|---|
| 1 | Registration | Tier picker — can't pick higher tiers, top always shows "walkthrough" | P0 | M |
| 3 | Registration | Wizard regression — info entered then thrown back to init | P0 | M |
| 6 | General | No error surfaced after 60 min stuck flow | P0 | L |
| 7 | General | Reanalyse button doesn't work | P0 | S |
| 15 | Team | LinkedIn search broken (SALVIO case) | P0 | L |
| 17 | Billing | Could only select 1st tier; later showed middle, couldn't upgrade | P0 | M |
| 21 | Fund fit | Score inconsistency: 50/100 vs 70 overall | P0 | S |
| 22 | Ask Sam | Doesn't read fund profile context | P0 | M |
| 28 | Export | Download still has "Conditional pass" / "Pass" verdict | P0 | S |
| 8 | General | Deck still sent by email — disable | P1 | XS |
| 9 | General | Sources still include pitch deck despite prompt | P1 | M |
| 10 | Upload | Name extraction sometimes fails — need manual override | P1 | M |
| 11 | Upload | Premature stage label at upload, before analysis | P1 | S |
| 12 | Upload | Sevvy deck rejected (used to work in test accounts) | P1 | M |
| 13 | Exec summary | Rubric meta-text leaks into copy ("Weighting applied…") | P1 | S |
| 14 | Exec summary | Status labels need colour (New, Reviewing, …) | P1 | XS |
| 16 | Team | LinkedIn logo missing from team cards (Google shows) | P1 | XS |
| 18 | Billing | No memo usage meter on Current Plan; no upgrade alert | P1 | M |
| 20 | Billing | Tier prices need to align with target | P1 | XS |
| 25 | Ask Sam | Dead `+` button in chat UI | P1 | XS |
| 27 | Market | Variance text-box overflows validated info | P1 | XS |
| 29 | Export | Email-with-file path — disable | P1 | XS |
| 2 | Registration | Fund-website scraper not offered during onboarding | P2 | M |
| 4 | Fund fit | No back-nav from completed details to About You | P2 | S |
| 5 | Fund fit | All Fund Fit details should be mandatory | P2 | S |
| 23 | Ask Sam | Rename "Go pilot" → "Ask Sam" | P2 | XS |
| 24 | Ask Sam | Surface model name in chat UI | P2 | XS |
| 26 | Dashboard | Exec summary layout: 3rd column too narrow, reorganise | P2 | M |
| 19 | Billing | First-deck-free trial mechanic | P3 | L |

## Sequencing

### Wave 1 — investigations (parallel, before fixes)

These are items where root cause is unknown. We need a confirmed cause before we can
write a real fix. Five threads, all independent:

- **#6 error notifier audit.** Confirm whether the 60 min stuck flow actually threw an
  error (which should have fired our Sam-Error-Notifier → SAM dashboard callback) or
  *hung* (Wait node, LLM timeout, missing webhook response). If it hung, no error
  fires by design — we need a status-sweep cron, not a notifier patch.
- **#7 reanalyse trace.** Locate the reanalyse handler, capture the failure mode.
- **#12 Sevvy upload.** Get the file from the client, repro locally, check whether it's
  PDF parsing, MIME, RLS, size, or the new direct-to-Supabase path.
- **#15 SALVIO LinkedIn.** Trace the search path; identify whether it's the search
  source, the parse, or the gating heuristic.
- **#21 score inconsistency.** Find both render sites in Fund Fit, identify which calc
  feeds each, decide on canonical.

### Wave 2 — quick wins (one bundled PR)

XS / S items with no investigation needed. Bundle to keep PR overhead low:

- #8 disable deck-by-email send
- #14 status-label colours (use chip palette already in dropdown)
- #16 LinkedIn logo asset on team cards
- #20 tier-price values aligned with target
- #23 rename Go pilot → Ask Sam (string + nav)
- #24 surface model name (`claude-opus-4-7` or whatever's live) under composer
- #25 remove or wire dead `+` button
- #27 Market variance overflow — CSS clamp / overflow-hidden
- #28 strip verdict labels from DOCX/PDF export template
- #29 disable email-with-file path

### Wave 3 — medium fixes (parallel, one PR each)

Each isolated, can be picked up in any order after Wave 1 confirms causes:

- **#1 / #17 Stripe tier flow.** One consolidated PR. Fix tier picker on registration
  + settings/billing. The "needs walkthrough" dialog is currently gating *all* tiers
  instead of only Fund — likely a bad conditional. Verify `/api/stripe/switch` (we
  shipped today) handles all transitions, including starter→professional.
- **#3 Registration regression.** Reproduce on a fresh signup, check whether middleware
  bounces back to init based on a profile state, or whether wizard step doesn't
  advance after submit.
- **#4 / #5 Fund Fit nav + mandatory.** Add a back-link from details to About You.
  Mark every Fund Fit field required, validate before submit.
- **#9 Sources filter.** Pitch deck is leaking into Sources despite prompt. Either
  (a) prompt needs a hard guard ("never include the deck itself"), or (b) we
  post-filter — strip any source whose `kind === 'pitch_deck'` from the rendered list.
  Prefer (b) — prompts are unreliable.
- **#10 Manual name override.** Add an editable name field on the upload card. Existing
  extractor stays as the default, user can overwrite. (Praetori_Pitch_Deck (1).pdf
  case — extractor probably skipped because filename has parens / numbers.)
- **#11 Defer stage label.** Stage tag should not appear until Flow 0 returns the
  classification. Currently being set at upload — find the source, gate on analysis
  result.
- **#13 Strip rubric meta-text.** "Weighting applied (per stage rubric…) yields a
  computed…" is leaking into the summary string. Either prompt-level (instruct LLM
  not to narrate the rubric) or post-process regex strip on the executive_summary
  field. Recommend both.
- **#22 Inject fund profile into Ask Sam.** Fetch fund profile + thesis + recent
  preferences in `/api/chat`, prepend to system prompt. Single-file plumbing if the
  scope param work from Phase 4 already routes context.
- **#26 Exec summary layout.** Restructure the 3-column block:
  1. Company details
  2. Investment thesis (wider)
  3. Confidence score + performance overview (two graphs side by side)
  Then domains row underneath.

### Wave 4 — larger work

- **#2 Bring scraper into onboarding.** The fund-website scraper exists at settings
  level (we shipped it). Surface it as a step in the onboarding wizard so new users
  don't have to backfill from settings.
- **#15 LinkedIn search rebuild.** Existing pending task. Pair with #16 (logo).
- **#18 Memo usage meter.** Add usage count + cap visualisation on `/settings/billing`.
  Hook to `analyses` count for the period. Add an alert banner when ≥80% of cap.
  Buy-more-memos flow optional, post-MVP.
- **#6 status-sweep cron** (depends on Wave 1 audit). If audit confirms hang vs error,
  add `/api/cron/sweep-stuck-analyses`: select rows in `analysing` older than 15
  min, mark `failed` with `error = 'timeout'`. Existing Realtime subscription on
  `useDeals` already propagates to UI.

### Wave 5 — product

- **#19 First-deck-free.** New trial mechanic. Likely:
  - new `tier = 'free'` profile state, capped to 1 analysis ever
  - registration wizard offers "analyse one deck free" CTA in addition to tier picker
  - on first analysis completion, prompt to subscribe to a paid tier
  - Stripe coupon path can stay as-is (used by promo codes); free tier is a separate
    pre-Stripe state
  - billing page handles the upgrade transition into a paid tier

## Files-likely-touched (rough)

| Wave | Item | Files |
|---|---|---|
| 1 | #6 | n8n flow audit; new `/api/cron/sweep-stuck-analyses/route.ts`; `vercel.json` cron config |
| 1 | #7 | locate reanalyse handler (`grep -r reanalyse src/app/api`) |
| 1 | #12 | upload UI + upload API + Sevvy file repro |
| 1 | #15 | n8n flow that runs LinkedIn search; or Supabase fn if local |
| 1 | #21 | Fund Fit page render + score calc lib |
| 2 | #8/#29 | n8n flow (Gmail send node) + any backend email path |
| 2 | #14 | status chip styles |
| 2 | #16 | team-card component |
| 2 | #20 | pricing config (`pricing.ts` or env) |
| 2 | #23 | global rename — `Go pilot` strings, route names |
| 2 | #24 | chat composer footer |
| 2 | #25 | chat header / composer |
| 2 | #27 | Market dynamics styles |
| 2 | #28 | `/api/export/word/route.ts`, `/api/export/pdf/route.ts` (if exists) |
| 3 | #1/#17 | tier picker + `/api/stripe/checkout`, `/api/stripe/switch`, billing page |
| 3 | #3 | onboarding wizard + middleware |
| 3 | #4/#5 | Fund Fit wizard pages |
| 3 | #9 | sources filter (UI post-filter) + analysis prompt |
| 3 | #10 | upload card UI |
| 3 | #11 | stage label assignment site |
| 3 | #13 | exec summary prompt + post-process |
| 3 | #22 | `/api/chat` system-prompt builder |
| 3 | #26 | exec summary tab |
| 4 | #2 | onboarding wizard (add scraper step) |
| 4 | #15 | LinkedIn search worker |
| 4 | #18 | billing page + usage query hook |
| 5 | #19 | profile schema + tier mapper + onboarding + billing |

## Open questions for the design

When the design lands, we'll need answers on these specifically:

1. **#26 Exec summary** — confirm new column proportions and whether confidence + performance
   are two graphs or one combined.
2. **#14 Status colours** — match the dropdown chip palette exactly, or refresh palette?
3. **#19 Free trial** — does free deck get the full memo or a redacted preview?
4. **#18 Usage meter** — design wants alert banner, top-of-billing card, or both?
5. **#28 Export** — is the entire conclusion section coming out, or just the verdict label
   line? (different from the UI strip we already shipped)
6. **#23 / #24 Ask Sam** — does the model name belong as a small footnote, in the header,
   or in a settings/info button?

## Out-of-scope reminders

Per active focus memory: this plan does not touch testnet chains, off-platform agent
services, or anything outside SAM. SAM-only.
