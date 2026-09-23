import { useMemo } from 'react';
import { CalendarClock, AlertTriangle, CalendarCheck, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PriorityBadge, CategoryBadge } from '@/components/badges';
import { EmptyState } from '@/components/empty-state';
import { useApp } from '@/hooks/use-app';
import {
  isOverdue,
  isDueToday,
  relativeDueLabel,
  formatDate,
  todayISO,
} from '@/lib/date';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

export function DeadlinesPage() {
  const { tasks } = useApp();

  const deadlines = useMemo(
    () =>
      tasks
        .filter((t) => !t.completed && t.dueDate)
        .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1)),
    [tasks]
  );

  const today = todayISO();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Deadlines</h1>
        <p className="text-sm text-muted-foreground">
          Upcoming and overdue tasks with due dates, sorted by nearest first.
        </p>
      </div>

      {deadlines.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No upcoming deadlines"
          description="Tasks with due dates will appear here automatically."
        />
      ) : (
        <div className="space-y-3">
          {deadlines.map((t) => {
            const overdue = isOverdue(t);
            const dueToday = isDueToday(t);
            const diff = differenceInCalendarDays(parseISO(t.dueDate!), parseISO(today));

            return (
              <Card
                key={t.id}
                className={cn(
                  'transition-colors',
                  overdue
                    ? 'border-red-500/40 bg-red-500/5'
                    : dueToday
                      ? 'border-amber-500/40 bg-amber-500/5'
                      : 'hover:bg-accent/30'
                )}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                      overdue
                        ? 'bg-red-500/10 text-red-500'
                        : dueToday
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-blue-500/10 text-blue-500'
                    )}
                  >
                    {overdue ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : dueToday ? (
                      <Clock className="h-5 w-5" />
                    ) : (
                      <CalendarCheck className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <CategoryBadge category={t.category} />
                      <PriorityBadge priority={t.priority} />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(t.dueDate!)}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={cn(
                        'text-sm font-semibold',
                        overdue
                          ? 'text-red-500'
                          : dueToday
                            ? 'text-amber-500'
                            : 'text-foreground'
                      )}
                    >
                      {relativeDueLabel(t.dueDate!)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {diff === 0
                        ? 'Today'
                        : diff > 0
                          ? `${diff} day${diff === 1 ? '' : 's'} left`
                          : `${Math.abs(diff)} day${Math.abs(diff) === 1 ? '' : 's'} ago`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
