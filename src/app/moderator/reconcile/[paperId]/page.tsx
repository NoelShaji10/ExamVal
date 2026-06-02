import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Moderator Reconciliation | ExamVal',
  description: 'Reconcile evaluator grading discrepancies.',
};

interface PageProps {
  params: {
    paperId: string;
  };
}

export default function ReconcilePage({ params }: PageProps) {
  const { paperId } = params;

  return (
    <div id="reconciliation-workspace-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-xl font-bold tracking-tight text-indigo-400">ExamVal</span>
          <span className="text-slate-500">/</span>
          <span className="text-sm font-medium text-slate-400">Moderator Reconciliation</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-xs text-slate-400 font-mono">Paper ID: {paperId}</p>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
              Role: Moderator
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex justify-between items-end border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Conflict Reconciliation Matrix</h1>
            <p className="text-sm text-slate-400">Evaluate scoring variances per question and define the final score.</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-red-400 bg-red-950/40 border border-red-900/30 px-3 py-1.5 rounded-md font-mono">
              Evaluator Discrepancy Flagged (&ge; 5 points)
            </span>
          </div>
        </div>

        {/* Matrix Comparison Table */}
        <section id="reconciliation-matrix-section" className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Question Component</th>
                  <th className="px-6 py-3">Evaluator 1 (E1)</th>
                  <th className="px-6 py-3">Evaluator 2 (E2)</th>
                  <th className="px-6 py-3">Variance</th>
                  <th className="px-6 py-3">Reconciled Mark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-850/50">
                  <td className="px-6 py-4 font-semibold text-slate-100">Q1 - Essay Proof</td>
                  <td className="px-6 py-4">
                    <p className="font-mono">8.0 / 10.0</p>
                    <p className="text-xs text-slate-400 italic">"Strong introduction and solid flow."</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-mono">9.5 / 10.0</p>
                    <p className="text-xs text-slate-400 italic">"Excellent thesis explanation."</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-400">1.50</td>
                  <td className="px-6 py-4">
                    <input 
                      type="number" 
                      placeholder="Assign Final"
                      className="bg-slate-950 border border-slate-850 rounded px-2 py-1 w-32 font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </td>
                </tr>
                <tr className="hover:bg-slate-850/50">
                  <td className="px-6 py-4 font-semibold text-slate-100">Q2 - Calculation</td>
                  <td className="px-6 py-4">
                    <p className="font-mono">2.0 / 10.0</p>
                    <p className="text-xs text-slate-400 italic">"Formula incorrect from step 2."</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-mono">7.5 / 10.0</p>
                    <p className="text-xs text-slate-400 italic">"Minor error, followed correct steps."</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-red-400 font-bold">5.50</td>
                  <td className="px-6 py-4">
                    <input 
                      type="number" 
                      placeholder="Assign Final"
                      className="bg-slate-950 border border-slate-850 rounded px-2 py-1 w-32 font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Audit Log / Submission Block */}
        <section id="moderator-justification-section" className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">Moderation Justification</h3>
          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase tracking-wider">Adjustment Audit Reason</label>
            <textarea 
              rows={4}
              placeholder="State rationale for overriding evaluator grades (required for submission)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-600"
            />
          </div>
          <div className="flex justify-end pt-2">
            <button 
              id="submit-reconciliation-btn"
              disabled 
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg opacity-50 cursor-not-allowed transition duration-200"
            >
              Submit Override & Finalize Paper (Locked)
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
