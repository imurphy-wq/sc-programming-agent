# S&C Programming Agent — Architecture Requirements Document

**Version:** 1.0 | **Date:** 2026-04-16 | **Status:** Active

---

## System Overview

A Next.js 14 web application that accepts athlete context from a coach via a structured form, builds a domain-rich prompt incorporating S&C knowledge and the coach's program template style, calls the Anthropic Claude API, and renders a complete periodized training program in the coach's established format.

```
Coach (Browser)
    ↓  HTTPS / form submit
Next.js App (Vercel)
    ├── /src/app/page.tsx               ← Athlete intake form
    ├── /src/components/                ← Form, display, sport/position selectors
    └── /src/app/api/generate/route.ts  ← API route (server-side only)
         ↓  Secure API call (ANTHROPIC_API_KEY never exposed client-side)
Anthropic Claude API  (claude-sonnet-4-6)
    ↑  System prompt = S&C knowledge base + template format + guardrails
    ↑  User message  = structured athlete context from form
```

---

## Program Output Format

The AI agent must output programs in the coach's established format — derived from the WLAX Block 1 Phase 1 template. This is a hard requirement, not a preference.

### Template Structure

```
PROGRAM HEADER
Sport: [SPORT] | Season: [SEASON] | Block: [N] | Phase: [N]
Type: [Intro-Returner / Returner / Freshman / etc.]
Test Maxes: Squat: [#] lbs | Bench: [#] lbs | Clean: [#] lbs | Trap Bar DL: [#] lbs | Vert: [#]" | 10yd: [#]s | Pull-ups: [#]

─────────────────────────────────────────────────────────────────
DAILY PRE-LIFT (ALL DAYS)
Foam Roll: Glutes / Hamstrings / Calves / Lower Back / Lats — 8 passes each
Static Stretch: Hamstring / Hip Flexor / Calves — 20 sec each
Dynamic Warmup: [Sport-appropriate movements — A skip, Knee Pulls, Fig. 4s, Lat Lunges, etc.]
─────────────────────────────────────────────────────────────────

REASONING & PROGRAM RATIONALE
[Periodization model chosen and why. Sport-specific rationale. Key programming decisions.
Red flags or caveats. Any situations requiring sports medicine review.]

─────────────────────────────────────────────────────────────────

DAY 1 — [Focus: Lower Body Strength / etc.]

[SPEED / COD — if applicable for this sport/phase]
- Drill Name: Nx distance, rest protocol
- Drill Name: Nx distance, rest protocol

| # | EXERCISE | WK1 % | WK1 SETS×REPS | WK1 WT NOTE | WK2 % | WK2 SETS×REPS | WK2 WT NOTE | WK3 % | WK3 SETS×REPS | WK3 WT NOTE | WK4 % | WK4 SETS×REPS | WK4 WT NOTE | COACHING NOTE |
|---|----------|-------|--------------|------------|-------|--------------|------------|-------|--------------|------------|-------|--------------|------------|--------------|
| 1 | Trap Bar Deadlift | — | 4×6 | | — | 4×6 | ADD 5% | — | 4×5 | ADD 10% | — | 4×5 | ADD 10% | Drive floor away |
| 2 | Front Squat | — | 4×6 | | — | 4×6 | | — | 4×8 | | — | 4×8 | | Elbows HIGH |
| 3A | DB Rev Lunge | — | 3×8 e. | | — | 3×8 e. | | — | 3×8 e. | | — | 3×8 e. | | |
| 3B | Glute Bridge Hold | — | 3×:30s | Bar | — | 3×:35s | 65 lbs | — | 3×:40s | 75 lbs | — | 3×:45s | 85 lbs | |
| 3C | Hollow Hold | — | 2×:20s | | — | 2×:20s | | — | 2×:20s | | — | 2×:20s | | |
| 4A | BB RDL | — | 3×8 | | — | 3×10 | | — | 4×8 | | — | 4×10 | | |
| 4B | Side Plank w/ Hip Lift | — | 3×:20s e. | | — | 3×:25s e. | | — | 3×:30s e. | | — | 3×:35s e. | | |
| 4C | Hanging Leg Raises | — | 3×12 | | — | 3×12 | | — | 3×12 | | — | 4×12 | | |

[Repeat structure for DAY 2, DAY 3, DAY 4]
```

### Key Format Rules (enforced in system prompt)

1. **% column** — Use actual percentages of entered 1RM when maxes are provided. Leave "—" for Phase 1 intro blocks where maxes are not yet established.
2. **"e." suffix** — Always append to unilateral exercise prescriptions (e.g., "3×8 e." means each leg/arm)
3. **Superset groups** — 3A/3B/3C and 4A/4B/4C are supersets/circuits completed together. Number prefix defines grouping.
4. **Progressive loading notes** — Include inline (ADD 5%, ADD 10%, add if able, start light)
5. **Speed/COD section** — Precedes lifting on Day 1 and Day 3 for field/court/invasion sports
6. **Conditioning** — Day 4 for most sport templates; may include tempo runs, prowler work, etc.
7. **Exercise progressions within block** — Exercises can progress (Goblet → Front Squat) across weeks within one block
8. **Coaching notes** — Short, imperative, uppercase emphasis for key cues ("get HIGH", "ELBOWS UP", "walk back is rest")
9. **Day-specific warmup additions** — Layer on top of standard daily pre-lift (e.g., Day 2 adds Band Pull Aparts, Push-up to T, Medball Chest Pass before upper body day)

---

## Component Architecture

```
/src
  /app
    layout.tsx                  ← Root layout, metadata, global CSS
    page.tsx                    ← Main page (renders AthleteForm)
    globals.css
    /api
      /generate
        route.ts                ← POST handler: validate → build prompt → call Claude → stream
  /components
    AthleteForm.tsx             ← Full intake form with all fields
    ProgramDisplay.tsx          ← Renders generated program (Markdown → HTML tables)
    SportSelector.tsx           ← Sport dropdown
    PositionSelector.tsx        ← Position dropdown (conditional on sport)
    MaxesInput.tsx              ← Sets of max inputs with "untested" option
    LoadingState.tsx            ← Streaming progress indicator
  /lib
    systemPrompt.ts             ← buildSystemPrompt() — S&C knowledge + format template
    types.ts                    ← All TypeScript interfaces
    validation.ts               ← Zod schemas for form + API input validation
    sportsConfig.ts             ← Sport taxonomy with positions (imported from /config)

/config
  sports.ts                     ← Complete sport/position taxonomy for all college sports

/tests
  /unit
    validation.test.ts          ← Zod schema tests
    systemPrompt.test.ts        ← Prompt structure tests
    sportsConfig.test.ts        ← Sport config completeness tests
  /integration
    generate.test.ts            ← API route integration tests (mocked Claude)
  /evaluation
    scenarios.test.ts           ← The 10 PRD evaluation scenarios (structural checks)

/.github
  /workflows
    ci.yml                      ← Lint + typecheck + test on push/PR
    weekly-refresh.yml          ← Weekly test run + dependency audit
```

---

## Architecture Decision Records

### ADR-001: Next.js 14 App Router
**Decision:** Next.js over standalone React + Express  
**Rationale:** Single repo; API routes built-in (no separate server); Vercel deployment trivial; TypeScript first-class; streaming via `ReadableStream` built into App Router; no CORS configuration needed  
**Trade-off:** Framework lock-in. Acceptable given Vercel target and team size.

### ADR-002: claude-sonnet-4-6
**Decision:** Use `claude-sonnet-4-6` for program generation  
**Rationale:** Sufficient capability for multi-week program generation with complex constraint handling; cost-effective vs. Opus; streaming support; knowledge cutoff covers current S&C research  
**Trade-off:** ~15–45 second generation time. Mitigated by streaming response display.

### ADR-003: Static Knowledge Base (Not RAG)
**Decision:** Embed S&C knowledge in a static `systemPrompt.ts` file, not a vector database  
**Rationale:** Condensed research knowledge fits within Claude's context window; eliminates embedding infrastructure and operational complexity; updates via code commit + deploy (version-controlled, reviewable); adequate for v0–v1 scope  
**Revisit trigger:** If knowledge base exceeds ~40k tokens OR when automated research ingestion is required at v2.

### ADR-004: Server-Side API Call Only
**Decision:** All Claude API calls made exclusively server-side via the API route  
**Rationale:** `ANTHROPIC_API_KEY` must never appear in client-side JavaScript bundles. Next.js API routes run server-side only.  
**Enforcement:** `ANTHROPIC_API_KEY` stored as Vercel environment variable; `.env.local` in `.gitignore`; environment variable never referenced in any `/src/app/*.tsx` or `/src/components/*.tsx` file.

### ADR-005: Streaming Response
**Decision:** Stream Claude's response to the client  
**Rationale:** Program generation at this complexity takes 15–45 seconds. Showing the response appearing in real time dramatically improves perceived UX. Next.js App Router supports `ReadableStream` responses natively.  
**Implementation:** API route returns a `ReadableStream`; client reads via `Response.body.getReader()` and appends to display state.

### ADR-006: Markdown Output Format
**Decision:** Instruct Claude to output in Markdown with table structure matching the coach's template  
**Rationale:** Markdown tables naturally match the spreadsheet-like structure of the WLAX template. `react-markdown` with `remark-gfm` renders GitHub-flavored Markdown tables as proper HTML tables. Avoids JSON parsing fragility with streaming. Coach-readable format if copied to other tools.  
**Trade-off:** Less machine-parseable than JSON; acceptable for v1 display-only use case.

### ADR-007: Zod Validation on Both Client and Server
**Decision:** Use Zod schemas for form validation (client) and API route validation (server)  
**Rationale:** Single source of truth for validation logic; TypeScript type inference from schemas; runtime safety on server; prevents prompt injection via unvalidated user inputs embedded in prompts  
**Enforcement:** API route rejects any request that fails schema validation before building the prompt.

### ADR-008: GitHub Actions for CI + Weekly Maintenance
**Decision:** GitHub Actions for CI and weekly automated test runs  
**Rationale:** Free tier adequate; integrated with repo; cron scheduling built-in; no additional tooling needed  
**Weekly job purpose:** Run full test suite + `npm audit` for vulnerabilities; alert via GitHub summary if either fails. Forcing function to catch dependency drift and test regression.

---

## Data Flow (detailed)

```
1. Coach fills AthleteForm.tsx
   ↓
2. Client-side Zod validation (immediate feedback)
   ↓
3. Form submits POST /api/generate with JSON body
   ↓
4. route.ts: Server-side Zod validation
   → Invalid: 400 response with error detail
   → Valid: continue
   ↓
5. route.ts: buildSystemPrompt() called
   → Returns: S&C expertise + format template + sport-specific rules + safety guardrails
   ↓
6. route.ts: buildUserMessage(formData) called
   → Returns: structured athlete context in prompt-optimized format
   ↓
7. Anthropic SDK: client.messages.stream() called
   → Model: claude-sonnet-4-6
   → System: buildSystemPrompt()
   → Messages: [{ role: 'user', content: buildUserMessage(formData) }]
   → Max tokens: 4000
   ↓
8. Streaming response piped back via ReadableStream
   ↓
9. Client reads stream, appends to state, re-renders ProgramDisplay
   ↓
10. On stream completion, full Markdown rendered as HTML via react-markdown
```

---

## Security Model

| Concern | Control |
|---------|---------|
| API key exposure | Server-side only; `ANTHROPIC_API_KEY` in Vercel env vars; `.env.local` gitignored |
| Prompt injection | All user inputs passed through Zod validation + sanitization before prompt inclusion; inputs embedded as data, not instructions |
| Rate limiting | Basic IP-based rate limiting in API route (1 request / 30s / IP) for v1 |
| Input length limits | Zod schemas enforce max character limits on all free-text fields |
| CORS | Default Next.js same-origin; no public API exposure |
| Secrets in commits | `.env.local` and `.env*.local` in `.gitignore`; `.env.example` committed with placeholder values |

---

## System Prompt Architecture

The system prompt in `systemPrompt.ts` is structured in order of priority:

```
Layer 1: Role and Expertise
  "You are a college-level strength and conditioning coach..."

Layer 2: Program Philosophy
  - Periodization knowledge (LP, block, DUP, conjugate, reactive)
  - Sport-specific demand profiles and red flags
  - In-season vs off-season programming constraints
  - Training age and individualization principles

Layer 3: Program Template Format (hard requirement)
  - Exact format matching the WLAX Block 1 Phase 1 template
  - Day structure, superset notation, progressive loading syntax
  - % column rules, "e." suffix rules, coaching note style

Layer 4: Safety Rules
  - Exercise contraindications by sport/position/injury
  - Return-to-play boundary (always defer to sports medicine)
  - What to refuse vs. what to flag

Layer 5: Output Quality Rules
  - No false precision (use ranges)
  - Surface uncertainty explicitly, don't fabricate
  - Include a Reasoning block before the program
  - Flag red flags explicitly in a dedicated section
```

---

## Environment Variables

| Variable | Required | Where Set | Notes |
|----------|----------|-----------|-------|
| `ANTHROPIC_API_KEY` | Yes | Vercel env vars + local `.env.local` | Never commit |
| `NODE_ENV` | Auto | Vercel | Auto-set by platform |

### Local Development Setup
```bash
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY
npm run dev
```

---

## GitHub Actions Workflows

### ci.yml (triggers: push to any branch, PR to main)
```
jobs:
  validate:
    - Checkout
    - Setup Node 20
    - npm ci
    - npm run lint       (ESLint)
    - npm run typecheck  (tsc --noEmit)
    - npm test           (Jest)
    - npm run build      (verify build succeeds)
```

### weekly-refresh.yml (triggers: cron 0 9 * * 1 — every Monday 9am UTC)
```
jobs:
  maintenance:
    - Checkout
    - Setup Node 20
    - npm ci
    - npm test
    - npm audit --audit-level=high
    - Post results to GitHub Actions summary
```

---

## Deployment

- **Platform:** Vercel (free tier sufficient for v0–v1)
- **Branch strategy:** `main` → production auto-deploy; feature branches → preview deployments
- **Domain:** Vercel-provided (`*.vercel.app`) for v0–v1; custom domain at v2
- **Rollback:** Vercel instant rollback via dashboard or CLI

---

## Directory Structure (complete)

```
/Users/iainmurphy/Code/S&C Model/
├── CLAUDE.md
├── .env.example                ← Committed (placeholder values only)
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.js
│
├── /src
│   ├── /app
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── /api
│   │       └── /generate
│   │           └── route.ts
│   ├── /components
│   │   ├── AthleteForm.tsx
│   │   ├── ProgramDisplay.tsx
│   │   ├── SportSelector.tsx
│   │   ├── PositionSelector.tsx
│   │   ├── MaxesInput.tsx
│   │   └── LoadingState.tsx
│   └── /lib
│       ├── systemPrompt.ts
│       ├── types.ts
│       ├── validation.ts
│       └── sportsConfig.ts
│
├── /config
│   └── sports.ts
│
├── /docs
│   ├── PRD.md
│   ├── ARD.md
│   └── research.md
│
├── /tests
│   ├── /unit
│   │   ├── validation.test.ts
│   │   ├── systemPrompt.test.ts
│   │   └── sportsConfig.test.ts
│   └── /integration
│       ├── generate.test.ts
│       └── scenarios.test.ts
│
└── /.github
    └── /workflows
        ├── ci.yml
        └── weekly-refresh.yml
```

---

## Open Technical Decisions

1. **PDF export (v2):** `@react-pdf/renderer` or browser print-to-PDF. Defer to v2.
2. **Program history (v2):** Supabase for persistence; local storage as v1 fallback if needed.
3. **Authentication (v2):** Clerk (easiest Next.js integration) or NextAuth. Not required for v1 single-coach use.
4. **Test infrastructure for evaluation scenarios:** The 10 PRD scenarios run as structural checks (output contains required sections, no forbidden patterns by sport) — not semantic evaluation. Semantic quality review is human (coach) only.
