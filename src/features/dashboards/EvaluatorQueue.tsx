import Link from 'next/link';
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

type PaperWorkflowStatus =
  | 'Pending_E1_E2'
  | 'Needs_Reconciliation'
  | 'Completed';

interface EvaluatorQueuePaper {
  id: string;
  studentAnonymousId: string;
  status: PaperWorkflowStatus;
}

interface EvaluatorQueueProps {
  papers: EvaluatorQueuePaper[];
}

function mergeClassNames(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function formatPaperStatus(status: PaperWorkflowStatus) {
  return status.replaceAll('_', ' ');
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

export const EvaluatorQueue: React.FC<EvaluatorQueueProps> = ({ papers }) => {
  const pendingPapers = papers.filter((paper) => paper.status === 'Pending_E1_E2');

  return (
    <section className="mx-auto my-8 w-full max-w-6xl rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
      <div className="mb-5 flex flex-col gap-2 border-b border-slate-800/80 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300">
          Evaluator Dashboard
        </p>
        <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Standard Grading Queue</h2>
            <p className="text-sm text-slate-400">
              Review only papers still waiting for independent double-blind scoring.
            </p>
          </div>
          <span className="inline-flex w-fit items-center rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs font-medium text-slate-300">
            Pending papers: {pendingPapers.length}
          </span>
        </div>
      </div>

      <Table>
        <TableCaption className="sr-only">
          Papers currently available to start in the evaluator grading queue.
        </TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Paper ID</TableHead>
            <TableHead>Anonymous ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingPapers.length > 0 ? (
            pendingPapers.map((paper) => (
              <TableRow key={paper.id}>
                <TableCell className="font-mono text-xs text-slate-300 md:text-sm">
                  {paper.id}
                </TableCell>
                <TableCell className="font-medium text-white">
                  {paper.studentAnonymousId}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    {formatPaperStatus(paper.status)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/evaluate/${paper.id}`}
                    className="inline-flex items-center justify-center rounded-md border border-indigo-400/20 bg-indigo-500/15 px-3 py-2 text-sm font-semibold text-indigo-200 transition hover:border-indigo-300/40 hover:bg-indigo-500/25 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    Start Evaluation
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="py-12 text-center text-sm text-slate-400">
                No papers are currently waiting in the standard grading queue.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
};

export default EvaluatorQueue;
