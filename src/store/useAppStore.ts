import { create } from 'zustand';

export type UserRole = 'Evaluator' | 'Moderator';

export interface AppUser {
  id: string;
  email: string;
  name: string;
}

interface AppState {
  // State variables
  user: AppUser | null;
  role: UserRole | null;
  activePaperId: string | null;

  // Actions
  setUser: (user: AppUser | null) => void;
  setRole: (role: UserRole | null) => void;
  setActivePaperId: (paperId: string | null) => void;
  clearSession: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  role: null,
  activePaperId: null,

  setUser: (user) => set(() => ({ user })),
  setRole: (role) => set(() => ({ role })),
  setActivePaperId: (activePaperId) => set(() => ({ activePaperId })),
  clearSession: () => set(() => ({ user: null, role: null, activePaperId: null })),
}));
