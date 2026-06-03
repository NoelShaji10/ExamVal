import React, { useState } from 'react';

export interface Question {
    id: string;
    maxScore: number;
}

export interface ExamBlueprint {
    id: string;
    questions: Question[];
}

interface GradingFormProps {
    examBlueprint: ExamBlueprint;
}

export const GradingForm: React.FC<GradingFormProps> = ({ examBlueprint }) => {
    const [scores, setScores] = useState<Record<string, number>>({});
    const [notes, setNotes] = useState<Record<string, string>>({});

    const setScore = (id: string, val: string, max: number) => {
        const num = parseFloat(val);
        setScores((prev) => {
            const next = { ...prev };
            if (isNaN(num)) delete next[id];
            else next[id] = Math.max(0, Math.min(max, num));
            return next;
        });
    };

    return (
        <div className="space-y-6">
            {examBlueprint.questions.map((q) => (
                <div key={q.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4 shadow-sm hover:border-slate-700 transition-colors">
                    <div className="flex justify-between items-center text-sm">
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Question ID</span>
                            <span className="font-medium text-white">{q.id}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Max Score</span>
                            <span className="font-medium text-indigo-400">{q.maxScore} pts</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                            <label htmlFor={`score-${q.id}`} className="block text-xs font-medium text-slate-300 mb-1.5">Marks Awarded</label>
                            <input
                                id={`score-${q.id}`}
                                type="number"
                                min={0}
                                max={q.maxScore}
                                step={0.5}
                                value={scores[q.id] ?? ''}
                                onChange={(e) => setScore(q.id, e.target.value, q.maxScore)}
                                placeholder="0.0"
                                className="w-full rounded bg-slate-900 border border-slate-800 p-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor={`note-${q.id}`} className="block text-xs font-medium text-slate-300 mb-1.5">Evaluator Notes</label>
                            <textarea
                                id={`note-${q.id}`}
                                rows={2}
                                value={notes[q.id] ?? ''}
                                onChange={(e) => setNotes((prev) => ({ ...prev, [q.id]: e.target.value }))}
                                placeholder="Add feedback for this question..."
                                className="w-full rounded bg-slate-900 border border-slate-800 p-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
