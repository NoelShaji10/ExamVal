'use client';

import React, { useState } from 'react';
import { PDFPanel } from './PDFPanel';
import { GradingForm, ExamBlueprint } from './GradingForm';
import { useFetchPaperDetails } from '../operations/useFetchPaperDetails';
import { useFetchEvaluations } from '../operations/useFetchEvaluations';

interface EvaluationWorkspaceProps {
    paperId: string;
}

const mockPdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

export const EvaluationWorkspace: React.FC<EvaluationWorkspaceProps> = ({ paperId }) => {
    const { paperData, loading: paperLoading, error: paperError } = useFetchPaperDetails(paperId);
    const { evaluations, loading: evLoading, error: evError, refetch: refetchEvaluations } = useFetchEvaluations(paperId);
    
    // Simulate active evaluator state (default: Evaluator One)
    const [activeEvaluatorId, setActiveEvaluatorId] = useState<string>('a0e0a9f3-8d2a-4a6c-9411-cf0b5d52c1e1');

    const isLoading = paperLoading || evLoading;
    const error = paperError || evError;

    const rawBlueprint = paperData?.exam_blueprints;
    const examBlueprint: ExamBlueprint | null = rawBlueprint ? {
        id: String(rawBlueprint.id),
        questions: Object.entries(rawBlueprint.structure || {}).map(([key, val]) => ({
            id: key,
            maxScore: Number(val)
        }))
    } : null;

    const existingEvaluation = evaluations.find(e => e.user_id === activeEvaluatorId);
    const pdfUrl = paperData?.pdf_url || mockPdfUrl;

    if (error) {
        return (
            <div className="p-8 text-center text-rose-500 bg-rose-950/20 rounded-xl border border-rose-900/50 m-6">
                <h3 className="font-bold text-lg">Error Loading Workspace</h3>
                <p className="text-sm mt-1">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full h-[calc(100vh-64px)] overflow-hidden flex divide-x divide-gray-200 bg-gray-50 text-gray-800 antialiased font-sans">
            {/* Left Side Panel (PDF Panel - 55% Width) */}
            <div className="w-[55%] h-full overflow-y-auto bg-gray-50 p-6 flex flex-col">
                {isLoading ? (
                    <div className="space-y-6 flex-1 flex flex-col animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3" />
                        <div className="flex-1 bg-gray-200/55 rounded-xl border border-gray-200 flex flex-col justify-center items-center gap-3">
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                            <div className="h-3 bg-gray-200 rounded w-1/3" />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col flex-1 h-full">
                        {/* Header Area */}
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
                                PDF Document Viewer
                            </h2>
                            <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-gray-200 border border-gray-300 text-gray-600">
                                Paper ID: {paperId}
                            </span>
                        </div>
                        {/* Document Canvas Wrapper with Margins and Shadow */}
                        <div className="flex-1 bg-white border border-gray-200 shadow-md rounded-xl p-4 min-h-[450px]">
                            <PDFPanel pdfUrl={pdfUrl} />
                        </div>
                    </div>
                )}
            </div>

            {/* Right Side Panel (Grading Form - 45% Width) */}
            <div className="w-[45%] h-full overflow-y-auto bg-white p-6 flex flex-col">
                {isLoading ? (
                    <div className="space-y-6 flex-1 animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/2" />
                        <div className="h-32 bg-gray-200/55 rounded-xl" />
                        <div className="h-40 bg-gray-200/55 rounded-xl" />
                    </div>
                ) : examBlueprint ? (
                    <div className="flex flex-col flex-1">
                        {/* Header Area */}
                        <div className="flex justify-between items-center mb-4 shrink-0">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                Grading & Evaluation Form
                            </h2>
                        </div>

                        {/* Simulator Sandbox Selector */}
                        <div className="mb-6 flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-xs">
                          <div>
                            <span className="font-bold text-indigo-900 block">Simulate Evaluator Session</span>
                            <span className="text-indigo-600/80">Switch users to test double-blind grading block.</span>
                          </div>
                          <select 
                            value={activeEvaluatorId}
                            onChange={(e) => setActiveEvaluatorId(e.target.value)}
                            className="bg-white border border-indigo-200 rounded-lg px-3 py-2 text-xs text-indigo-900 font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                          >
                            <option value="a0e0a9f3-8d2a-4a6c-9411-cf0b5d52c1e1">Evaluator One (E1)</option>
                            <option value="b0e0a9f3-8d2a-4a6c-9411-cf0b5d52c1e2">Evaluator Two (E2)</option>
                          </select>
                        </div>

                        {/* Interactive Form */}
                        <div className="flex-1">
                            <GradingForm 
                                examBlueprint={examBlueprint} 
                                paperId={paperId}
                                evaluatorId={activeEvaluatorId}
                                existingEvaluation={existingEvaluation}
                                onSuccess={refetchEvaluations}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="py-12 text-center text-sm text-gray-400">
                        No blueprint structure loaded for this paper.
                    </div>
                )}
            </div>
        </div>
    );
};
