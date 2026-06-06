'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, UserRole } from '../../store/useAppStore';

interface NavbarProps {
  /**
   * Optional current paper ID from page context to synchronize with the global Zustand store.
   * Passing null explicitly clears the active paper.
   */
  currentPaperId?: string | null;
}

export default function Navbar({ currentPaperId }: NavbarProps) {
  const router = useRouter();
  const { role, evaluatorRole, activePaperId, setRole, setEvaluatorRole, setActivePaper } = useAppStore();

  // Synchronize the page's paper ID context with the global client state
  useEffect(() => {
    if (currentPaperId !== undefined) {
      setActivePaper(currentPaperId);
    }
  }, [currentPaperId, setActivePaper]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = e.target.value as UserRole;
    setRole(selectedRole);
    if (selectedRole === 'Evaluator') {
      router.push('/');
    } else if (selectedRole === 'Moderator') {
      router.push('/moderator/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-slate-200/80 bg-white px-6 flex justify-between items-center transition-all duration-200 font-sans">
      {/* Left Area: Logo & Search */}
      <div className="flex items-center space-x-6 flex-1">
        <div 
          onClick={() => router.push(role === 'Evaluator' ? '/' : '/moderator/dashboard')}
          className="flex items-center space-x-2.5 cursor-pointer select-none"
        >
          <svg className="h-6 w-6 text-[#007BFF]" viewBox="0 0 24 24" fill="currentColor">
            <rect width="24" height="24" rx="6" fill="#007BFF" />
            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="white" />
          </svg>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            ExamVal
          </span>
        </div>

        {/* Search Input on the Left-Middle */}
        {role === 'Evaluator' && !activePaperId && (
          <div className="hidden md:flex items-center pl-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search"
                className="bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-450 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-550 w-56 font-sans"
              />
            </div>
          </div>
        )}
      </div>

      {/* Right Area: Controls & Profile */}
      <div className="flex items-center space-x-4">
        {/* Evaluator Identity Switcher */}
        {role === 'Evaluator' && (
          <div 
            className="flex items-center space-x-2 pr-2 border-r border-slate-200"
            title={activePaperId ? 'Cannot change evaluator identity after selecting a paper' : undefined}
          >
            <span className="text-xs text-slate-500 font-medium tracking-wide select-none">
              Evaluator Identity:
            </span>
            <select
              id="evaluator-role-select"
              value={evaluatorRole}
              disabled={!!activePaperId}
              onChange={(e) => setEvaluatorRole(e.target.value as 'EVALUATOR_1' | 'EVALUATOR_2')}
              className="bg-white text-xs font-semibold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer hover:bg-slate-50 transition-colors disabled:cursor-not-allowed disabled:text-slate-400 disabled:bg-slate-50"
            >
              <option value="EVALUATOR_1">Evaluator 1 (E1)</option>
              <option value="EVALUATOR_2">Evaluator 2 (E2)</option>
            </select>
          </div>
        )}

        {/* Change View Role Switcher */}
        <div className="flex items-center space-x-2">
          <label htmlFor="role-select" className="text-xs text-slate-500 font-medium tracking-wide select-none">
            Change View Role:
          </label>
          <select
            id="role-select"
            value={role}
            onChange={handleRoleChange}
            className="bg-white text-xs font-semibold text-slate-850 border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <option value="Evaluator">Evaluator</option>
            <option value="Moderator">Moderator</option>
          </select>
        </div>

        {/* Current Active Role Badge */}
        <div className="flex items-center">
          {role === 'Moderator' ? (
            <span className="text-xs px-3 py-1 rounded-lg font-semibold border bg-blue-50 text-blue-600 border-blue-200/50 shadow-sm select-none">
              Moderator View
            </span>
          ) : (
            <span className="text-xs px-3 py-1 rounded-lg font-semibold border bg-emerald-50 text-emerald-600 border-emerald-250/50 shadow-sm select-none">
              Evaluator View
            </span>
          )}
        </div>

        </div>
      </header>
    );
  }
