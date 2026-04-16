# S&C Programming Agent — Product Requirements Document

**Version:** 1.0 | **Date:** 2026-04-16 | **Status:** Active

---

## One-Sentence Description

A web-based AI agent that generates periodized, sport-specific strength and conditioning programs for college athletes from a coach's natural-language outcome description and athlete performance data.

---

## Users, Job, Replacement

**Users:** Strength and conditioning coaches at the college level (D-I, D-II, NAIA). Initially 1–3 coaches (the builder + direct collaborators).

**Job it does:** Accepts a coach's description of what they want for an athlete, plus key athlete context (sport, position, height, weight, training maxes, season phase), and returns a complete, periodized training program with transparent reasoning the coach can review, challenge, and deploy.

**What it replaces:**
- Manual program construction from scratch for each athlete
- Generic template platforms (TeamBuildr, Bridge, Volt) that cannot handle complex constraint sets
- Using general-purpose LLMs (ChatGPT, Claude.ai) without S&C-specific guardrails or structured output

**Explicit non-goals:**
- Nutrition programming (outside scope — refer to registered dietitian)
- Rehabilitation past the return-to-play handoff point
- Mental performance coaching
- Real-time wearable or monitoring data integration (v1)
- Athlete-facing UI (coaches only)
- Injury diagnosis or medical recommendations
- Automated week-to-week progression tracking (v1)
- Automated 1RM calculation from entered submaximal data (v1)

---

## Core Capabilities

### Intake

**Minimum viable (required fields):**

| Field | Input Type | Notes |
|-------|-----------|-------|
| Outcome description | Free text | "I need him stronger off the line by fall camp" |
| Sport | Dropdown | All major college sports |
| Position | Dropdown | Conditional on sport |
| Height | ft + in | For anthropometric context |
| Body weight | lbs | For relative strength calculations |
| Season phase | Select | Off-season / Pre-season / In-season / Post-season |
| Training days available per week | Number (1–7) | In the weight room only |

**Ideal fields (full context, optional):**

| Field | Input Type | Notes |
|-------|-----------|-------|
| Training age | Select | Novice / Intermediate / Advanced |
| Back squat 1RM | lbs or "untested" | |
| Deadlift 1RM | lbs or "untested" | |
| Bench press 1RM | lbs or "untested" | |
| Power clean 1RM | lbs or "untested" | |
| Vertical jump | inches or "untested" | |
| 10-yard dash | seconds or "untested" | |
| Injury history | Free text | Current limitations + history |
| Practice schedule notes | Free text | Games/week, practice intensity, travel |
| Equipment constraints | Free text | Missing or limited equipment |

### Output

Every generated program includes:

1. **Program Summary** — Periodization model selected, rationale, program duration, key training emphasis
2. **Mesocycle Map** — Phase breakdown by week (e.g., "Weeks 1–3: Accumulation — Weeks 4–6: Intensification — Week 7: Deload")
3. **Weekly Template** — Day-by-day session structure with movement categories and load targets
4. **Exercise Detail** — For each session: exercise name, sets × reps × intensity (% 1RM or RPE range), rest period, coaching notes
5. **Reasoning Block** — Why this periodization model fits this athlete; why these exercises for this sport/position; what the program targets in each phase
6. **Red Flags / Caveats** — Explicit callouts where injury history, sport demands, or season phase constrains selection; any situations requiring sports medicine consultation

### Reasoning Transparency

Every program must explain:
- Why the selected periodization model fits this athlete's context
- Any exercise substitutions made for safety or sport-specificity reasons
- What additional information would improve the recommendation
- Where the agent is uncertain — surfaced explicitly rather than smoothed over

### Iteration

- Coach can modify any input field and regenerate a new program
- Notes field accepts coach pushback in natural language: "The athlete can't squat — modify accordingly" or "They only have a rack and dumbbells"
- v1: regeneration replaces current program; v2: side-by-side comparison with previous version

---

## Knowledge Architecture

**What gets baked into the system prompt (static):**
- Core periodization models and selection logic (LP, block, DUP, conjugate, reactive/agile)
- Sport-specific demand profiles for all major college sports
- Position-specific programming differentiation
- In-season vs. off-season programming constraints
- Individualization variables (training age, injury history, testing data interpretation)
- Safety guardrails and sport-specific red flags
- Common programming mistakes the agent actively avoids
- Output format requirements (structured sections, no false precision)

**What gets computed at request time:**
- Relative strength benchmarks from entered bodyweight + maxes
- Load prescriptions as ranges (e.g., "70–80% 1RM") from entered maxes
- Volume tolerances based on season phase, sport, and training days available

**How it stays current:**
- GitHub Actions weekly workflow runs the test suite and flags drift
- Knowledge base file (`systemPrompt.ts`) is version-controlled; updates require commit + review + deploy
- Weekly cron job is a forcing function for review; does not auto-edit the prompt

---

## Safety and Guardrails

**Must defer to human coach + sports medicine:**
- Any return-to-play decision — agent provides context but explicitly states it cannot generate an RTP protocol without sports medicine assessment criteria
- Medical clearance decisions
- Acute injury management

**Injury boundary behavior:**
- Injury history in intake affects exercise selection with explicit visible flags
- Any program generated with significant injury context includes a mandatory sports medicine review notice
- The agent never adjusts a program based on injury history silently — changes are always explained

**Low-confidence handling:**
- Agent surfaces uncertainty rather than fabricating: "I don't have enough information about X to be confident — here's what I would need to know"
- Unusual sport/position/constraint combinations produce appropriately hedged outputs with explicit caveats

**False precision prevention:**
- Load prescriptions given as ranges ("70–80% 1RM"), never spurious specifics ("67.5%")
- Rest periods given as ranges ("90–120 seconds"), not spurious precision
- Velocity targets, if mentioned, described directionally

---

## Evaluation

**Pass criterion:** A qualified S&C coach would use the generated program with minor modifications or less.

**Required test cases before v1 launch:**

| ID | Scenario | Must pass |
|----|----------|-----------|
| T01 | D-I football OL, off-season, advanced training age | Bilateral strength emphasis, hypertrophy phase, no excessive single-leg volume, neck training included |
| T02 | D-I volleyball MB, in-season Week 6 of conference | Conservative jump load, patellar tendinopathy red flag surfaced, strength maintenance protocol |
| T03 | D-I baseball starting pitcher, in-season | No heavy bilateral overhead pressing, shoulder health protocol, cumulative throw-load caveat |
| T04 | D-I women's soccer defender, pre-season | Nordic curl integration, posterior chain emphasis, ACL prevention rationale |
| T05 | D-III distance runner, off-season | Heavy compound emphasis, minimal hypertrophy, running economy rationale, concurrent interference acknowledged |
| T06 | D-I wrestler, in-season, cutting weight | Dehydration caveat, reduced intensity during cut week, weight class acknowledgment |
| T07 | D-I basketball PG, in-season 35-game season | 1–2x/week maintenance, minimum effective dose reasoning, no accumulation-phase volume |
| T08 | D-I women's gymnastics, mid-season | RED-S flag surfaced, no body composition targets, relative strength framing |
| T09 | Athlete with explicit ACL history, pre-season | Sports medicine defer, criteria-based RTP note, appropriate loading progression |
| T10 | True freshman football, first off-season | Conservative volume, movement quality emphasis, not advanced programming vocabulary or loading |

**How to evaluate:** Coach reviews each output. PASS = would use with ≤ minor modifications. FAIL = would not use, or output contains a safety error.

---

## Build Plan

**v0 (proof of concept):**
- Form with minimum viable fields → Claude API → raw program text output
- No structured display, no streaming
- Validates the knowledge base + prompt approach

**v1 (usable by coach — current target):**
- Full intake form (minimum viable + optional ideal fields)
- Structured program output with all sections
- Streaming response (UX for long generation time)
- Red flags surfaced explicitly in the UI
- Reasoning block visible and distinct from the program
- All 10 evaluation test cases reviewed and passing
- GitHub repo with CI/CD
- Deployed to Vercel

**v2 (usable by other coaches):**
- Program history (Supabase or local storage)
- Export to PDF
- Side-by-side comparison of regenerations
- Multiple athlete profiles per coach
- Optional authentication (Clerk or NextAuth)
- Potentially: intake via file upload (existing athlete profile export from TeamBuildr, etc.)

---

## Open Questions

1. **Rare sport coverage:** How should the agent handle sport/position combinations with very limited research (acrobatics, esports)? → Conservative: surface uncertainty, apply closest analogous sport with explicit caveat.

2. **Generate then flag vs. clarify first:** Should the agent ask clarifying questions before generating, or generate and flag gaps? → Generate with explicit gap flags. Faster UX; coach can provide more context after seeing initial output.

3. **Knowledge base verification:** Who verifies weekly knowledge base updates for accuracy before deploy? → Initially the coach (user). A formal review process is needed before v2 with external coaches.

4. **API unavailability fallback:** What happens if the Claude API is unavailable? → Static error message; no fallback generation; no degraded output.

5. **Cost management:** How to prevent abuse of the API in v2 (when other coaches use it)? → Rate limiting + authentication + usage caps. Not a v1 concern.
