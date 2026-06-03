'use client';

import React, { useEffect } from 'react';
import { useAppStore, UserRole } from '../../store/useAppStore';

interface NavbarProps {
  /**
   * Optional current paper ID from page context to synchronize with the global Zustand store.
   * Passing null explicitly clears the active paper.
   */
  currentPaperId?: string | null;
}

export default function Navbar({ currentPaperId }: NavbarProps) {
  const { role, activePaperId, setRole, setActivePaper } = useAppStore();

  // Synchronize the page's paper ID context with the global client state
  useEffect(() => {
    if (currentPaperId !== undefined) {
      setActivePaper(currentPaperId);
    }
  }, [currentPaperId, setActivePaper]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = e.target.value as UserRole;
    setRole(selectedRole);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex justify-between items-center transition-all duration-200">
      {/* Brand Logo & Context */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent hover:opacity-90 transition select-none">
            ExamVal
          </span>
        </div>
        <span className="text-slate-700">|</span>
        <span className="text-xs uppercase tracking-widest text-slate-500 font-mono font-bold select-none">
          State Sandbox
        </span>
      </div>

      {/* Right Side Sandbox Controls & Status */}
      <div className="flex items-center space-x-6">
        {/* Active Paper Status Indicator */}
        {activePaperId && (
          <div className="hidden sm:flex items-center space-x-2 bg-indigo-950/40 border border-indigo-900/30 px-3 py-1.5 rounded-lg text-xs font-mono text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span>Active Paper: {activePaperId}</span>
          </div>
        )}

        {/* Role Switcher Sandbox Dropdown */}
        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5">
          <label htmlFor="role-select" className="text-xs text-slate-400 font-semibold tracking-wide select-none">
            Change View Role:
          </label>
          <div className="relative">
            <select
              id="role-select"
              value={role}
              onChange={handleRoleChange}
              className="bg-slate-950 text-xs font-bold text-indigo-400 border border-slate-700 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer hover:bg-slate-900 transition-colors"
            >
              <option value="Evaluator">Evaluator</option>
              <option value="Moderator">Moderator</option>
            </select>
          </div>
        </div>

        {/* Current Active Role Badge */}
        <div className="flex items-center">
          <span className={`text-xs px-3 py-1.5 rounded-full font-bold tracking-wide border transition-all duration-300 ${
            role === 'Moderator' 
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.05)]' 
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.05)]'
          }`}>
            {role} View
          </span>
        </div>
      </div>
    </header>
  );
}
