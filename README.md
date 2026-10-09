# Vizon

**A diagnostic for consulting and finance candidates: find out whether you're ready before the interview does.**

Live at [getvizon.com](https://getvizon.com). Built solo by Ishan Kabra, 2026.

Most case-prep tools hand you more practice. Vizon measures where you actually stand. A
candidate works through a ~40-minute track of three progressively harder cases, answering
in their own words. Vizon returns:

- an overall readiness score and verdict, benchmarked against hiring thresholds
- a capability map across the track's five skills
- a candidate archetype and per-answer feedback grounded in the scoring rubric
- how performance holds up as the cases get harder

| Track | Skills tested | Status |
|---|---|---|
| Management Consulting | problem structuring, hypothesis thinking, analytical reasoning, communication, decision-making | live |
| Finance & Investment | signal interpretation, thesis formation, capital allocation, risk assessment, investment clarity | live |
| Data Analytics | — | waitlist |

## How it works

The design rule is **AI reads, the engine decides.**

1. **Questions are data.** Cases, probes and skills live in `content/` and `config/` as
   declarative definitions. No logic.
2. **An LLM reads each free-text answer** against the probe's rubric and returns a
   structured, schema-validated set of signals: signal strength, response quality and
   behavioural observations (`lib/ai/`). Invalid output is retried once, then rejected.
3. **A deterministic engine does everything else** (`engine/`): records evidence, selects
   the next probe by evidence sufficiency, aggregates scores and produces the result.
   Same signals in, same outcome out; the model never picks a branch or a level.
4. **Feedback is written last**, from the rubric and the scored evidence, so the
   explanation can't drift from the score.

## Stack

Next.js (App Router) · TypeScript · Prisma with Turso (libSQL) · Auth.js (Google and
email/password) · OpenAI GPT-4o at temperature 0 by default, Anthropic supported ·
Recharts and Framer Motion · Vercel.

Production hardening that went in: per-route rate limiting, IDOR and open-redirect fixes,
security headers and CSP, optimistic locking on session writes, and server-side error
handling that always returns JSON.

## Layout

```
app/          routes: landing, diagnostic, results, profile, admin, API
engine/       session state, probe selection, scoring, result analysis
config/       tracks, skills, probes, cases (declarative)
content/      case material per track
lib/ai/       model client, extraction prompts, output schemas, feedback
components/   UI only: diagnostic flow, results, charts, landing
prisma/       database schema
```

## Running locally

```bash
npm install
npm run db:push
npm run dev
```

Set in `.env`: `DATABASE_URL` (a local SQLite file works, e.g. `file:./dev.db`),
`OPENAI_API_KEY` (or `ANTHROPIC_API_KEY`) and `AUTH_SECRET`. Optional:
`GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` for Google sign-in, `TURSO_DATABASE_URL` /
`TURSO_AUTH_TOKEN` for the hosted database, `ADMIN_EMAILS` for the results dashboard.
