# SAM 2.0

## Project Plan -- AI Investment Associate

- **Date:** April 2026
- **Build method:** Claude Code, 1 senior dev
- **Timeline:** 4 weeks
- **AI backbone:** n8n (existing flows)
- **Scope:** Web portal: auth, payments, deal management, AI dashboard, Word export

---

## Contents

1. Survey Analysis
2. Version Definitions
3. V1.0 Scope of Work
   - 3.1 Authentication & Security
   - 3.2 Payment Module
   - 3.3 Pricing Tiers
   - 3.4 Fund Profile
   - 3.5 Dealroom -- Deal Dossiers
   - 3.6 Dashboard -- AI Analysis (9 sections)
   - 3.7 Word Doc Export & Email
   - 3.8 Scoring System Overhaul
   - 3.9 Bug Fixes
4. V2.0 Scope (Fase 2)
5. Creative Ideas
6. UX/UI Guidelines
7. 4-Week Build Plan
8. n8n Discussion Points
9. Pricing Discussion
10. Open Questions

---

## 1. Survey Analysis

13 investors tested SAM and provided structured feedback. Here are the key findings.

### Key Metrics

| Metric | Result |
|---|---|
| Average rating | 7.2 / 10 |
| Verdict accuracy | 4.0 / 5 -- strong validation |
| Willingness to pay | 10 / 13 would consider paying |
| Price range | EUR 20--500/mo, cluster at EUR 50--100 |
| Time saved | Majority estimates 1--10 hrs/mo |
| Most valued section | Executive Summary (8/13), Market Analysis (5/13), Risk Assessment (4/13) |

### Critical Issues -- Must Fix for V1

1. **Scoring breaks when info is missing.** Sam marks 'weak' when data simply isn't available. Multiple respondents flagged this as the #1 trust issue. Missing info should not drag down scores -- it should be reported separately.
2. **Stage-aware scoring needed.** Pre-seed decks are judged against Series A standards. Every experienced VC noticed. Sam needs different scoring models per stage (pre-seed / seed / A / B+).
3. **Report too long for first scan.** Solution: Executive Summary is the default dashboard view. Full sections are drill-down. Word doc export of the summary for quick sharing.
4. **Team search is broken.** LinkedIn scraping fails too often. Google search generates only 1 query per founder. When it can't find someone, it flags 'weak' instead of 'not found.'

### High-Value Features -- Differentiators

5. Upload more than just a deck. Transcripts, call notes, DD docs. Transforms Sam from 'deck checker' (commodity) to 'deal room analyst' (defensible). -> V1 core feature.
6. Exit analysis + competitive landscape. Remy uses Pitchbook for this. Bernard wants deeper comp analysis. -> Fase 2.
7. Financial model analysis from Excel. -> Fase 2.
8. Customizable weighting per investor. -> Fase 2.
9. Chat interface / challenge Sam. -> Fase 2.

### Strategic Insight

> The most strategic feedback came from Michelle (Arches Capital): VCs don't want a 20-page memo before a first call -- they want a quick triage. The Executive Summary as the default view, with a Word doc export for sharing, addresses this directly. Full analysis is the drill-down for post-call due diligence.

---

## 2. Version Definitions

### V1.0 (Fase 1) -- The Deal Room

A web portal where VCs log in, set up their fund profile, create deal dossiers, upload docs, get AI-generated analysis with the Executive Summary as the primary view, and export/email a Word doc summary.

What it is NOT: A Pitchbook competitor. No chat interface. No financial model parsing. No marketplace.

Build time: 4 weeks with Claude Code + 1 senior dev.

### V2.0 (Fase 2) -- The Analyst

Exit analysis engine, financial model ingestion, chat interface, portfolio monitoring, governance analysis, founder-facing prep tool, co-pilot plugin.

---

## 3. V1.0 -- Full Scope of Work

### 3.1 Authentication & Security

| Item | Detail |
|---|---|
| Login | Email + password |
| 2FA | TOTP (Google Authenticator / Authy) -- required for Fund tier, optional for others |
| Session management | JWT with refresh tokens |
| Password reset | Email flow |
| Tenant isolation | Row-level security in PostgreSQL (logical separation). Fund tier gets dedicated schema. Physical DB separation is a V2 promise. |

> Dev note: Use Clerk or Supabase Auth. Don't build from scratch. Gives 2FA, password reset, and session management out of the box.

### 3.2 Payment Module

Provider: Stripe (dominant in EU SaaS, handles VAT/BTW automatically).

- Monthly subscription billing
- Discount code system (percentage or fixed, single-use or multi-use, expiry date)
- Upgrade/downgrade between tiers
- Usage tracking (deals analyzed per month)
- Invoice generation (automated via Stripe)
- Trial period: 14 days, no credit card required

> Dev note: Use Stripe hosted checkout + customer portal. Don't build custom billing UI. Saves significant dev time.

### 3.3 Pricing Tiers

| Feature | Starter -- EUR 49/mo | Professional -- EUR 149/mo | Fund -- EUR 399/mo |
|---|---|---|---|
| Target | Angels, scouts | Individual VCs, small funds | VC funds, CVCs |
| Deals/month | 5 | 25 | Unlimited |
| Users | 1 | 1 | 5 (extra seats EUR 49/mo) |
| Analysis depth | Quick Scan only | Quick Scan + Full Report | Quick Scan + Full Report |
| Doc uploads/deal | Deck only | Deck + 5 docs | Deck + unlimited |
| Fund Fit scoring | No | Yes | Yes |
| Word doc export | No | Yes | Yes |
| Email summary | 3/mo | Unlimited | Unlimited |
| 2FA | Optional | Optional | Required |
| Tenant isolation | Shared | Shared | Dedicated schema |
| Priority processing | No | No | Yes |
| Annual discount | 2 months free | 2 months free | 2 months free |

Rationale: Starter at EUR 49 is low enough to not need a sales call. Professional at EUR 149 hits the survey sweet spot. Fund at EUR 399 is where institutional buyers live (Bernard quoted EUR 250-500). The margin between Pro and Fund justifies itself through unlimited deals, multi-seat, and security features.

> Discussion point: Should Starter include Full Report or only Quick Scan? Limiting to Quick Scan creates a clear upgrade path, but may frustrate users evaluating the product. Alternative: give 2 full reports/month on Starter as a taste.

### 3.4 Fund Profile (Fund Setup)

The investor configures their fund once. This data powers the Fund Fit analysis.

| Field | Purpose |
|---|---|
| Fund name + logo | Branding on exports |
| Fund website | Link |
| Investment thesis | Free text -- what they look for |
| Stage focus | Checkboxes: pre-seed / seed / Series A / B+ |
| Sector focus | Tags: SaaS, Fintech, DeepTech, Health, etc. |
| Geo focus | Countries / regions |
| Ticket size | Min--max range |
| Fund size | Used for fund fit calculation |
| Portfolio companies | Optional -- enables conflict check |

UX: Wizard-style onboarding (3 steps). Skip-able -- let users analyze a deal before completing their profile.

### 3.5 Dealroom -- Deal Dossiers

Each deal is a folder/dossier containing all information about an investment opportunity.

Per deal:
- Company name (auto-populated from deck if possible)
- Stage selector (pre-seed / seed / A / B+)
- Status pipeline: New -> Reviewing -> First Call -> DD -> Passed / Invested
- Source/referral tracking
- Custom tags

Document uploads per deal:
- Pitch deck (PDF) -- primary trigger for analysis
- Transcripts (meeting notes, call recordings as text)
- DD documents
- Financial models (upload in V1, analysis in V2)
- Other (term sheets, legal docs, etc.)

> Source citations (bronvermelding): Every claim Sam makes must reference where in the uploaded documents it found the information, or flag it as externally sourced (LinkedIn, web search). Non-negotiable for trust.

### 3.6 Dashboard -- AI Analysis (9 Sections)

When the user triggers analysis, Sam processes uploaded docs through existing n8n flows and renders results in the portal. The Executive Summary is the default view.

**6.1 Executive Summary (default view)**
- Verdict badge: Strong Buy / Explore / Conditional Pass / Pass -- large, prominent, color-coded
- Confidence level: High / Medium / Low
- Overall score with radar chart showing all domain scores
- Investment scorecard table
- 1-paragraph thesis
- Key strengths (3--5 items, classified: Critical / Warning / Info)
- Key risks (3--5 items, classified: Critical / Warning / Info)
- Data completeness indicator
- Action button: 'Generate Word Doc & Email'

**6.2 Team**
- Founders overview table
- Founder-market fit assessment
- Team dynamics & composition
- LinkedIn profile data (improved multi-query search)
- Red flags with severity classification

**6.3 Market**
- TAM/SAM/SOM validation (founder claim vs validated estimate)
- Market dynamics & Why Now
- Competitive landscape table

**6.4 Product**
- Problem assessment (pain score)
- Solution & 10x better test
- Moat analysis
- Technical risk assessment

**6.5 Traction**
- Revenue & growth metrics
- Unit economics
- Retention & engagement
- Red flags & data gaps

**6.6 Finance**
- Financial health overview
- Capital efficiency
- Valuation assessment (conservative / moderate / aggressive)
- Deal terms & cap table analysis

**6.7 Exit Potential (NEW)**
- Comparable exits in sector/geo (web-search based in V1)
- Realistic exit range based on current trajectory
- Exit timeline estimation
- Acquirer landscape

**6.8 Fund Fit (Pro + Fund tiers)**
- Stage, sector, geo, ticket size match
- Thesis alignment score
- Portfolio conflict check

**6.9 Missing Information (NEW)**
- Checklist of what's needed for complete analysis
- Per section: what data is missing and what impact it would have
- Clear distinction: 'not found' =/= 'negative signal'
- Suggested follow-up questions for first call
- Missing info does NOT affect scores -- reported separately

### 3.7 Word Doc Export & Email

User clicks 'Generate & Send' -> system generates a formatted Word doc of the Executive Summary -> emails it as attachment to the user (or a custom email).

Word doc contents:
- SAM logo/header
- Company name, stage, date
- Verdict + confidence + overall score
- Investment scorecard table
- Key strengths and key risks (with severity tiers)
- Missing information summary
- Suggested first-call questions
- Footer: 'Generated by SAM -- AI Investment Associate'

> This is a clean, professional document ready to forward to partners or print for an IC meeting.

### 3.8 Scoring System Overhaul

Stage-aware scoring weights:

| Domain | Pre-seed | Seed | Series A | Series B+ |
|---|---|---|---|---|
| Team | 35% | 25% | 15% | 10% |
| Market | 25% | 25% | 20% | 15% |
| Product | 20% | 20% | 20% | 20% |
| Traction | 5% | 15% | 25% | 30% |
| Finance | 15% | 15% | 20% | 25% |

Missing data handling:
- If data coverage < 40% for a section -> show 'Insufficient Data' badge instead of a score
- Never label 'weak' based on absence of information
- Show data completeness % per section

Red flag classification:
- **Critical:** deal-breaking issues (fraud signals, impossible claims, fundamental flaws)
- **Warning:** significant concerns that need follow-up
- **Info:** notable items, not necessarily negative

### 3.9 Bug Fixes

| Bug | Fix | Effort |
|---|---|---|
| Team: single search query | Generate 3-5 queries per founder (name+company, name+role+sector, name+LinkedIn, etc.) | 4 hrs |
| Team: Google vs LinkedIn priority | LinkedIn scraper first -> Google fallback -> retry logic | 4 hrs |
| 'Weak' when no info found | Replace with 'Not Found / Insufficient Data' -- absence =/= negative signal | 2 hrs |
| Stage-blind scoring | Implement stage-aware weights (table above) | 8 hrs |
| Email in spam | Move to Resend or Postmark with proper DKIM/SPF/DMARC | 4 hrs |

---

## 4. V2.0 Scope (Fase 2)

**Exit Analysis Engine**
Comparable exit database, competitor mapping with revenue estimates, exit multiple benchmarks by sector/stage/geo. Start manual, enrich with web scraping, consider Pitchbook API.

**Financial Model Ingestion**
Upload Excel models -> parse P&L, cash flow, projections. Validate assumptions against benchmarks. Flag inconsistencies between deck claims and model.

**Post-Investment Portal**
Upload ongoing deal docs: DD reports, investment proposals, board minutes, participation agreements, KvK shareholder records, AVA, business plans, financials, KYC docs. Monthly reporting. Follow-on investment decision support.

**Chat Interface**
Conversational AI on top of the analysis. 'Why did you rate the team as moderate?' Context-aware: uses all uploaded docs + analysis results.

**Governance Analysis**
Shareholder structure mapping, voting rights analysis, cap table planning. Reference: Govin / WeVeStr for features. Convertible analysis (Capital Waters style).

**Co-Pilot Plugin**
Sam as Microsoft Copilot plugin for in-workflow access.

**Founder-Facing Prep Tool**
Founders run their deck through Sam before sending to VCs. Freemium acquisition channel that also improves data quality.

**Additional**
KvK integration, image/chart analysis, custom report templates, co-investor recommendations, SOC2 compliance (Fund tier), physical DB separation (Fund tier), Dutch language reports.

---

## 5. Creative Ideas

**1. Email-to-Deal Auto-Triage**
VCs forward inbound emails to deals@sam.ai. Sam auto-creates the dossier, extracts the deck, runs Quick Scan, and only notifies the VC if it passes their threshold. Removes the biggest friction: manually uploading decks. Could be V1.5 or early V2.

**2. 'SAM Score' as Industry Standard**
Create a public benchmark. 'This deal scored 78 on SAM.' If VCs share SAM scores, you get network effects. Consider a free tier where founders self-assess and share with investors.

**3. Pre-Call Brief Mode**
Before a first call: 5 smart questions based on gaps, 1-pager on founder backgrounds, comparables, 3 things to watch for. Takes 2 minutes to read. Makes the VC look incredibly prepared.

**4. Deal Flow Analytics Dashboard**
Show VCs their own patterns: 'You pass on 73% of SaaS deals but invest in 40% of health-tech. Average time-to-decision: 14 days.' Self-awareness tool that creates stickiness.

**5. Syndication Layer (V2+)**
When a VC passes on a well-scored deal, offer to anonymously share with matching VCs. You become the deal flow network layer. Long-term moat.

---

## 6. UX/UI Guidelines

### Design Principles

Speed over beauty. The #1 thing every respondent praised was speed. Progressive loading -- show Executive Summary first while other sections generate.

Executive Summary is home base. When you open a deal, you see the verdict, scorecard, and key risks in 3 seconds. Everything else is drill-down.

Trust through transparency. Every number needs a source citation. If Sam doesn't know something, it says 'Not Found' -- never fakes confidence.

Scannable, not readable. Bold verdicts, color-coded scores (green/amber/red), collapsible sections. Full text on drill-down.

### Layout

Main navigation: Left sidebar with deal list (cards: company name, stage badge, verdict color, date). Top bar: fund name, settings, account.

Deal view: Tab navigation across 9 sections. Executive Summary is default. Each tab header: section name + score badge + data completeness %.

Executive Summary view: Top: large verdict badge + confidence + radar chart. Below: two-column -- strengths left, risks right. Below that: missing info + suggested questions. Floating action: 'Generate Word Doc & Email.'

### What NOT to Do

- Don't make it look like ChatGPT. This is a professional analytical tool, not a chatbot.
- Light mode default. Financial tools are light-mode-first.
- Don't auto-run analysis on upload. Let users upload multiple docs first, then trigger.
- Don't hide score methodology. Link 'How SAM scores' from every section.

---

## 7. 4-Week Build Plan

Stack: Next.js + Supabase (auth + DB + storage) + Stripe + n8n webhooks.

### Week 1: Foundation

- Day 1-2: Project setup: Next.js, Supabase, Stripe scaffolding. DB schema: users, funds, deals, documents, analyses.
- Day 3-4: Auth: Supabase Auth with 2FA (TOTP). Login / register / reset flows.
- Day 5: Stripe: subscription checkout, webhook handlers, tier enforcement middleware. Discount code model.

*Deliverable: User can sign up, log in with 2FA, subscribe to a tier.*

### Week 2: Deal Management

- Day 1-2: Fund profile: wizard-style setup (3 steps). CRUD for fund details.
- Day 3-4: Dealroom: deal CRUD, document upload (S3/R2), file type tagging. Deal pipeline status.
- Day 5: n8n integration: webhook triggers from portal -> n8n. Callback from n8n -> portal to store analysis results.

*Deliverable: User can set up fund, create deals, upload docs, trigger analysis.*

### Week 3: Dashboard + Export

- Day 1-2: Executive Summary view: verdict, scorecard, radar chart, strengths/risks with severity.
- Day 3: Remaining 8 tabs: render analysis data per section. Source citations UI. Missing info tab.
- Day 4: Word doc generation: Executive Summary -> formatted .docx. Email send via Resend/Postmark.
- Day 5: Scoring overhaul: stage-aware weights, missing data handling.

*Deliverable: Full dashboard working, Word doc export, email delivery.*

### Week 4: Polish + Launch

- Day 1: Bug fixes: team search (multi-query), 'weak' -> 'not found', email deliverability.
- Day 2: Tier enforcement: feature gating per plan, usage tracking, discount codes.
- Day 3: Red flag severity classification. Data completeness indicators.
- Day 4: QA: end-to-end testing with real decks. Mobile responsiveness. Error handling.
- Day 5: Beta launch. Onboard first 5 survey respondents.

*Deliverable: V1.0 live.*

### Risk Flags

| Risk | Impact | Mitigation |
|---|---|---|
| n8n <-> portal integration takes longer | Week 2 bleeds into Week 3 | Define API contract (webhook payloads, callback format) before day 1 |
| Word doc formatting is fiddly | Eats 1-2 extra days | Keep doc simple: clean headings + tables. Use docx-js. |
| Stripe subscription logic complex | Week 1 stretches | Use Stripe hosted checkout + customer portal |
| 9 dashboard sections = a lot of UI | Week 3 is packed | Build Exec Summary first. Other tabs can be simpler rendered markdown. Polish in V1.1. |

> Honest assessment: If things go well, 4 weeks is doable for MVP-quality. If you want polish (animations, responsive design, edge cases), budget 5-6 weeks. Most likely to slip: dashboard UI -- 9 sections is a lot of frontend work.

---

## 8. n8n -- Discussion Points for Dev

n8n stays as the AI backbone for V1. The flows work, rewriting them would waste time. But the dev needs to understand the integration model.

Architecture: The portal handles auth, payments, CRUD, and UI. n8n handles AI orchestration. Communication is via webhooks: portal sends POST (deal ID + doc URLs) -> n8n processes -> n8n calls back to portal API with structured JSON results -> portal stores in DB and renders.

Key risks to discuss:
- **Concurrency:** n8n webhook execution is serial by default. If 5 users trigger analysis simultaneously, they queue. Fine for <50 users in V1. For V2, need parallel execution or a proper job queue.
- **Data retention:** n8n stores execution data. At scale, this DB grows fast. Set retention to 7 days max for production executions.
- **Error handling:** Portal needs to handle n8n failures gracefully -- timeout, retry, show 'analysis failed' state. Don't let a broken n8n flow crash the user experience.
- **API contract:** Define the exact webhook payload and callback format before day 1. This is the #1 integration risk.

---

## 9. Pricing Discussion

The survey gives clear signals. Here's the analysis and open questions.

### What's clear from the data:

- EUR 20-50/mo is too cheap. At that price you attract tire-kickers.
- The most enthusiastic buyers (Bernard EUR 100-250, Diedert EUR 250-500, Dd EUR 50-100) confirm value exists at EUR 100+.
- Olivier (rated 9/10, would pay, founder at FounderBridge) is a potential channel partner, not just a customer.

### Open pricing questions:

1. Is Starter at EUR 49 right? If only Quick Scan, is that enough value?
2. Should Professional be EUR 99 or EUR 149? EUR 99 feels natural for individual VCs. EUR 149 says 'we're serious.'
3. Fund at EUR 399 -- should it be EUR 499 and negotiate down? Institutional buyers expect it.
4. Deal limits: 5/25/unlimited or 10/50/unlimited?
5. Trial: 14 days or 30 days?

> Suggestion: Launch at EUR 49/EUR 149/EUR 399. Price up is easier than price down. Offer first 20 customers (survey respondents) 50% off for 3 months as a thank-you and urgency driver.

---

## 10. Open Questions

**1. Stack confirmation**
Next.js + Supabase + Stripe -- is the dev comfortable with this? If they prefer Python/Django + PostgreSQL, the plan adapts but timeline might shift.

**2. Domain / branding**
Do you have a domain? sam.ai, getsam.io, something else? Affects email deliverability setup (DKIM/SPF/DMARC).

**3. Landing page**
Is V1 invite-only beta (saves 2 days) or public with waitlist? If public, add 2 days for a landing page.

**4. n8n hosting**
Where is n8n running? Self-hosted -> dev needs access. n8n Cloud -> check plan limits for concurrent executions.

**5. Beta outreach**
5 of the 13 survey respondents gave solid email addresses and high WTP. These are your beta users. Ready to draft the outreach?
