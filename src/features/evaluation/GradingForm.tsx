'use client';

import React, { useState, useEffect } from 'react';
import { useSubmitEvaluation } from '../operations/useMutateEvaluation';
import { Evaluation } from '../operations/useFetchEvaluations';

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
    paperId: string | number;
    evaluatorId: string;
    existingEvaluation?: Evaluation;
    onSuccess?: () => void;
}

export const GradingForm: React.FC<GradingFormProps> = ({ 
    examBlueprint, 
    paperId, 
    evaluatorId, 
    existingEvaluation,
    onSuccess 
}) => {
    const [scores, setScores] = useState<Record<string, string>>({});
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { submitEvaluation, loading: isSubmitting, error: submitError } = useSubmitEvaluation();

    const isReadOnly = !!existingEvaluation;

    // Load existing scores/notes if already submitted
    useEffect(() => {
        if (existingEvaluation) {
            const loadedScores: Record<string, string> = {};
            const loadedNotes: Record<string, string> = {};
            
            // Map scores
            Object.entries(existingEvaluation.question_scores || {}).forEach(([qId, val]) => {
                loadedScores[qId] = String(val);
            });
            
            // Map notes
            const rawNotes = existingEvaluation.notes;
            if (rawNotes && typeof rawNotes === 'object') {
                Object.entries(rawNotes).forEach(([qId, val]) => {
                    loadedNotes[qId] = String(val);
                });
            } else if (rawNotes && typeof rawNotes === 'string') {
                loadedNotes['general'] = rawNotes;
            }

            setScores(loadedScores);
            setNotes(loadedNotes);
            setErrors({});
        } else {
            setScores({});
            setNotes({});
            setErrors({});
        }
    }, [existingEvaluation, examBlueprint]);

    const handleScoreChange = (id: string, val: string, max: number) => {
        if (isReadOnly) return;
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

    const handleNoteChange = (id: string, val: string) => {
        if (isReadOnly) return;
        setNotes((prev) => ({ ...prev, [id]: val }));
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid || isReadOnly || isSubmitting) return;

        const parsedScores = Object.keys(scores).reduce((acc, qId) => {
            acc[qId] = parseFloat(scores[qId]);
            return acc;
        }, {} as Record<string, number>);

        const params = {
            paper_id: String(paperId),
            user_id: evaluatorId,
            user_role: 'Evaluator',
            question_scores: parsedScores,
            total_score: totalScore,
            notes: notes,
        };

        const result = await submitEvaluation(params);
        if (result.success && onSuccess) {
            onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {isReadOnly && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-xs font-semibold flex items-center gap-2 mb-6">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Evaluation locked. You have successfully submitted scores for this paper.</span>
                </div>
            )}

            {submitError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-xs font-semibold flex items-center gap-2 mb-6">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{submitError}</span>
                </div>
            )}

            {examBlueprint.questions.map((q) => {
                const hasError = !!errors[q.id];
                return (
                    <div key={q.id} className="rounded-xl border border-gray-200 bg-white p-5 mb-4 shadow-sm hover:border-gray-300 transition-colors">
                        <div className="flex justify-between items-center text-sm mb-4">
                            <div>
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Question ID</span>
                                <span className="font-bold text-gray-955">{q.id}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Max Score</span>
                                <span className="font-bold text-indigo-600">{q.maxScore} pts</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                                <label htmlFor={`score-${q.id}`} className="block text-xs font-semibold text-gray-600 mb-1.5 font-sans">Marks Awarded</label>
                                <input
                                    id={`score-${q.id}`}
                                    type="number"
                                    min={0}
                                    max={q.maxScore}
                                    step={0.5}
                                    disabled={isReadOnly}
                                    value={scores[q.id] ?? ''}
                                    onChange={(e) => handleScoreChange(q.id, e.target.value, q.maxScore)}
                                    placeholder="0.0"
                                    className={`w-full rounded border bg-white p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 ${hasError
                                            ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                                            : 'border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                                        }`}
                                />
                                {hasError && (
                                    <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        {errors[q.id]}
                                    </p>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor={`note-${q.id}`} className="block text-xs font-semibold text-gray-600 mb-1.5 font-sans">Evaluator Notes</label>
                                <textarea
                                    id={`note-${q.id}`}
                                    rows={2}
                                    disabled={isReadOnly}
                                    value={notes[q.id] ?? ''}
                                    onChange={(e) => handleNoteChange(q.id, e.target.value)}
                                    placeholder={isReadOnly ? "No notes added" : "Add feedback for this question..."}
                                    className="w-full rounded border border-gray-300 bg-white p-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200"
                                />
                            </div>
                        </div>
                    </div>
                );
            })}

            <div className="mt-8 p-6 rounded-xl border border-gray-200 bg-gray-50 space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-sm font-bold text-gray-800">Live Total Score</h3>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">Sum of all question scores</p>
                    </div>
                    <div className="text-right font-sans">
                        <span className="text-3xl font-extrabold text-gray-900">{displayTotalScore}</span>
                        <span className="text-lg text-gray-400 font-bold"> / {totalMaxScore}</span>
                    </div>
                </div>
                {!isReadOnly && (
                    <button
                        type="submit"
                        disabled={!isFormValid || isSubmitting}
                        className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors shadow-md shadow-indigo-500/5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white flex justify-center items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Evaluation'
                        )}
                    </button>
                )}
            </div>
        </form>
    );
};
