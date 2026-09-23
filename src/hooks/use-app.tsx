import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Task, Note, DailyGoal, Theme, ViewKey } from '@/lib/types';
import { storage, uid } from '@/lib/storage';

interface AppContextValue {
  // data
  tasks: Task[];
  notes: Note[];
  goals: DailyGoal[];
  theme: Theme;
  view: ViewKey;
  // view
  setView: (v: ViewKey) => void;
  // theme
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  // tasks
  addTask: (t: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  updateTask: (id: string, t: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  // notes
  addNote: (n: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, n: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  // goals
  addGoal: (title: string) => void;
  updateGoal: (id: string, title: string) => void;
  deleteGoal: (id: string) => void;
  toggleGoal: (id: string) => void;
  // settings
  clearAllData: () => void;
  resetToSample: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [goals, setGoals] = useState<DailyGoal[]>([]);
  const [theme, setThemeState] = useState<Theme>('light');
  const [view, setView] = useState<ViewKey>('dashboard');

  // seed + load on mount
  useEffect(() => {
    storage.seedIfEmpty();
    setTasks(storage.getTasks());
    setNotes(storage.getNotes());
    setGoals(storage.getGoals());
    const stored = storage.getTheme();
    const initial: Theme =
      stored ??
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light');
    setThemeState(initial);
  }, []);

  // apply theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    storage.setTheme(theme);
  }, [theme]);

  // persist on change
  useEffect(() => storage.setTasks(tasks), [tasks]);
  useEffect(() => storage.setNotes(notes), [notes]);
  useEffect(() => storage.setGoals(goals), [goals]);

  const toggleTheme = useCallback(
    () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark')),
    []
  );
  const setTheme = useCallback((t: Theme) => setThemeState(t), []);

  const addTask = useCallback(
    (t: Omit<Task, 'id' | 'createdAt' | 'completed'>) =>
      setTasks((prev) => [
        {
          ...t,
          id: uid(),
          createdAt: new Date().toISOString(),
          completed: false,
        },
        ...prev,
      ]),
    []
  );
  const updateTask = useCallback(
    (id: string, patch: Partial<Task>) =>
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
      ),
    []
  );
  const deleteTask = useCallback(
    (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id)),
    []
  );
  const toggleTask = useCallback(
    (id: string) =>
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      ),
    []
  );

  const addNote = useCallback(
    (n: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      setNotes((prev) => [
        { ...n, id: uid(), createdAt: now, updatedAt: now },
        ...prev,
      ]);
    },
    []
  );
  const updateNote = useCallback(
    (id: string, patch: Partial<Note>) =>
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, ...patch, updatedAt: new Date().toISOString() }
            : n
        )
      ),
    []
  );
  const deleteNote = useCallback(
    (id: string) => setNotes((prev) => prev.filter((n) => n.id !== id)),
    []
  );

  const addGoal = useCallback(
    (title: string) =>
      setGoals((prev) => [
        ...prev,
        {
          id: uid(),
          title,
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ]),
    []
  );
  const updateGoal = useCallback(
    (id: string, title: string) =>
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? { ...g, title } : g))
      ),
    []
  );
  const deleteGoal = useCallback(
    (id: string) => setGoals((prev) => prev.filter((g) => g.id !== id)),
    []
  );
  const toggleGoal = useCallback(
    (id: string) =>
      setGoals((prev) =>
        prev.map((g) =>
          g.id === id ? { ...g, completed: !g.completed } : g
        )
      ),
    []
  );

  const clearAllData = useCallback(() => {
    storage.clearAll();
    setTasks([]);
    setNotes([]);
    setGoals([]);
  }, []);

  const resetToSample = useCallback(() => {
    storage.resetToSample();
    setTasks(storage.getTasks());
    setNotes(storage.getNotes());
    setGoals(storage.getGoals());
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      tasks,
      notes,
      goals,
      theme,
      view,
      setView,
      toggleTheme,
      setTheme,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      addNote,
      updateNote,
      deleteNote,
      addGoal,
      updateGoal,
      deleteGoal,
      toggleGoal,
      clearAllData,
      resetToSample,
    }),
    [
      tasks,
      notes,
      goals,
      theme,
      view,
      toggleTheme,
      setTheme,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      addNote,
      updateNote,
      deleteNote,
      addGoal,
      updateGoal,
      deleteGoal,
      toggleGoal,
      clearAllData,
      resetToSample,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
