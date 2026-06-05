'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { useFetchPapers } from '../../../features/operations/useFetchPapers';

export default function ModeratorDashboardPage() {
  const { papers, loading, error } = useFetchPapers();

  // Metrics calculation
  const needsReconciliationCount = papers.filter((p) => p.status === 'Needs_Reconciliation').length;
  const awaitingCount = papers.filter((p) => p.status === 'Pending_E1_E2').length;
  const completedCount = papers.filter((p) => p.status === 'Completed').length;

  // Filter papers for triage queue
  const triagePapers = papers.filter((p) => p.status === 'Needs_Reconciliation');

  return (
    <div id="moderator-dashboard-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar currentPaperId={null} />

      {/* Main Content Area */}
      <main className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
        {error && (
          <div className="p-4 bg-rose-950/20 border border-rose-900/50 rounded-xl text-rose-400 text-sm">
            Error loading papers: {error}
          </div>
        )}

        {/* Metric Cards Grid */}
        <section id="metrics-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2 relative overflow-hidden group hover:border-amber-500/30 transition duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl -mr-5 -mt-5" />
            <h3 className="text-sm text-slate-400 font-semibold tracking-wide">Needs Reconciliation</h3>
            <p className="text-4xl font-black text-amber-500 tracking-tight">
              {loading ? <span className="inline-block w-8 h-8 bg-slate-800 rounded animate-pulse" /> : needsReconciliationCount}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2 relative overflow-hidden group hover:border-blue-500/30 transition duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-5 -mt-5" />
            <h3 className="text-sm text-slate-400 font-semibold tracking-wide">Awaiting E1/E2 Grades</h3>
            <p className="text-4xl font-black text-blue-500 tracking-tight">
              {loading ? <span className="inline-block w-8 h-8 bg-slate-800 rounded animate-pulse" /> : awaitingCount}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2 relative overflow-hidden group hover:border-emerald-500/30 transition duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-5 -mt-5" />
            <h3 className="text-sm text-slate-400 font-semibold tracking-wide">Completed Evaluations</h3>
            <p className="text-4xl font-black text-emerald-500 tracking-tight">
              {loading ? <span className="inline-block w-8 h-8 bg-slate-800 rounded animate-pulse" /> : completedCount}
            </p>
          </div>
        </section>

        {/* Triage Queue Table Section */}
        <section id="triage-queue-section" className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Discrepancy Triage Queue</h2>
              <p className="text-xs text-slate-400 mt-1">Review papers where evaluator disagreement exceeds the bounds.</p>
            </div>
            <span className="text-[10px] tracking-widest uppercase text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full font-bold">
              Variance Trigger: &ge; 5 Points
            </span>
          </div>
 
          <div className="p-6">
            {loading ? (
              <div className="space-y-4 py-8">
                <div className="h-6 bg-slate-800 rounded w-1/4 animate-pulse" />
                <div className="h-10 bg-slate-800 rounded animate-pulse" />
                <div className="h-10 bg-slate-800 rounded animate-pulse" />
              </div>
            ) : triagePapers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-955/80 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                    <tr>
                      <th className="px-5 py-4">Anonymous ID</th>
                      <th className="px-5 py-4">Blueprint</th>
                      <th className="px-5 py-4 text-center">E1 Score</th>
                      <th className="px-5 py-4 text-center">E2 Score</th>
                      <th className="px-5 py-4 text-center text-amber-400">Variance</th>
                      <th className="px-5 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans text-slate-200">
                    {triagePapers.map((paper) => {
                      const e1Score = paper.evaluations[0]?.total_score ?? 0;
                      const e2Score = paper.evaluations[1]?.total_score ?? 0;
                      const variance = Math.abs(e1Score - e2Score);
 
                      return (
                        <tr key={paper.id} className="hover:bg-slate-800/30 transition duration-200">
                          <td className="px-5 py-5 font-mono text-xs text-slate-300 font-bold">{paper.student_anonymous_id}</td>
                          <td className="px-5 py-5 font-medium text-slate-100">{paper.exam_blueprints?.name || 'Unknown Exam'}</td>
                          <td className="px-5 py-5 text-center font-mono text-slate-300">{e1Score.toFixed(2)}</td>
                          <td className="px-5 py-5 text-center font-mono text-slate-300">{e2Score.toFixed(2)}</td>
                          <td className="px-5 py-5 text-center text-amber-500 font-black font-mono text-sm">{variance.toFixed(2)}</td>
                          <td className="px-5 py-5 text-right">
                            <Link 
                              href={`/moderator/reconcile/${paper.id}`}
                              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition shadow-md shadow-amber-500/10 cursor-pointer inline-block"
                            >
                              Reconcile
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                <svg className="mx-auto h-12 w-12 text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-bold">No papers in triage queue.</p>
                <p className="text-xs text-slate-600 mt-1">All evaluations are currently within acceptable variance.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
