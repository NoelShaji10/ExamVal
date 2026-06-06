'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import { useAppStore } from '../store/useAppStore';
import { useFetchPapers } from '../features/operations/useFetchPapers';
import EvaluatorQueue from '../features/dashboards/EvaluatorQueue';

export default function HomePage() {
  const { role } = useAppStore();
  const { papers, loading, error } = useFetchPapers();

  // Map database papers to EvaluatorQueue format
  const evaluatorPapers = papers.map(p => ({
    id: String(p.id),
    studentAnonymousId: p.student_anonymous_id,
    status: p.status as 'Pending_E1_E2' | 'Needs_Reconciliation' | 'Completed',
    createdAt: p.created_at
  }));

  // Metrics calculation
  const needsReconciliationCount = papers.filter((p) => p.status === 'Needs_Reconciliation').length;
  const awaitingCount = papers.filter((p) => p.status === 'Pending_E1_E2').length;
  const completedCount = papers.filter((p) => p.status === 'Completed').length;

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Navbar currentPaperId={null} />

      {role === 'Evaluator' ? (
        <div className="flex-1 flex overflow-hidden">
          <EvaluatorQueue papers={evaluatorPapers} />
        </div>
      ) : (
        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 flex flex-col bg-white">
          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-650 text-sm">
              Error loading dashboard data: {error}
            </div>
          )}

          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-10 select-none">
            Moderator Hub
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left Section: Go to Dashboard card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center justify-between min-h-[420px] relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#007BFF] opacity-90" />

              <div className="my-6">
                {/* Large checkmark magnifying glass icon */}
                <div className="h-28 w-28 rounded-full bg-blue-50/50 border border-blue-100 flex items-center justify-center text-blue-500 shadow-inner">
                  <svg className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z M9 11l2 2 4-4" />
                  </svg>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Moderator Triage Dashboard
                </h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Access the conflict triage queue, view metrics, and manage incoming anomalous papers.
                </p>
              </div>

              <Link
                href="/moderator/dashboard"
                className="w-full py-3.5 px-6 bg-[#007BFF] hover:bg-[#0056b3] text-white font-semibold rounded-xl text-center flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Go to Dashboard
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* Right Section: Quick Stats & Recent Activity */}
            <div className="space-y-8">
              {/* Quick Stats Grid */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight select-none">
                  Quick Stats
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50/30 border border-blue-100/50 rounded-xl p-4 flex flex-col justify-between min-h-[100px]">
                    <span className="text-xs text-slate-500 font-semibold leading-tight">Needs Reconciliation:</span>
                    <span className="text-2xl font-bold text-blue-600 block mt-2">
                      {loading ? '...' : needsReconciliationCount}
                    </span>
                  </div>

                  <div className="bg-blue-50/30 border border-blue-100/50 rounded-xl p-4 flex flex-col justify-between min-h-[100px]">
                    <span className="text-xs text-slate-500 font-semibold leading-tight">Awaiting E1/E2 Grades:</span>
                    <span className="text-2xl font-bold text-blue-600 block mt-2">
                      {loading ? '...' : awaitingCount}
                    </span>
                  </div>

                  <div className="bg-slate-50/60 border border-slate-200/50 rounded-xl p-4 flex flex-col justify-between min-h-[100px]">
                    <span className="text-xs text-slate-500 font-semibold leading-tight">Completed Evaluations:</span>
                    <span className="text-2xl font-bold text-slate-800 block mt-2">
                      {loading ? '...' : completedCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Activity Timeline */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight select-none">
                  Recent Activity
                </h3>

                <div className="border border-slate-200/80 rounded-2xl p-6 bg-white space-y-6">
                  {/* Timeline Item 1 */}
                  <div className="flex items-start space-x-4">
                    <div className="h-8 w-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shrink-0 shadow-sm">
                      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-800 leading-snug">
                        Reconciled Q1_a in EXAM-ROLL-1104
                      </p>
                      <p className="text-[10px] font-medium text-slate-400 font-mono">30 mins ago</p>
                    </div>
                  </div>

                  {/* Timeline Item 2 */}
                  <div className="flex items-start space-x-4">
                    <div className="h-8 w-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shrink-0 shadow-sm">
                      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-800 leading-snug">
                        Viewed Discrepancy Matrix for Class XII Math
                      </p>
                      <p className="text-[10px] font-medium text-slate-400 font-mono">1 hour ago</p>
                    </div>
                  </div>

                  {/* Timeline Item 3 */}
                  <div className="flex items-start space-x-4">
                    <div className="h-8 w-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shrink-0 shadow-sm">
                      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-800 leading-snug">
                        Marked EXAM-ROLL-1105 as Resolved
                      </p>
                      <p className="text-[10px] font-medium text-slate-400 font-mono">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
