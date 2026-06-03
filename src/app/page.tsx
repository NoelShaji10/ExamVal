import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center font-sans p-6">
      <div className="max-w-xl w-full text-center space-y-8 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-wider bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            ExamVal
          </h1>
          <p className="text-slate-400 text-sm">
            Double-Blind Evaluation & Moderator Reconciliation Portal
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 text-left">
          <Link
            href="/moderator/dashboard"
            className="flex flex-col p-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 rounded-xl transition duration-250 group"
          >
            <span className="text-sm font-bold text-indigo-400 group-hover:text-indigo-300">
              Moderator Dashboard ➔
            </span>
            <span className="text-xs text-slate-500 mt-1">
              View the discrepancy triage queue, metrics, and incoming anomalous papers.
            </span>
          </Link>

          <Link
            href="/evaluate/demo-paper-101"
            className="flex flex-col p-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 rounded-xl transition duration-250 group"
          >
            <span className="text-sm font-bold text-emerald-400 group-hover:text-emerald-300">
              Evaluator Workspace ➔
            </span>
            <span className="text-xs text-slate-500 mt-1">
              Digital grading sheet for individual papers (Simulating Paper ID: demo-paper-101).
            </span>
          </Link>

          <Link
            href="/moderator/reconcile/demo-paper-101"
            className="flex flex-col p-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 rounded-xl transition duration-250 group"
          >
            <span className="text-sm font-bold text-amber-400 group-hover:text-amber-300">
              Moderator Reconciliation Matrix ➔
            </span>
            <span className="text-xs text-slate-500 mt-1">
              Compare grading differences side-by-side and commit overrides.
            </span>
          </Link>
        </div>

        <div className="pt-2 text-[10px] text-slate-600 font-mono">
          State Engine sandbox navbar is enabled globally across these workspaces.
        </div>
      </div>
    </div>
  );
}
