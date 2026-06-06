'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useFetchPapers } from '../../../features/operations/useFetchPapers';
import { useAppStore } from '../../../store/useAppStore';

export default function ModeratorDashboardPage() {
  const router = useRouter();
  const { role } = useAppStore();

  useEffect(() => {
    if (role === 'Evaluator') {
      router.replace('/');
    }
  }, [role, router]);

  const { papers, loading, error } = useFetchPapers();

  if (role === 'Evaluator') {
    return null;
  }

  // Metrics calculation
  const needsReconciliationCount = papers.filter((p) => p.status === 'Needs_Reconciliation').length;
  const awaitingCount = papers.filter((p) => p.status === 'Pending_E1_E2').length;
  const completedCount = papers.filter((p) => p.status === 'Completed').length;

  // Filter papers for triage queue
  const triagePapers = papers.filter((p) => p.status === 'Needs_Reconciliation');

  function formatPaperDate(dateStr?: string) {
    if (!dateStr) return 'Oct 25, 2024';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'Oct 25, 2024';
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Oct 25, 2024';
    }
  }

  return (
    <div id="moderator-dashboard-root" className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col font-sans">
      <Navbar currentPaperId={null} />

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-10 space-y-8 bg-slate-50/50">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-650 text-sm">
            Error loading papers: {error}
          </div>
        )}

        <div className="flex justify-between items-center shrink-0">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Moderator Triage Dashboard
          </h1>
        </div>

          {/* Metric Cards Grid */}
          <section id="metrics-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Needs Reconciliation */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center space-x-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </div>
              <div>
                <h3 className="text-xs text-slate-400 font-bold uppercase tracking-wider">Needs Reconciliation</h3>
                <p className="text-2xl font-bold text-slate-900 mt-1 select-none">
                  {loading ? '...' : needsReconciliationCount}
                </p>
              </div>
            </div>

            {/* Awaiting E1/E2 Grades */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center space-x-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xs text-slate-400 font-bold uppercase tracking-wider">Awaiting Grades</h3>
                <p className="text-2xl font-bold text-slate-900 mt-1 select-none">
                  {loading ? '...' : awaitingCount}
                </p>
              </div>
            </div>

            {/* Completed Evaluations */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center space-x-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xs text-slate-400 font-bold uppercase tracking-wider">Completed</h3>
                <p className="text-2xl font-bold text-slate-900 mt-1 select-none">
                  {loading ? '...' : completedCount}
                </p>
              </div>
            </div>
          </section>

          {/* Triage Queue Table Section */}
          <section id="triage-queue-section" className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Discrepancy Triage Queue</h2>
              </div>
              <span className="text-[10px] tracking-wider uppercase text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-lg font-bold">
                Variance Trigger: &ge; 5 POINTS
              </span>
            </div>

            <div className="p-6 bg-white">
              {loading ? (
                <div className="space-y-4 py-8">
                  <div className="h-6 bg-slate-100 rounded w-1/4 animate-pulse" />
                  <div className="h-10 bg-slate-100 rounded animate-pulse" />
                  <div className="h-10 bg-slate-100 rounded animate-pulse" />
                </div>
              ) : triagePapers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-700">
                    <thead className="bg-slate-50/70 text-slate-400 text-[10px] uppercase tracking-wider font-bold">
                      <tr className="border-b border-slate-200/60">
                        <th className="px-4 py-3">Anonymous ID</th>
                        <th className="px-4 py-3">Blueprint</th>
                        <th className="px-4 py-3">Submission Date</th>
                        <th className="px-4 py-3 text-center">E1 Score</th>
                        <th className="px-4 py-3 text-center">E2 Score</th>
                        <th className="px-4 py-3 text-center">Variance</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {triagePapers.map((paper) => {
                        const e1Score = paper.evaluations[0]?.total_score ?? 0;
                        const e2Score = paper.evaluations[1]?.total_score ?? 0;
                        const variance = Math.abs(e1Score - e2Score);

                        // Variance pill color selection: soft red for >= 15, soft amber for < 15
                        const variancePillClass = variance >= 15
                          ? "bg-red-50 text-red-600 font-semibold border border-red-100/50 rounded-md px-2 py-0.5 text-xs inline-block"
                          : "bg-amber-50 text-amber-600 font-semibold border border-amber-100/50 rounded-md px-2 py-0.5 text-xs inline-block";

                        return (
                          <tr key={paper.id} className="hover:bg-slate-50/40 transition duration-150">
                            <td className="px-4 py-4.5 font-mono text-xs text-slate-700 select-all">{paper.student_anonymous_id}</td>
                            <td className="px-4 py-4.5 font-medium text-slate-800 text-xs">{paper.exam_blueprints?.name || 'Class XII Mathematics Mid-Term'}</td>
                            <td className="px-4 py-4.5 text-xs text-slate-500">{formatPaperDate(paper.created_at)}</td>
                            <td className="px-4 py-4.5 text-center font-mono text-xs text-slate-600">{e1Score.toFixed(2)}</td>
                            <td className="px-4 py-4.5 text-center font-mono text-xs text-slate-600">{e2Score.toFixed(2)}</td>
                            <td className="px-4 py-4.5 text-center">
                              <span className={variancePillClass}>
                                {variance.toFixed(2)}
                              </span>
                            </td>
                            <td className="px-4 py-4.5 text-right">
                              <Link
                                href={`/moderator/reconcile/${paper.id}`}
                                className="px-4 py-1.5 bg-[#007BFF] hover:bg-[#0056b3] text-white text-xs font-semibold rounded-lg transition-all shadow-sm cursor-pointer inline-block"
                              >
                                Reconcile
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Pagination Section Mock */}
                  <div className="flex items-center justify-end space-x-2 mt-6 pt-4 border-t border-slate-100 select-none">
                    <button className="h-7 w-7 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer text-xs font-mono">
                      &laquo;
                    </button>
                    <button className="h-7 w-7 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer text-xs font-mono">
                      &lsaquo;
                    </button>
                    <button className="h-7 w-7 rounded border border-blue-200 bg-blue-50/40 flex items-center justify-center text-blue-600 cursor-pointer text-xs font-semibold font-mono">
                      1
                    </button>
                    <button className="h-7 w-7 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer text-xs font-mono">
                      &rsaquo;
                    </button>
                    <button className="h-7 w-7 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer text-xs font-mono">
                      &raquo;
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/20">
                  <svg className="mx-auto h-12 w-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-bold select-none text-slate-500">No papers in triage queue.</p>
                  <p className="text-xs text-slate-400 mt-1 select-none">All evaluations are currently within acceptable variance.</p>
                </div>
              )}
            </div>
           </section>
      </main>
    </div>
  );
}
