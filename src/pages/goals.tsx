import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Plus,
  Target,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/empty-state';
import { useApp } from '@/hooks/use-app';
import type { DailyGoal } from '@/lib/types';
import { cn } from '@/lib/utils';

export function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal, toggleGoal } = useApp();
  const [newTitle, setNewTitle] = useState('');
  const [editing, setEditing] = useState<DailyGoal | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const progress = useMemo(() => {
    const done = goals.filter((g) => g.completed).length;
    const pct = goals.length === 0 ? 0 : Math.round((done / goals.length) * 100);
    return { done, total: goals.length, pct };
  }, [goals]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    addGoal(trimmed);
    setNewTitle('');
    toast.success('Goal added');
  };

  const openEdit = (g: DailyGoal) => {
    setEditing(g);
    setEditTitle(g.title);
    setEditOpen(true);
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = editTitle.trim();
    if (!trimmed || !editing) return;
    updateGoal(editing.id, trimmed);
    setEditOpen(false);
    toast.success('Goal updated');
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    deleteGoal(deleteId);
    toast.success('Goal deleted');
    setDeleteId(null);
  };

  const handleToggle = (g: DailyGoal) => {
    toggleGoal(g.id);
    toast.success(g.completed ? 'Goal uncompleted' : 'Goal completed');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Daily Goals</h1>
        <p className="text-sm text-muted-foreground">
          Set small wins for today and track your progress.
        </p>
      </div>

      {/* Progress card */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex items-center gap-4">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
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
                  className="stroke-primary transition-all duration-500"
                  strokeDasharray={`${(progress.pct / 100) * 97.4} 97.4`}
                />
              </svg>
              <span className="absolute text-lg font-semibold">
                {progress.pct}%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">Today's Progress</p>
              <p className="text-2xl font-semibold tracking-tight">
                {progress.done} / {progress.total}
              </p>
              <p className="text-xs text-muted-foreground">goals completed</p>
            </div>
          </div>
          <div className="flex-1">
            <Progress value={progress.pct} className="h-2.5" />
            <p className="mt-2 text-xs text-muted-foreground">
              {progress.pct === 100 && progress.total > 0
                ? 'All goals completed. Great work!'
                : 'Keep going — every completed goal counts.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Add goal */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new goal for today..."
        />
        <Button type="submit" disabled={!newTitle.trim()}>
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </form>

      {/* List */}
      {goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals for today"
          description="Add a goal above to start tracking your progress."
        />
      ) : (
        <div className="space-y-2">
          {goals.map((g) => (
            <Card key={g.id} className="transition-colors hover:bg-accent/30">
              <CardContent className="flex items-center gap-3 p-4">
                <button
                  onClick={() => handleToggle(g)}
                  className="shrink-0"
                  aria-label={
                    g.completed ? 'Mark as incomplete' : 'Mark as complete'
                  }
                >
                  {g.completed ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                </button>
                <p
                  className={cn(
                    'min-w-0 flex-1 text-sm font-medium',
                    g.completed && 'text-muted-foreground line-through'
                  )}
                >
                  {g.title}
                </p>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(g)}
                    aria-label="Edit goal"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(g.id)}
                    aria-label="Delete goal"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit goal</DialogTitle>
            <DialogDescription>Update the goal title.</DialogDescription>
          </DialogHeader>
          <form onSubmit={saveEdit} className="space-y-4">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              autoFocus
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(v) => !v && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this goal?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
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
