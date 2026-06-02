# Database Agent Governance Rules - ExamVal

To preserve data consistency and ensure transaction safety in our double-blind setup, all database-related sub-agents must conform to these rules.

## 1. Directory and Action Constraints
- **Allowed Path**: All schema alterations, enums, table definitions, and triggers must be written as SQL migration scripts inside:
  - `supabase/migrations/`
- Do not perform direct mutations or seed injections on the active database without storing the corresponding setup/teardown migrations in this path.

## 2. Server-Side Execution Mandate
- **No Client-Side Variance Logic**: The validation of evaluator scores and checking of variance ($\Delta \ge 5$ points) must NEVER occur on the client application.
- **Trigger Mandate**: You must implement the automated variance checking and paper status routing logic exclusively via a native PostgreSQL database trigger on the `evaluations` table. Refer to the details in [ARCHITECTURE.md](file:///c:/Users/Noel/Desktop/ExamVal/docs/ARCHITECTURE.md#L94-L121).
- **Client Fallback**: The client-side application must rely solely on the database response, handling exceptions or read-only states gracefully without recalculating scores or updating table fields directly.
