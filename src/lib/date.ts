import { differenceInCalendarDays, format, parseISO } from 'date-fns';

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function parseDate(iso: string): Date {
  return parseISO(iso);
}

export function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), 'MMM d, yyyy');
  } catch {
    return iso;
  }
}

export function formatDateShort(iso: string): string {
  try {
    return format(parseISO(iso), 'MMM d');
  } catch {
    return iso;
  }
}

export function isOverdue(task: { dueDate: string | null; completed: boolean }): boolean {
  if (!task.dueDate || task.completed) return false;
  return parseISO(task.dueDate) < parseISO(todayISO());
}

export function isDueToday(task: { dueDate: string | null; completed: boolean }): boolean {
  if (!task.dueDate || task.completed) return false;
  return task.dueDate === todayISO();
}

export function relativeDueLabel(dueDate: string): string {
  const diff = differenceInCalendarDays(parseISO(dueDate), parseISO(todayISO()));
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  if (diff === -1) return 'Overdue by 1 day';
  if (diff > 1) return `Due in ${diff} days`;
  return `Overdue by ${Math.abs(diff)} days`;
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export const PRIORITY_WEIGHT: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
};
