import { useMemo } from 'react';
import {
  CheckSquare,
  CircleCheck,
  CircleDashed,
  AlertTriangle,
  ArrowRight,
  Target,
  StickyNote,
  CalendarClock,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { StatCard } from '@/components/stat-card';
import { PriorityBadge, CategoryBadge } from '@/components/badges';
import { EmptyState } from '@/components/empty-state';
import { useApp } from '@/hooks/use-app';
import {
  isOverdue,
  isDueToday,
  relativeDueLabel,
  formatDateShort,
  PRIORITY_WEIGHT,
} from '@/lib/date';
import { cn } from '@/lib/utils';

export function DashboardPage() {
  const { tasks, goals, notes, setView, toggleTask } = useApp();

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const overdue = tasks.filter((t) => isOverdue(t)).length;
    const pending = total - completed;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, pending, overdue, progress };
  }, [tasks]);

  const todaysTasks = useMemo(
    () =>
      tasks
        .filter((t) => !t.completed && (isDueToday(t) || isOverdue(t)))
        .sort((a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority])
        .slice(0, 5),
    [tasks]
  );

  const upcomingDeadlines = useMemo(
    () =>
      tasks
        .filter((t) => !t.completed && t.dueDate)
        .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1))
        .slice(0, 5),
    [tasks]
  );

  const goalProgress = useMemo(() => {
    const done = goals.filter((g) => g.completed).length;
    const pct = goals.length === 0 ? 0 : Math.round((done / goals.length) * 100);
    return { done, total: goals.length, pct };
  }, [goals]);

  const recentNotes = useMemo(() => notes.slice(0, 3), [notes]);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, Student
        </h1>
        <p className="text-sm text-muted-foreground">
          Here's your productivity overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          label="Total Tasks"
          value={stats.total}
          icon={CheckSquare}
          accent="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={CircleCheck}
          accent="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={CircleDashed}
          accent="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
        <StatCard
          label="Overdue"
          value={stats.overdue}
          icon={AlertTriangle}
          accent="bg-red-500/10 text-red-600 dark:text-red-400"
        />
        <Card className="col-span-2 lg:col-span-1">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Overall Progress</p>
            <p className="mt-1 text-2xl font-semibold">{stats.progress}%</p>
            <Progress value={stats.progress} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's tasks */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Today's Tasks</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('tasks')}
              className="text-muted-foreground"
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {todaysTasks.length === 0 ? (
              <EmptyState
                icon={CheckSquare}
                title="No tasks for today"
                description="You're all caught up. Add a new task to get started."
                action={
                  <Button size="sm" onClick={() => setView('tasks')}>
                    <Plus className="mr-1 h-4 w-4" />
                    Add task
                  </Button>
                }
              />
            ) : (
              todaysTasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
                >
                  <Checkbox
                    checked={t.completed}
                    onCheckedChange={() => toggleTask(t.id)}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <CategoryBadge category={t.category} />
                      <PriorityBadge priority={t.priority} />
                      {t.dueDate && (
                        <span
                          className={cn(
                            'text-xs',
                            isOverdue(t)
                              ? 'text-red-500'
                              : 'text-muted-foreground'
                          )}
                        >
                          {relativeDueLabel(t.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Daily goals */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Daily Goals</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('goals')}
              className="text-muted-foreground"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    strokeWidth="3"
                    className="stroke-muted"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="stroke-primary transition-all"
                    strokeDasharray={`${(goalProgress.pct / 100) * 97.4} 97.4`}
                  />
                </svg>
                <span className="absolute text-sm font-semibold">
                  {goalProgress.pct}%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">
                  {goalProgress.done} / {goalProgress.total} goals completed
                </p>
                <p className="text-xs text-muted-foreground">Keep it up!</p>
              </div>
            </div>
            {goals.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No goals for today yet.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {goals.slice(0, 4).map((g) => (
                  <li
                    key={g.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Target
                      className={cn(
                        'h-4 w-4 shrink-0',
                        g.completed
                          ? 'text-emerald-500'
                          : 'text-muted-foreground'
                      )}
                    />
                    <span
                      className={cn(
                        g.completed && 'text-muted-foreground line-through'
                      )}
                    >
                      {g.title}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming deadlines */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('deadlines')}
              className="text-muted-foreground"
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingDeadlines.length === 0 ? (
              <EmptyState
                icon={CalendarClock}
                title="No upcoming deadlines"
                description="Tasks with due dates will appear here."
              />
            ) : (
              upcomingDeadlines.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <CategoryBadge category={t.category} />
                      <PriorityBadge priority={t.priority} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        'text-xs font-medium',
                        isOverdue(t)
                          ? 'text-red-500'
                          : isDueToday(t)
                            ? 'text-amber-500'
                            : 'text-muted-foreground'
                      )}
                    >
                      {relativeDueLabel(t.dueDate!)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateShort(t.dueDate!)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent notes */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Recent Notes</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('notes')}
              className="text-muted-foreground"
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentNotes.length === 0 ? (
              <EmptyState
                icon={StickyNote}
                title="No notes yet"
                description="Create your first note to get started."
                action={
                  <Button size="sm" onClick={() => setView('notes')}>
                    <Plus className="mr-1 h-4 w-4" />
                    Add note
                  </Button>
                }
              />
            ) : (
              recentNotes.map((n) => (
                <div key={n.id} className="rounded-lg border p-3">
                  <p className="truncate text-sm font-medium">{n.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {n.content}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
