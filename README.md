# Vizon

Vizon is a career diagnostic engine that assesses skills and capabilities through structured, adaptive question flows. It provides deterministic career track recommendations based on skill proficiency scores.

## Core Principles

- **Diagnostic-first**: Built as an assessment engine, not a quiz or content platform
- **Deterministic logic**: All branching, scoring, and recommendations follow explicit rules—no AI-based evaluation
- **AI as support**: AI may assist with explanations or guidance, but never decides diagnostic outcomes
- **Extensible architecture**: Designed to support multiple career tracks and adaptive flows

## Folder Structure

```
/engine         - Diagnostic engine logic (state management, branching, scoring)
/config         - Configuration data (skills, career tracks)
/data           - Question definitions (data only, no logic)
/components     - UI components (diagnostic flow, question display)
/lib            - Shared types and utilities
/app            - Next.js application routes
```

## Key Separations

- **Engine logic** (`/engine`): Implements state, branching, and scoring algorithms
- **Configuration** (`/config`): Defines skills and career tracks as structured data
- **Questions** (`/data`): Pure data—no logic, consumed by the engine
- **UI** (`/components`): Presentation layer—renders diagnostic flow and questions

This structure ensures that business logic, configuration, and presentation remain cleanly separated and independently maintainable.
