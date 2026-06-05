'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { useFetchPaperDetails } from '../../../../features/operations/useFetchPaperDetails';
import { useFetchEvaluations } from '../../../../features/operations/useFetchEvaluations';
import { useSubmitReconciliation } from '../../../../features/operations/useMutateEvaluation';
import ReconciliationMatrix from '../../../../features/dashboards/ReconciliationMatrix';
import { PDFPanel } from '../../../../features/evaluation/PDFPanel';

interface PageProps {
  params: Promise<{
    paperId: string;
  }>;
}

export default function ReconcilePage({ params }: PageProps) {
  const { paperId } = use(params);
  const router = useRouter();

  const { paperData, loading: paperLoading, error: paperError } = useFetchPaperDetails(paperId);
  const { evaluations, loading: evLoading, error: evError } = useFetchEvaluations(paperId);
  const { submitReconciliation, loading: submitting, error: submitError } = useSubmitReconciliation();

  const isLoading = paperLoading || evLoading;
  const error = paperError || evError;

  const evaluator1 = evaluations[0];
  const evaluator2 = evaluations[1];

  const handleReconcileSubmit = async (payload: {
    finalSettledScores: Record<string, number | null>;
    justification: string;
  }) => {
    if (!evaluator1 || !evaluator2) return;

    // Calculate final settled score
    const finalScore = Object.values(payload.finalSettledScores).reduce<number>(
      (sum, val) => sum + (val ?? 0),
      0
    );

    const params = {
      paper_id: String(paperId),
      final_score: finalScore,
      notes: payload.justification,
      moderator_id: '11111111-1111-1111-1111-111111111111', // Mock moderator user ID from seed
      original_e1_score: evaluator1.total_score,
      original_e2_score: evaluator2.total_score,
    };

    const result = await submitReconciliation(params);
    if (result.success) {
      router.push('/moderator/dashboard');
    }
  };

  if (error) {
    return (
      <div className="p-8 text-center text-rose-500 bg-rose-950/20 rounded-xl border border-rose-900/50 m-6">
        <h3 className="font-bold text-lg">Error Loading Reconciliation Workspace</h3>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  const pdfUrl = paperData?.pdf_url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

  return (
    <div id="reconciliation-workspace-root" className="h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      <Navbar currentPaperId={paperId} />

      {submitError && (
        <div className="p-4 bg-rose-950/20 border border-rose-900/50 text-rose-400 text-sm shrink-0">
          Failed to submit reconciliation: {submitError}
        </div>
      )}

      <div className="w-full h-[calc(100vh-64px)] overflow-hidden flex divide-x divide-slate-800 bg-slate-950 text-slate-100">
        {/* Left Side Panel (PDF Panel - 55% Width) */}
        <div className="w-[55%] h-full overflow-y-auto bg-slate-950 p-6 flex flex-col">
          {isLoading ? (
            <div className="space-y-6 flex-1 flex flex-col animate-pulse">
              <div className="h-8 bg-slate-800 rounded w-1/3" />
              <div className="flex-1 bg-slate-900/50 rounded-xl border border-slate-800 flex flex-col justify-center items-center gap-3">
                <div className="h-4 bg-slate-800 rounded w-1/2" />
                <div className="h-3 bg-slate-800 rounded w-1/3" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 h-full">
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                  Exam PDF Document Viewer
                </h2>
                <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                  Anonymous ID: {paperData?.student_anonymous_id}
                </span>
              </div>
              <div className="flex-1 bg-slate-900 border border-slate-800 shadow-md rounded-xl p-4 min-h-[450px]">
                <PDFPanel pdfUrl={pdfUrl} />
              </div>
            </div>
          )}
        </div>

        {/* Right Side Panel (Reconciliation Workspace - 45% Width) */}
        <div className="w-[45%] h-full overflow-y-auto bg-slate-950/40 p-6 flex flex-col border-l border-slate-800/80">
          {isLoading ? (
            <div className="space-y-6 flex-1 animate-pulse">
              <div className="h-8 bg-slate-800 rounded w-1/2" />
              <div className="h-32 bg-slate-900/50 rounded-xl" />
              <div className="h-40 bg-slate-900/50 rounded-xl" />
            </div>
          ) : evaluator1 && evaluator2 ? (
            <div className="flex flex-col flex-1">
              <div className="mb-6 shrink-0">
                <h1 className="text-2xl font-bold text-slate-100">Conflict Reconciliation</h1>
                <p className="text-xs text-slate-450 mt-1">Review the side-by-side grades and select/assign final marks.</p>
              </div>

              <div className="flex-1">
                <ReconciliationMatrix
                  evaluator1Data={evaluator1.question_scores}
                  evaluator2Data={evaluator2.question_scores}
                  evaluator1Notes={evaluator1.notes}
                  evaluator2Notes={evaluator2.notes}
                  maxMarksByQuestion={paperData?.exam_blueprints?.structure || {}}
                  onSubmitOverride={handleReconcileSubmit}
                />
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl">
              <p className="text-sm font-semibold">Insufficient evaluations found.</p>
              <p className="text-xs text-slate-500 mt-1">This paper requires submissions from both E1 and E2 before it can be reconciled.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
