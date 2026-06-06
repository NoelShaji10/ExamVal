'use client';

import Link from 'next/link';
import * as React from 'react';

type PaperWorkflowStatus =
  | 'Pending_E1_E2'
  | 'Needs_Reconciliation'
  | 'Completed';

interface EvaluatorQueuePaper {
  id: string;
  studentAnonymousId: string;
  status: PaperWorkflowStatus;
  createdAt?: string;
}

interface EvaluatorQueueProps {
  papers: EvaluatorQueuePaper[];
}

function formatDate(dateStr?: string) {
  if (!dateStr) return 'Oct 26, 2024';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Oct 26, 2024';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Oct 26, 2024';
  }
}

function getTimeRemaining(dateStr?: string) {
  if (!dateStr) return '2 Days, 4 Hours';
  try {
    const created = new Date(dateStr);
    if (isNaN(created.getTime())) return '2 Days, 4 Hours';
    
    // Deadline is 3 days after creation
    const deadline = new Date(created.getTime() + 3 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diffMs = deadline.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Overdue';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffHours / 24);
    const hours = diffHours % 24;
    
    if (days > 0) {
      return `${days} Day${days > 1 ? 's' : ''}, ${hours} Hour${hours !== 1 ? 's' : ''}`;
    }
    return `${hours} Hour${hours !== 1 ? 's' : ''}`;
  } catch {
    return '2 Days, 4 Hours';
  }
}

export const EvaluatorQueue: React.FC<EvaluatorQueueProps> = ({ papers }) => {
  const [activeTab, setActiveTab] = React.useState<'standard' | 'moderation' | 'completed'>('standard');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'newest' | 'oldest'>('newest');

  // Filter and sort papers dynamically
  const sortedAndFilteredPapers = React.useMemo(() => {
    let result = papers.filter((paper) => {
      if (activeTab === 'standard') return paper.status === 'Pending_E1_E2';
      if (activeTab === 'moderation') return paper.status === 'Needs_Reconciliation';
      if (activeTab === 'completed') return paper.status === 'Completed';
      return false;
    });

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (paper) =>
          paper.id.toLowerCase().includes(query) ||
          paper.studentAnonymousId.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [papers, activeTab, searchQuery, sortBy]);

  return (
    <div className="flex-1 flex w-full h-[calc(100vh-64px)] overflow-hidden bg-white text-slate-800 font-sans">
      {/* Sidebar Panel */}
      <aside className="w-64 shrink-0 border-r border-slate-100 bg-slate-50/50 p-6 flex flex-col justify-between h-full">
        <div className="space-y-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 select-none">
            Evaluator Queues
          </p>
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('standard')}
              className={`flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-xs font-semibold transition select-none cursor-pointer ${
                activeTab === 'standard' 
                  ? 'bg-slate-200/60 text-slate-900 font-semibold' 
                  : 'text-slate-500 font-medium hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <svg className={`h-4 w-4 shrink-0 ${activeTab === 'standard' ? 'text-slate-700' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Standard Grading</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('moderation')}
              className={`flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-xs font-medium transition select-none cursor-pointer ${
                activeTab === 'moderation' 
                  ? 'bg-slate-200/60 text-slate-900 font-semibold' 
                  : 'text-slate-500 font-medium hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <svg className={`h-4 w-4 shrink-0 ${activeTab === 'moderation' ? 'text-slate-700' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              <span>Moderation Queue</span>
            </button>

            <button 
              onClick={() => setActiveTab('completed')}
              className={`flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-xs font-medium transition select-none cursor-pointer ${
                activeTab === 'completed' 
                  ? 'bg-slate-200/60 text-slate-900 font-semibold' 
                  : 'text-slate-500 font-medium hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <svg className={`h-4 w-4 shrink-0 ${activeTab === 'completed' ? 'text-slate-700' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span>Completed</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto p-10 flex flex-col bg-[#F8FAFC]">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight select-none">
            Evaluator Dashboard
          </h1>
        </div>

        {/* Sub-header Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 mb-8 gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-slate-800 tracking-tight select-none">
              {activeTab === 'standard' && 'Standard Grading Queue'}
              {activeTab === 'moderation' && 'Moderation Queue'}
              {activeTab === 'completed' && 'Completed Evaluations'}
            </h2>
            <span className="ml-3 px-2.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-slate-50 border border-slate-200/80 rounded-full select-none">
              Papers: {sortedAndFilteredPapers.length}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <span className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-450 focus:outline-none focus:ring-1 focus:ring-slate-355 w-48 font-sans"
              />
            </div>
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 pl-3 pr-8 py-1.5 rounded-lg transition select-none cursor-pointer appearance-none focus:outline-none w-36"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <span className="absolute right-2.5 pointer-events-none text-slate-400 flex items-center">
                <svg className="h-3 w-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Cards list */}
        <div className="flex-1 space-y-6">
          {sortedAndFilteredPapers.length > 0 ? (
            sortedAndFilteredPapers.map((paper) => (
              <div 
                key={paper.id} 
                className="flex flex-col lg:flex-row border border-slate-200/80 bg-white rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
              >
                {/* Left side details */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase select-none">
                      Paper ID
                    </span>
                    <div className="text-sm font-mono text-slate-700 mt-1 select-all break-all">
                      {paper.id}
                    </div>
                  </div>
                  
                  <div className="w-full border-t border-slate-100 my-4" />
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase select-none block">
                        Anonymous ID
                      </span>
                      <span className="text-xs font-semibold font-mono text-slate-700 block mt-1 break-all select-all">
                        {paper.studentAnonymousId}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase select-none block">
                        Status
                      </span>
                      {paper.status === 'Pending_E1_E2' && (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200/50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 mt-1 select-none">
                          Pending E1 E2
                        </span>
                      )}
                      {paper.status === 'Needs_Reconciliation' && (
                        <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200/50 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 mt-1 select-none">
                          Needs Reconciliation
                        </span>
                      )}
                      {paper.status === 'Completed' && (
                        <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200/50 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 mt-1 select-none">
                          Completed
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase select-none block">
                        Date Submitted
                      </span>
                      <span className="text-xs font-medium text-slate-500 block mt-1 select-none">
                        {formatDate(paper.createdAt)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase select-none block">
                        Time Remaining
                      </span>
                      <span className="text-xs font-medium text-slate-500 block mt-1 select-none">
                        {getTimeRemaining(paper.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Right side action button */}
                <div className="w-full lg:w-72 shrink-0 flex p-6 bg-slate-50/50 border-t lg:border-t-0 lg:border-l border-slate-150 justify-center items-center">
                  <Link
                    href={`/evaluate/${paper.id}`}
                    className="w-full h-full min-h-[80px] lg:min-h-[110px] flex items-center justify-center rounded-xl bg-[#007BFF] hover:bg-[#0056b3] text-white font-semibold text-lg tracking-wide transition-all duration-200 select-none cursor-pointer text-center"
                  >
                    {activeTab === 'standard' ? 'Start Evaluation' : 'View Grading'}
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <svg className="mx-auto h-12 w-12 text-slate-350 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-bold select-none text-slate-500">No papers found</p>
              <p className="text-xs text-slate-400 mt-1 select-none">There are no papers in this queue queue category.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EvaluatorQueue;
