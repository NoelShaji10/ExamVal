# Evaluation Workspace Agent Governance Rules - ExamVal

For sub-agents assigned to the Evaluator split-screen environment, you must adhere to these structural constraints.

## 1. Directory and Action Constraints
- **Designated Workspace Path**: You are restricted to modifying and adding files under:
  - `src/features/evaluation/`
- Any shared layout integrations should be coordinated via page-level wrappers under `src/app/evaluate/`.

## 2. Grading Form Rules
- **Dynamic Form Generation**: The grading form inputs must be built dynamically by parsing the structure schema provided in `exam_blueprints`. Do not hardcode specific question identifiers.
- **Maximum Bound Validation**: Form fields must enforce client-side constraints where entered scores cannot exceed the maximum score specified in the blueprint structure.
- **Strict Submission Locks**: The "Submit Grading" button must be disabled/locked until:
  - All questions contain valid, within-bounds numerical scores.
  - All mandatory evaluator feedback notes are completed.
- **Post-Submission Read-Only State**: Once a grading has been submitted, the workspace form must lock completely, rendering all fields read-only and preventing subsequent edits.
