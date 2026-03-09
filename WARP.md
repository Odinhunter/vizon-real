# Vizon – Warp Rules

Vizon is a **career diagnostic engine**.
It is NOT a quiz, content platform, learning app, or AI coach.

## Core Rules
- Diagnose before advising
- Deterministic logic over AI judgment
- Decisions and patterns over "correct answers"
- Skills are first-class entities
- Questions are data, not logic

## Architecture
- Diagnostic logic lives in an engine layer
- Skills and capability levels are configuration-driven
- Questions must be declarative (no logic)
- UI components contain no business logic
- Routes orchestrate flow only

## AI Usage
- AI may generate explanations only
- AI must NOT decide scores, levels, or branching

## Constraints
- Do not invent questions or scoring rules unless instructed
- Do not hardcode career-specific assumptions
- Preserve extensibility and separation of concerns
