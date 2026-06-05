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
    status: p.status as 'Pending_E1_E2' | 'Needs_Reconciliation' | 'Completed'
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar currentPaperId={null} />
      
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full flex flex-col justify-center space-y-8">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-wider bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            ExamVal
          </h1>
          <p className="text-slate-400 text-sm">
            Double-Blind Evaluation & Moderator Reconciliation Portal
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-950/20 border border-rose-900/50 rounded-xl text-rose-400 text-sm max-w-xl mx-auto w-full">
            Error loading workspace: {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-indigo-500" />
          </div>
        ) : role === 'Evaluator' ? (
          <div className="space-y-6">
            <EvaluatorQueue papers={evaluatorPapers} />
          </div>
        ) : (
          <div className="max-w-xl w-full mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
            <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-3">Moderator Workspace</h2>
            <div className="grid grid-cols-1 gap-4 text-left">
              <Link
                href="/moderator/dashboard"
                className="flex flex-col p-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 rounded-xl transition duration-250 group animate-fadeIn"
              >
                <span className="text-sm font-bold text-amber-400 group-hover:text-amber-300">
                  Moderator Triage Dashboard ➔
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  View the conflict triage queue, metrics, and incoming anomalous papers.
                </span>
              </Link>
            </div>
          </div>
        )}

        <div className="pt-2 text-center text-[10px] text-slate-600 font-mono">
          State Engine sandbox navbar is enabled. Switch views using "Change View Role".
        </div>
      </main>
    </div>
  );
}
