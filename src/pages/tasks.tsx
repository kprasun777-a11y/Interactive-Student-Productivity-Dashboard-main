import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  CheckSquare,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { TaskFormModal } from '@/components/task-form-modal';
import { PriorityBadge, CategoryBadge } from '@/components/badges';
import { EmptyState } from '@/components/empty-state';
import { useApp } from '@/hooks/use-app';
import type { Task, Priority } from '@/lib/types';
import {
  isOverdue,
  formatDate,
  relativeDueLabel,
  PRIORITY_WEIGHT,
} from '@/lib/date';
import { cn } from '@/lib/utils';

type StatusFilter = 'all' | 'active' | 'completed' | 'overdue';
type SortKey = 'newest' | 'oldest' | 'due' | 'priority';

export function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useApp();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [priority, setPriority] = useState<'all' | Priority>('all');
  const [sort, setSort] = useState<SortKey>('newest');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = tasks.filter((t) => {
      if (q) {
        const hay = `${t.title} ${t.description} ${t.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (priority !== 'all' && t.priority !== priority) return false;
      if (status === 'active' && t.completed) return false;
      if (status === 'completed' && !t.completed) return false;
      if (status === 'overdue' && !isOverdue(t)) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'newest':
          return b.createdAt < a.createdAt ? -1 : 1;
        case 'oldest':
          return a.createdAt < b.createdAt ? -1 : 1;
        case 'due':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate < b.dueDate ? -1 : 1;
        case 'priority':
          return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
      }
    });
    return list;
  }, [tasks, search, status, priority, sort]);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (t: Task) => {
    setEditing(t);
    setFormOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    deleteTask(deleteId);
    toast.success('Task deleted');
    setDeleteId(null);
  };

  const handleToggle = (t: Task) => {
    toggleTask(t.id);
    toast.success(t.completed ? 'Task marked active' : 'Task completed');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Manage, search and track everything on your plate.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-1 h-4 w-4" />
          New task
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description or category..."
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-3 gap-2 lg:flex lg:w-auto">
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as StatusFilter)}
          >
            <SelectTrigger className="lg:w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={priority}
            onValueChange={(v) => setPriority(v as 'all' | Priority)}
          >
            <SelectTrigger className="lg:w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="lg:w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="due">Due date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title={tasks.length === 0 ? 'No tasks yet' : 'No tasks found'}
          description={
            tasks.length === 0
              ? 'Create your first task to start organizing your work.'
              : 'Try adjusting your search or filters.'
          }
          action={
            tasks.length === 0 ? (
              <Button onClick={openNew}>
                <Plus className="mr-1 h-4 w-4" />
                New task
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setStatus('all');
                  setPriority('all');
                }}
              >
                Clear filters
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((t) => {
            const overdue = isOverdue(t);
            return (
              <Card
                key={t.id}
                className={cn(
                  'transition-colors hover:bg-accent/30',
                  overdue && 'border-red-500/40 bg-red-500/5'
                )}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <Checkbox
                    checked={t.completed}
                    onCheckedChange={() => handleToggle(t)}
                    className="mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        className={cn(
                          'text-sm font-medium',
                          t.completed && 'text-muted-foreground line-through'
                        )}
                      >
                        {t.title}
                      </p>
                      <CategoryBadge category={t.category} />
                      <PriorityBadge priority={t.priority} />
                      {overdue && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500">
                          <AlertTriangle className="h-3 w-3" />
                          Overdue
                        </span>
                      )}
                    </div>
                    {t.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t.description}
                      </p>
                    )}
                    {t.dueDate && (
                      <p
                        className={cn(
                          'mt-1.5 text-xs',
                          overdue
                            ? 'text-red-500'
                            : 'text-muted-foreground'
                        )}
                      >
                        Due {formatDate(t.dueDate)} ·{' '}
                        {relativeDueLabel(t.dueDate)}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(t)}
                      aria-label="Edit task"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(t.id)}
                      aria-label="Delete task"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <TaskFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
      />

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(v) => !v && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The task will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
