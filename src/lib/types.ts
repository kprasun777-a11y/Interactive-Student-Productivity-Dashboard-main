export type Priority = 'low' | 'medium' | 'high';

export type Category =
  | 'Study'
  | 'Assignment'
  | 'Project'
  | 'Personal'
  | 'Exam'
  | 'Other';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  dueDate: string | null; // ISO date string (yyyy-mm-dd) or null
  createdAt: string; // ISO datetime
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyGoal {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export type Theme = 'light' | 'dark';

export type ViewKey =
  | 'dashboard'
  | 'tasks'
  | 'notes'
  | 'deadlines'
  | 'goals'
  | 'settings';
