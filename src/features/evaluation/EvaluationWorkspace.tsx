import React, { useState, useEffect } from 'react';

interface EvaluationWorkspaceProps {
    paperId: string;
}

export const EvaluationWorkspace: React.FC<EvaluationWorkspaceProps> = ({ paperId }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timer);
    }, [paperId]);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 antialiased font-sans">
            {/* Left Panel - 55% Width */}
            <div className="w-[55%] h-screen overflow-y-auto border-r border-slate-800 bg-slate-900/30 flex flex-col p-8">
                {isLoading ? (
                    <div className="space-y-6 flex-1 flex flex-col animate-pulse">
                        <div className="h-8 bg-slate-800 rounded w-1/3" />
                        <div className="flex-1 bg-slate-800/40 rounded-xl border border-slate-800/50 flex flex-col justify-center items-center gap-3">
                            <div className="h-4 bg-slate-800 rounded w-1/2" />
                            <div className="h-3 bg-slate-800 rounded w-1/3" />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                                PDF Document Viewer
                            </h2>
                            <span className="px-3 py-1 text-xs font-mono rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                                ID: {paperId}
                            </span>
                        </div>
                        <div className="flex-1 rounded-xl border border-dashed border-slate-700 bg-slate-900/30 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                            <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-medium text-slate-200 mb-1">Paper PDF Placeholder</h3>
                            <p className="text-xs text-slate-400 max-w-xs mb-4">Interactive PDF viewing and annotation.</p>
                            <button onClick={() => setIsLoading(true)} className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors cursor-pointer">
                                Simulate Loading
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Panel - 45% Width */}
            <div className="w-[45%] h-screen overflow-y-auto bg-slate-950 flex flex-col p-8">
                {isLoading ? (
                    <div className="space-y-6 flex-1 animate-pulse">
                        <div className="h-8 bg-slate-800 rounded w-1/2" />
                        <div className="h-32 bg-slate-800/40 rounded-xl" />
                        <div className="h-40 bg-slate-800/40 rounded-xl" />
                    </div>
                ) : (
                    <div className="flex flex-col flex-1">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            Grading & Evaluation Form
                        </h2>
                        <div className="space-y-6">
                            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
                                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Evaluation Rubric</h3>
                                {['Criteria A: Methodology', 'Criteria B: Analysis'].map((c, i) => (
                                    <div key={i} className="flex justify-between items-center p-2.5 rounded bg-slate-900/80 border border-slate-800/50 text-sm">
                                        <span className="text-slate-300">{c}</span>
                                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">Pending</span>
                                    </div>
                                ))}
                            </div>
                            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
                                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assessor Comments</h3>
                                <textarea
                                    placeholder="Enter feedback..."
                                    className="w-full h-24 rounded bg-slate-900 border border-slate-800 p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                                    readOnly
                                />
                            </div>
                            <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm font-semibold transition-all cursor-pointer">
                                Submit Evaluation
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
