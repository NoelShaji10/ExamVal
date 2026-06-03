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
    const [scores, setScores] = useState<Record<string, string>>({});
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleScoreChange = (id: string, val: string, max: number) => {
        setScores((prev) => ({ ...prev, [id]: val }));

        let error = '';
        if (val === '') {
            error = 'Score is required';
        } else {
            const num = parseFloat(val);
            if (isNaN(num)) {
                error = 'Please enter a valid number';
            } else if (num < 0) {
                error = 'Score cannot be negative';
            } else if (num > max) {
                error = `Score cannot exceed the maximum score of ${max}`;
            }
        }

        setErrors((prev) => ({ ...prev, [id]: error }));
    };

    const totalScore = examBlueprint.questions.reduce((sum, q) => {
        const val = scores[q.id];
        if (!val) return sum;
        const num = parseFloat(val);
        if (isNaN(num) || num < 0 || num > q.maxScore) return sum;
        return sum + num;
    }, 0);

    const totalMaxScore = examBlueprint.questions.reduce((sum, q) => sum + q.maxScore, 0);
    const displayTotalScore = Math.round(totalScore * 100) / 100;

    const isFormValid = examBlueprint.questions.every((q) => {
        const val = scores[q.id];
        if (val === undefined || val === '') return false;
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= q.maxScore && !errors[q.id];
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        const submission = {
            examBlueprintId: examBlueprint.id,
            scores: Object.keys(scores).reduce((acc, qId) => {
                acc[qId] = parseFloat(scores[qId]);
                return acc;
            }, {} as Record<string, number>),
            notes: notes,
            submittedAt: new Date().toISOString(),
        };

        console.log('Submission:', submission);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {examBlueprint.questions.map((q) => {
                const hasError = !!errors[q.id];
                return (
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
                                    onChange={(e) => handleScoreChange(q.id, e.target.value, q.maxScore)}
                                    placeholder="0.0"
                                    className={`w-full rounded bg-slate-900 border p-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-colors ${hasError
                                            ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                                            : 'border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                                        }`}
                                />
                                {hasError && (
                                    <p className="mt-1.5 text-xs text-rose-400 font-medium flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        {errors[q.id]}
                                    </p>
                                )}
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
                );
            })}

            <div className="mt-8 p-6 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-sm font-medium text-slate-300">Live Total Score</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Sum of all question scores</p>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-bold text-white">{displayTotalScore}</span>
                        <span className="text-lg text-slate-500 font-semibold"> / {totalMaxScore}</span>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={!isFormValid}
                    className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors shadow-lg shadow-indigo-500/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                    Submit Evaluation
                </button>
            </div>
        </form>
    );
};
