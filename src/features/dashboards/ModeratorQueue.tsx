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

interface ModeratorQueuePaper {
  id: string;
  studentAnonymousId: string;
  status: PaperWorkflowStatus;
}

interface ModeratorQueueProps {
  papers: ModeratorQueuePaper[];
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

export const ModeratorQueue: React.FC<ModeratorQueueProps> = ({ papers }) => {
  const flaggedPapers = papers.filter(
    (paper) => paper.status === 'Needs_Reconciliation',
  );

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-slate-950/30">
      <div className="flex flex-col gap-3 border-b border-slate-800/80 px-6 py-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
            Moderator Control Center
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-white">Conflict Resolution Queue</h2>
          <p className="text-sm text-slate-400">
            Papers shown here have breached the variance threshold and need final review.
          </p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-200">
          Variance trigger: {flaggedPapers.length} flagged
        </span>
      </div>

      <div className="p-6">
        <Table>
          <TableCaption className="sr-only">
            Papers that require moderator discrepancy review.
          </TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Paper ID</TableHead>
              <TableHead>Current Status</TableHead>
              <TableHead>Conflict Warning</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flaggedPapers.length > 0 ? (
              flaggedPapers.map((paper) => (
                <TableRow key={paper.id}>
                  <TableCell className="font-mono text-xs text-slate-300 md:text-sm">
                    {paper.id}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-200">
                      {formatPaperStatus(paper.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-200">
                      High Variance (&gt;= 5)
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/moderator/reconcile/${paper.id}`}
                      className="inline-flex items-center justify-center rounded-md bg-amber-400 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                    >
                      Resolve Discrepancy
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center text-sm text-slate-400">
                  No papers are currently waiting for moderator intervention.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default ModeratorQueue;
