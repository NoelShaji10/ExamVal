'use client';

import * as React from 'react';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

interface TableSectionProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {}

interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {}

interface TableCaptionProps
  extends React.HTMLAttributes<HTMLTableCaptionElement> {}

type QuestionScoreMap = Record<string, number>;

type QuestionMaxMarksMap = Record<string, number>;

interface ReconciliationSubmissionPayload {
  finalSettledScores: Record<string, number | null>;
  justification: string;
}

interface ReconciliationMatrixProps {
  evaluator1Data: QuestionScoreMap;
  evaluator2Data: QuestionScoreMap;
  maxMarksByQuestion?: QuestionMaxMarksMap;
  onSubmitOverride?: (payload: ReconciliationSubmissionPayload) => void;
}

function mergeClassNames(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function Table({ className, ...props }: TableProps) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table
        className={mergeClassNames('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: TableSectionProps) {
  return (
    <thead
      className={mergeClassNames(
        '[&_tr]:border-b [&_tr]:border-slate-800/80',
        className,
      )}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: TableSectionProps) {
  return (
    <tbody
      className={mergeClassNames('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: TableRowProps) {
  return (
    <tr
      className={mergeClassNames(
        'border-b border-slate-800/70 transition-colors hover:bg-slate-900/70',
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <th
      className={mergeClassNames(
        'h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-[0.18em] text-slate-400',
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: TableCellProps) {
  return (
    <td
      className={mergeClassNames('px-4 py-4 align-middle text-slate-200', className)}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: TableCaptionProps) {
  return (
    <caption
      className={mergeClassNames('mt-4 text-sm text-slate-500', className)}
      {...props}
    />
  );
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
  maxMarksByQuestion = {},
  onSubmitOverride,
}) => {
  const questionIds = getQuestionIds(evaluator1Data, evaluator2Data);
  const [finalSettledScores, setFinalSettledScores] = React.useState(() =>
    buildInitialSettledScores(evaluator1Data, evaluator2Data),
  );
  const [justification, setJustification] = React.useState('');

  React.useEffect(() => {
    setFinalSettledScores(buildInitialSettledScores(evaluator1Data, evaluator2Data));
  }, [evaluator1Data, evaluator2Data]);

  const handleFinalScoreChange = (questionId: string, nextValue: string) => {
    if (nextValue === '') {
      setFinalSettledScores((currentScores) => ({
        ...currentScores,
        [questionId]: null,
      }));
      return;
    }

    const parsedValue = Number.parseFloat(nextValue);
    if (Number.isNaN(parsedValue)) {
      return;
    }

    setFinalSettledScores((currentScores) => ({
      ...currentScores,
      [questionId]: parsedValue,
    }));
  };

  const handleSubmitOverride = () => {
    const payload = {
      finalSettledScores,
      justification: justification.trim(),
    };

    if (onSubmitOverride) {
      onSubmitOverride(payload);
      return;
    }

    // Placeholder until the backend reconciliation action exists.
    console.log('Reconciliation submission payload:', payload);
  };

  const isSubmissionReady = justification.trim().length > 0;

  return (
    <section className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
      <div className="flex flex-col gap-2 border-b border-slate-800/80 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-300">
          Reconciliation Workspace
        </p>
        <div>
          <h2 className="text-2xl font-semibold text-white">Comparative Discrepancy Matrix</h2>
          <p className="text-sm text-slate-400">
            Align question-level marks, highlight disagreements, and lock the final score set.
          </p>
        </div>
      </div>

      <Table>
        <TableCaption className="sr-only">
          Side-by-side comparison of evaluator scores for each question.
        </TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Question ID</TableHead>
            <TableHead>Max Marks</TableHead>
            <TableHead>Evaluator 1 Score</TableHead>
            <TableHead>Evaluator 2 Score</TableHead>
            <TableHead>Final Settled Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questionIds.map((questionId) => {
            const evaluator1Score = evaluator1Data[questionId];
            const evaluator2Score = evaluator2Data[questionId];
            const settledScore = finalSettledScores[questionId];
            const isMismatch = evaluator1Score !== evaluator2Score;

            return (
              <TableRow
                key={questionId}
                className={isMismatch ? 'bg-red-950/25 hover:bg-red-950/35' : undefined}
              >
                <TableCell className="font-mono font-semibold text-white">
                  {questionId}
                </TableCell>
                <TableCell className="font-mono text-slate-300">
                  {maxMarksByQuestion[questionId] ?? '--'}
                </TableCell>
                <TableCell className="font-mono text-slate-100">
                  {evaluator1Score ?? '--'}
                </TableCell>
                <TableCell className="font-mono text-slate-100">
                  {evaluator2Score ?? '--'}
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    min={0}
                    max={maxMarksByQuestion[questionId]}
                    step={0.5}
                    value={settledScore ?? ''}
                    onChange={(event) =>
                      handleFinalScoreChange(questionId, event.target.value)
                    }
                    placeholder={isMismatch ? 'Enter final score' : 'Settled'}
                    aria-label={`Final settled score for ${questionId}`}
                    className="w-full max-w-[12rem] rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="space-y-3 border-t border-slate-800/80 pt-6">
        <label
          htmlFor="moderator-justification"
          className="block text-sm font-semibold text-slate-200"
        >
          Moderator Justification Notes (Required)
        </label>
        <textarea
          id="moderator-justification"
          rows={6}
          value={justification}
          onChange={(event) => setJustification(event.target.value)}
          placeholder="Explain the rationale behind the final reconciled marks for audit review."
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            Every override must include a moderator note before the paper can be locked.
          </p>
          <button
            type="button"
            onClick={handleSubmitOverride}
            disabled={!isSubmissionReady}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
          >
            Confirm Override &amp; Lock
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReconciliationMatrix;
