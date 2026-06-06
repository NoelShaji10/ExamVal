'use client';

import * as React from 'react';

type QuestionScoreMap = Record<string, number>;
type QuestionMaxMarksMap = Record<string, number>;

interface ReconciliationSubmissionPayload {
  finalSettledScores: Record<string, number | null>;
  justification: string;
}

interface ReconciliationMatrixProps {
  evaluator1Data: QuestionScoreMap;
  evaluator2Data: QuestionScoreMap;
  evaluator1Notes?: Record<string, string>;
  evaluator2Notes?: Record<string, string>;
  maxMarksByQuestion?: QuestionMaxMarksMap;
  onSubmitOverride?: (payload: ReconciliationSubmissionPayload) => void;
}

function getQuestionIds(
  evaluator1Data: QuestionScoreMap,
  evaluator2Data: QuestionScoreMap,
) {
  return Array.from(
    new Set([...Object.keys(evaluator1Data), ...Object.keys(evaluator2Data)]),
  ).sort((left, right) => left.localeCompare(right));
}

function buildInitialSettledScores(
  evaluator1Data: QuestionScoreMap,
  evaluator2Data: QuestionScoreMap,
) {
  return getQuestionIds(evaluator1Data, evaluator2Data).reduce<
    Record<string, number | null>
  >((accumulator, questionId) => {
    const evaluator1Score = evaluator1Data[questionId];
    const evaluator2Score = evaluator2Data[questionId];

    accumulator[questionId] =
      evaluator1Score === evaluator2Score ? evaluator1Score : null;

    return accumulator;
  }, {});
}

export const ReconciliationMatrix: React.FC<ReconciliationMatrixProps> = ({
  evaluator1Data,
  evaluator2Data,
  evaluator1Notes = {},
  evaluator2Notes = {},
  maxMarksByQuestion = {},
  onSubmitOverride,
}) => {
  const questionIds = getQuestionIds(evaluator1Data, evaluator2Data);
  const [finalSettledScores, setFinalSettledScores] = React.useState(() =>
    buildInitialSettledScores(evaluator1Data, evaluator2Data),
  );
  const [justification, setJustification] = React.useState('');
  const [inputErrors, setInputErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    setFinalSettledScores(buildInitialSettledScores(evaluator1Data, evaluator2Data));
  }, [evaluator1Data, evaluator2Data]);

  const handleFinalScoreChange = (questionId: string, nextValue: string) => {
    const maxVal = maxMarksByQuestion[questionId] ?? 9999;
    
    if (nextValue === '') {
      setFinalSettledScores((currentScores) => ({
        ...currentScores,
        [questionId]: null,
      }));
      setInputErrors(prev => ({ ...prev, [questionId]: 'Score is required' }));
      return;
    }

    const parsedValue = Number.parseFloat(nextValue);
    if (Number.isNaN(parsedValue)) {
      return;
    }

    let error = '';
    if (parsedValue < 0) {
      error = 'Score cannot be negative';
    } else if (parsedValue > maxVal) {
      error = `Cannot exceed max of ${maxVal}`;
    }

    setInputErrors(prev => ({ ...prev, [questionId]: error }));

    if (!error) {
      setFinalSettledScores((currentScores) => ({
        ...currentScores,
        [questionId]: parsedValue,
      }));
    }
  };

  const handleSubmitOverride = () => {
    const payload = {
      finalSettledScores,
      justification: justification.trim(),
    };

    if (onSubmitOverride) {
      onSubmitOverride(payload);
    }
  };

  const isAllSettled = questionIds.every((qId) => finalSettledScores[qId] !== null && !inputErrors[qId]);
  const isSubmissionReady = justification.trim().length > 0 && isAllSettled;

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight select-none">
          Comparative Discrepancy Matrix
        </h2>
        <p className="text-xs text-slate-500 mt-1 select-none">
          Align question-level marks, highlight disagreements, and lock the final score set.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50/70 text-slate-400 text-[10px] uppercase tracking-wider font-bold">
            <tr className="border-b border-slate-200/50">
              <th className="px-4 py-3">Question ID</th>
              <th className="px-4 py-3">Max Marks</th>
              <th className="px-4 py-3">Evaluator 1 Score</th>
              <th className="px-4 py-3">Evaluator 2 Score</th>
              <th className="px-4 py-3">Final Settled Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {questionIds.map((questionId) => {
              const evaluator1Score = evaluator1Data[questionId];
              const evaluator2Score = evaluator2Data[questionId];
              const settledScore = finalSettledScores[questionId];
              const isMismatch = evaluator1Score !== evaluator2Score;

              const e1Note = evaluator1Notes[questionId];
              const e2Note = evaluator2Notes[questionId];

              return (
                <tr
                  key={questionId}
                  className={`transition-colors border-b border-slate-100 ${
                    isMismatch ? 'bg-amber-50/70 hover:bg-amber-100/40' : 'hover:bg-slate-50/30'
                  }`}
                >
                  <td className="px-4 py-4 font-mono font-bold text-slate-900">
                    {questionId}
                  </td>
                  <td className="px-4 py-4 font-mono text-slate-500">
                    {maxMarksByQuestion[questionId] ?? '--'}
                  </td>
                  <td className="px-4 py-4 text-xs">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono font-bold text-slate-900">{evaluator1Score ?? '--'}</span>
                      {e1Note && (
                        <span className="text-slate-500 text-[11px] font-normal leading-none bg-slate-100 border border-slate-200/40 rounded px-1.5 py-0.5 select-none">
                          {e1Note}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono font-bold text-slate-900">{evaluator2Score ?? '--'}</span>
                      {e2Note && (
                        <span className="text-slate-500 text-[11px] font-normal leading-none bg-slate-100 border border-slate-200/40 rounded px-1.5 py-0.5 select-none">
                          {e2Note}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <input
                        type="number"
                        min={0}
                        max={maxMarksByQuestion[questionId]}
                        step={0.5}
                        value={settledScore ?? ''}
                        onChange={(event) =>
                          handleFinalScoreChange(questionId, event.target.value)
                        }
                        placeholder="Enter"
                        aria-label={`Final settled score for ${questionId}`}
                        className={`w-32 rounded-lg border bg-white px-3 py-1.5 text-sm font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                          inputErrors[questionId] ? 'border-red-500 ring-1 ring-red-150' : 'border-slate-350'
                        }`}
                      />
                      {inputErrors[questionId] && (
                        <p className="text-[10px] text-red-650 font-semibold mt-1">
                          {inputErrors[questionId]}
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Justification Text Area */}
      <div className="space-y-3 pt-4 border-t border-slate-100 flex flex-col">
        <label
          htmlFor="moderator-justification"
          className="block text-xs font-bold uppercase tracking-wider text-slate-500 select-none"
        >
          Moderator Justification Notes (Required)
        </label>
        <textarea
          id="moderator-justification"
          rows={4}
          value={justification}
          onChange={(event) => setJustification(event.target.value)}
          placeholder="Enter justification for the settled scores..."
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-sans"
        />
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          <p className="text-xs text-slate-400 font-medium select-none">
            Every override must include a moderator note before the paper can be locked.
          </p>
          <button
            type="button"
            onClick={handleSubmitOverride}
            disabled={!isSubmissionReady}
            className="px-6 py-2.5 bg-[#0B2545] hover:bg-[#06172B] disabled:bg-slate-200 text-white disabled:text-slate-400 text-xs font-bold rounded-lg transition-all tracking-wide select-none cursor-pointer text-center"
          >
            Finalize &amp; Submit
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReconciliationMatrix;
