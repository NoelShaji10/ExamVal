# ExamVal

ExamVal is a premium, enterprise-grade digital evaluation and moderation platform designed for double-grading exam answer papers. Featuring a sleek **Fintech / B2B SaaS Minimalist** design language, the system helps educational institutions and standardizing bodies verify grade consistency, flag anomalies, and reconcile evaluation discrepancies cleanly.

---

## 🌟 Key Features

### 1. Evaluator Workflow
- **Dashboard Queue**: Structured tabs for Standard Grading, Moderation, and Completed queues.
- **Search & Filter**: Real-time fuzzy search (by Paper ID or Student Anonymous ID) and chronological sorting dropdown (Newest/Oldest).
- **Grading Canvas**: Rich dual-pane interface showing the digitized student answer booklet (PDF view) alongside the step-by-step marking rubrics.

### 2. Moderator Workflow
- **Discrepancy Triage**: Automatic discrepancy detection that flags double-graded booklets where the score variance between Evaluator 1 (E1) and Evaluator 2 (E2) is $\ge 5$ points.
- **Split-Screen Reconciliation**: High-performance, side-by-side reconciliation interface containing:
  - Left pane: The evaluated booklet PDF.
  - Right pane: Side-by-side questions list with Evaluators' scores and justification comments highlighted in amber/warning states for discrepancies.
  - Final score overrides: Direct item-by-item input fields for the moderator to lock the standard settled grade.

---

## 🛠️ Technology Stack
- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Core Engine**: React, TypeScript
- **Styling**: Vanilla CSS with Tailwind CSS utilities
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Hydration**: Custom Supabase Operations Hooks

---

## 🚀 Getting Started

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18.x or later) and npm installed.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/NoelShaji10/ExamVal.git
   cd ExamVal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables by copying `.env.example` (or configure your Supabase instance credentials in `.env.local`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Running the Development Server
Launch the local Turbopack-powered development environment:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production
Create an optimized, type-checked production bundle:
```bash
npm run build
```

To run the built bundle locally:
```bash
npm run start
```

---

## 📂 Project Structure
```
ExamVal/
├── src/
│   ├── app/                 # Next.js App Router (Layouts and Page Routing)
│   │   ├── components/      # Global Layout and Nav components
│   │   ├── evaluate/        # Evaluator marking workspace route
│   │   ├── moderator/       # Moderator dashboard & conflict reconciliation route
│   │   └── page.tsx         # HomePage entry / Evaluator Queue router
│   ├── features/            # Feature-sliced modules
│   │   ├── dashboards/      # Queue and Reconciliation Matrices
│   │   ├── evaluation/      # PDF panel and evaluation workspaces
│   │   └── operations/      # Supabase operations and fetch hooks
│   ├── lib/                 # Utility libraries and API client configs
│   └── store/               # Global Zustand state hooks (useAppStore)
```
