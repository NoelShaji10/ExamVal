# Moderator Dashboard Agent Governance Rules - ExamVal

For sub-agents assigned to Moderator workflows, you must adhere to these interface and operational rules.

## 1. Directory and Action Constraints
- **Designated Workspace Path**: You are restricted to modifying and adding files under:
  - `src/features/dashboards/`
- Navigation wrapper changes should be located inside `src/app/moderator/`.

## 2. Interface Presentation Rules
- **Side-by-Side Comparison Layout**: The reconciliation table/matrix must offer a clear grid view aligning Evaluator 1's entries, Evaluator 2's entries, and their respective variances row-by-row for each blueprint question.
- **Disparity Highlighting**: The interface must visually highlight rows showing high-variance scores (e.g., individual item score difference $\ge 1.5$ points, or paper total variance $\ge 5$ points) in distinct warm/alert colors to accelerate moderator resolution.
- **Audit Requirement**: The reconciliation form must validate that a moderator audit note is inputted prior to allowing the final reconciliation submission.
