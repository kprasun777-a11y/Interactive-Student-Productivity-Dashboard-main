import type { Task, Note, DailyGoal, Theme } from './types';
import { sampleTasks, sampleNotes, sampleGoals } from './sample-data';

const KEYS = {
  tasks: 'spd_tasks',
  notes: 'spd_notes',
  goals: 'spd_goals',
  theme: 'spd_theme',
  seeded: 'spd_seeded',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / serialization errors
  }
}

export const storage = {
  getTasks: () => read<Task[]>(KEYS.tasks, []),
  setTasks: (v: Task[]) => write(KEYS.tasks, v),

  getNotes: () => read<Note[]>(KEYS.notes, []),
  setNotes: (v: Note[]) => write(KEYS.notes, v),

  getGoals: () => read<DailyGoal[]>(KEYS.goals, []),
  setGoals: (v: DailyGoal[]) => write(KEYS.goals, v),

  getTheme: () => read<Theme | null>(KEYS.theme, null),
  setTheme: (v: Theme) => write(KEYS.theme, v),

  isSeeded: () => read<boolean>(KEYS.seeded, false),
  markSeeded: () => write(KEYS.seeded, true),

  clearAll: () => {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },

  seedIfEmpty: () => {
    if (read<boolean>(KEYS.seeded, false)) return;
    if (read<Task[]>(KEYS.tasks, []).length === 0) {
      write(KEYS.tasks, sampleTasks);
    }
    if (read<Note[]>(KEYS.notes, []).length === 0) {
      write(KEYS.notes, sampleNotes);
    }
    if (read<DailyGoal[]>(KEYS.goals, []).length === 0) {
      write(KEYS.goals, sampleGoals);
    }
    write(KEYS.seeded, true);
  },

  resetToSample: () => {
    write(KEYS.tasks, sampleTasks);
    write(KEYS.notes, sampleNotes);
    write(KEYS.goals, sampleGoals);
    write(KEYS.seeded, true);
  },
};

export function uid(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}
