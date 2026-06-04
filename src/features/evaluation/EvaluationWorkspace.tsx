'use client';

import React, { useState, useEffect } from 'react';
import { PDFPanel } from './PDFPanel';
import { GradingForm, ExamBlueprint } from './GradingForm';

interface EvaluationWorkspaceProps {
    paperId: string;
}

const mockBlueprint: ExamBlueprint = {
    id: 'math-final-2026',
    questions: [
        { id: 'Q1 (Calculus Limit)', maxScore: 10 },
        { id: 'Q2 (Derivative Proof)', maxScore: 15 },
        { id: 'Q3 (Taylor Series)', maxScore: 20 },
        { id: 'Q4 (Integration by Parts)', maxScore: 15 },
    ]
};

const mockPdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

export const EvaluationWorkspace: React.FC<EvaluationWorkspaceProps> = ({ paperId }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timer);
    }, [paperId]);

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
                            <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-gray-200 border border-gray-350 text-gray-600">
                                Paper ID: {paperId}
                            </span>
                        </div>
                        {/* Document Canvas Wrapper with Margins and Shadow */}
                        <div className="flex-1 bg-white border border-gray-200 shadow-md rounded-xl p-4 min-h-[450px]">
                            <PDFPanel pdfUrl={mockPdfUrl} />
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
                ) : (
                    <div className="flex flex-col flex-1">
                        {/* Header Area */}
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 shrink-0">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            Grading & Evaluation Form
                        </h2>
                        {/* Interactive Form */}
                        <div className="flex-1">
                            <GradingForm examBlueprint={mockBlueprint} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
