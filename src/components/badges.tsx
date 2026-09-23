import type { Priority, Category } from '@/lib/types';
import { cn } from '@/lib/utils';

export const priorityStyles: Record<Priority, string> = {
  high: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  medium:
    'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
};

export const categoryStyles: Record<Category, string> = {
  Study: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  Assignment:
    'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  Project:
    'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
  Personal:
    'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
  Exam: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  Other:
    'bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20',
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize',
        priorityStyles[priority]
      )}
    >
      {priority}
    </span>
  );
}

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        categoryStyles[category]
      )}
    >
      {category}
    </span>
  );
}
