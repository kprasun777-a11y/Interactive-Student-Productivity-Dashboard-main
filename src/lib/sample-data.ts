import type { Task, Note, DailyGoal } from './types';

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export const sampleTasks: Task[] = [
  {
    id: 't1',
    title: 'Complete JavaScript assignment',
    description:
      'Finish the DOM manipulation exercises and submit on the college portal.',
    category: 'Assignment',
    priority: 'high',
    dueDate: daysFromNow(1),
    createdAt: daysAgo(3),
    completed: false,
  },
  {
    id: 't2',
    title: 'Practice DSA for 1 hour',
    description: 'Solve two medium-level array problems on LeetCode.',
    category: 'Study',
    priority: 'medium',
    dueDate: daysFromNow(0),
    createdAt: daysAgo(2),
    completed: false,
  },
  {
    id: 't3',
    title: 'Finish portfolio website',
    description: 'Polish the hero section and deploy to Vercel.',
    category: 'Project',
    priority: 'high',
    dueDate: daysFromNow(5),
    createdAt: daysAgo(7),
    completed: false,
  },
  {
    id: 't4',
    title: 'Prepare internship presentation',
    description: 'Create slides summarizing the work done this month.',
    category: 'Project',
    priority: 'medium',
    dueDate: daysFromNow(3),
    createdAt: daysAgo(4),
    completed: false,
  },
  {
    id: 't5',
    title: 'Review React concepts',
    description: 'Revise hooks, context, and reconciliation.',
    category: 'Exam',
    priority: 'high',
    dueDate: daysFromNow(7),
    createdAt: daysAgo(5),
    completed: false,
  },
  {
    id: 't6',
    title: 'Read 20 pages of documentation',
    description: 'Go through the Tailwind CSS layout guide.',
    category: 'Study',
    priority: 'low',
    dueDate: daysFromNow(-1),
    createdAt: daysAgo(6),
    completed: true,
  },
  {
    id: 't7',
    title: 'Work on project report',
    description: 'Draft the introduction and methodology sections.',
    category: 'Project',
    priority: 'medium',
    dueDate: daysFromNow(-2),
    createdAt: daysAgo(8),
    completed: false,
  },
  {
    id: 't8',
    title: 'Organize study desk',
    description: 'Tidy up notes and stationery for the week.',
    category: 'Personal',
    priority: 'low',
    dueDate: daysFromNow(2),
    createdAt: daysAgo(1),
    completed: true,
  },
];

export const sampleNotes: Note[] = [
  {
    id: 'n1',
    title: 'JavaScript interview questions',
    content:
      'Closures, hoisting, event loop, prototypal inheritance, and the difference between == and ===. Practice explaining each with a small code example.',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(2),
  },
  {
    id: 'n2',
    title: 'React hooks revision',
    content:
      'useState, useEffect (cleanup + deps), useContext, useReducer, useMemo vs useCallback, and useRef for mutable values. Remember: hooks must run in the same order every render.',
    createdAt: daysAgo(4),
    updatedAt: daysAgo(1),
  },
  {
    id: 'n3',
    title: 'Project ideas',
    content:
      '1. Weather app with geolocation. 2. Expense tracker with charts. 3. Markdown note app with localStorage. 4. Pomodoro timer with stats. Pick one for the next portfolio piece.',
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
];

export const sampleGoals: DailyGoal[] = [
  {
    id: 'g1',
    title: 'Study for 2 hours',
    completed: true,
    createdAt: daysAgo(0),
  },
  {
    id: 'g2',
    title: 'Complete one coding problem',
    completed: true,
    createdAt: daysAgo(0),
  },
  {
    id: 'g3',
    title: 'Read technical documentation',
    completed: false,
    createdAt: daysAgo(0),
  },
  {
    id: 'g4',
    title: 'Work on project for 1 hour',
    completed: false,
    createdAt: daysAgo(0),
  },
  {
    id: 'g5',
    title: 'Revise yesterday notes',
    completed: false,
    createdAt: daysAgo(0),
  },
];
