import { create } from 'zustand';

/**
 * Valid session roles restricted strictly to: 'Evaluator' or 'Moderator'
 */
export type UserRole = 'Evaluator' | 'Moderator';

/**
 * Standard user profile representation.
 * Can be extended with custom user properties.
 */
export interface AppUser {
  id: string;
  email: string;
  name?: string;
  [key: string]: unknown; // Strict TypeScript type instead of any
}

/**
 * Type representing user details, which can be an object, a text string, or null when logged out.
 */
export type UserDetails = AppUser | string | null;

/**
 * Zustand store interface representing the application's global client-side state.
 */
export interface AppState {
  /**
   * The current logged-in user profile details (default: null).
   * Can be an object or a text string.
   */
  user: UserDetails;

  /**
   * The active session permission (default: 'Evaluator').
   * Restricted strictly to 'Evaluator' or 'Moderator'.
   */
  role: UserRole;

  /**
   * The ID of the exam document currently open in the active workspace view (default: null).
   */
  activePaperId: string | null;

  /**
   * Updates the current user profile details in the store.
   */
  setUser: (user: UserDetails) => void;

  /**
   * Updates the active session permission role.
   */
  setRole: (role: UserRole) => void;

  /**
   * Updates the active exam paper ID currently open in the workspace view.
   */
  setActivePaper: (activePaperId: string | null) => void;

  /**
   * Clears the current active session state, resetting to default values.
   */
  clearSession: () => void;
}

/**
 * Centralized Zustand store for global client-side state management.
 */
export const useAppStore = create<AppState>((set) => ({
  // Core State Properties
  user: null,
  role: 'Evaluator',
  activePaperId: null,

  // Setter Actions
  setUser: (user) => set(() => ({ user })),
  
  setRole: (role) => set(() => ({ role })),
  
  setActivePaper: (activePaperId) => set(() => ({ activePaperId })),

  clearSession: () => set(() => ({
    user: null,
    role: 'Evaluator',
    activePaperId: null,
  })),
}));

