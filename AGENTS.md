# AGENTS.md
This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands
- Install deps: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Prod server: `npm run start`
- Tests: no test script configured yet (no single-test command available)

## Project rules (from `WARP.md`)
- Vizon is a **career diagnostic engine** (not a quiz, content platform, or AI coach).
- Diagnose before advising; deterministic logic over AI judgment.
- Skills are first-class entities; questions are data, not logic.
- Diagnostic logic lives in the engine layer; UI contains no business logic.
- AI may generate explanations only; AI must NOT decide scores, levels, or branching.

## Architecture overview (big picture)
- **Engine layer (`engine/`)**: core diagnostic flow and evidence handling.
  - `engine/diagnosticSession.ts` defines the canonical, career-agnostic session model (SkillId is an opaque string).
  - `engine/initializeSession.ts` creates a starting session (no skill/question selection).
  - `engine/recordAnswer.ts` logs answers and raw signals only (no scoring or aggregation).
  - `engine/selectNextProbe.ts` deterministically selects the next **skill** based on evidence sufficiency in the track config.
  - `engine/branching.ts` and `engine/scoring.ts` are placeholders from scaffolding; they use `lib/types` and should be treated as legacy until unified.
- **Configuration (`config/`)**: declarative career-track inputs.
  - `config/tracks/consulting.ts` defines skills and required evidence using universal signal categories; no logic.
- **Questions (`data/`)**: pure question data only (currently placeholder).
- **UI (`components/`, `app/`)**: presentation only; no diagnostic logic.

## Key separations to preserve
- Engine consumes **config and data**; it should not hardcode career-specific assumptions.
- Questions must remain declarative; branching/scoring logic belongs in `engine/`.
