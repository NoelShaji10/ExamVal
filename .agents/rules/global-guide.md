# Global Agent Governance Rules - ExamVal

Welcome, Antigravity Sub-Agent. To ensure strict structural integrity and prevent merge conflicts across our concurrent vibe-coding workflows, you must adhere to the following global regulations.

## 1. Context Ingestion Mandate
Before writing, refactoring, or planning any code changes:
- You **MUST** read and fully ingest:
  - [PRD](file:///c:/Users/Noel/Desktop/ExamVal/docs/PRD.md)
  - [Architecture Document](file:///c:/Users/Noel/Desktop/ExamVal/docs/ARCHITECTURE.md)
- Verify your local tasks align with these files.

## 2. Directory Isolation Boundary
To prevent overlapping changes that lead to Git merge conflicts:
- You are **strictly prohibited** from modifying files outside of your designated feature directory in `src/features/` unless explicitly allowed by a specific override rule (e.g., configuring routes in `src/app/` or database schemas).
- Focus only on components, hooks, and sub-routing models within your allocated boundaries.

## 3. Technology Stack & Coding Standards
- **Styling**: Tailwind CSS combined with shadcn/ui. Maintain a premium "institutional" visual identity (sleek dark/light theme, modern typography, glassmorphism, clean layouts, and zero-latency micro-interactions). Avoid plain/generic colors.
- **State Management**: All cross-component global state, session states, and active workflow context routing must reside exclusively in the central Zustand store at `src/store/useAppStore.ts`. Do not initialize local-first contexts for values that should be shared.
- **TypeScript**: Strict type definitions only. Avoid using `any` type overrides.
