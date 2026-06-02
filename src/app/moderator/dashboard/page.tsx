import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Moderator Dashboard | ExamVal',
  description: 'Triage queue for conflicting evaluations.',
};

export default function ModeratorDashboardPage() {
  return (
    <div id="moderator-dashboard-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-xl font-bold tracking-tight text-indigo-400">ExamVal</span>
          <span className="text-slate-500">/</span>
          <span className="text-sm font-medium text-slate-400">Moderator Dashboard</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
            Role: Moderator
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Metric Cards Grid */}
        <section id="metrics-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2">
            <h3 className="text-sm text-slate-400">Needs Reconciliation</h3>
            <p className="text-3xl font-extrabold text-amber-500">12</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2">
            <h3 className="text-sm text-slate-400">Awaiting E1/E2 Grades</h3>
            <p className="text-3xl font-extrabold text-blue-500">45</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2">
            <h3 className="text-sm text-slate-400">Completed Evaluations</h3>
            <p className="text-3xl font-extrabold text-emerald-500">128</p>
          </div>
        </section>

        {/* Triage Queue Table Section */}
        <section id="triage-queue-section" className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-100">Discrepancy Triage Queue</h2>
            <span className="text-xs text-amber-400 font-medium">Variance Trigger Threshold: &ge; 5 Points</span>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Anonymous ID</th>
                    <th className="px-4 py-3">Blueprint</th>
                    <th className="px-4 py-3">E1 Score</th>
                    <th className="px-4 py-3">E2 Score</th>
                    <th className="px-4 py-3 text-amber-400">Variance</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr className="hover:bg-slate-850/50">
                    <td className="px-4 py-4 font-mono font-medium">STUDENT-X8A-98C</td>
                    <td className="px-4 py-4">Math Final Term</td>
                    <td className="px-4 py-4">72.00</td>
                    <td className="px-4 py-4">79.00</td>
                    <td className="px-4 py-4 text-amber-500 font-bold font-mono">7.00</td>
                    <td className="px-4 py-4 text-right">
                      <button className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold rounded-md transition">
                        Reconcile
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-850/50">
                    <td className="px-4 py-4 font-mono font-medium">STUDENT-F7B-43F</td>
                    <td className="px-4 py-4">Physics Quiz 2</td>
                    <td className="px-4 py-4">15.50</td>
                    <td className="px-4 py-4">21.00</td>
                    <td className="px-4 py-4 text-amber-500 font-bold font-mono">5.50</td>
                    <td className="px-4 py-4 text-right">
                      <button className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold rounded-md transition">
                        Reconcile
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
