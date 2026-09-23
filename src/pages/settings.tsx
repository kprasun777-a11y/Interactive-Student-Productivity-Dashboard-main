import { useState } from 'react';
import { toast } from 'sonner';
import { Moon, Sun, Trash2, RotateCcw, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
import { useApp } from '@/hooks/use-app';

export function SettingsPage() {
  const { theme, setTheme, clearAllData, resetToSample, tasks, notes, goals } =
    useApp();
  const [clearOpen, setClearOpen] = useState(false);

  const handleClear = () => {
    clearAllData();
    setClearOpen(false);
    toast.success('All data cleared');
  };

  const handleReset = () => {
    resetToSample();
    toast.success('Demo data restored');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your preferences and data.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Theme preference</CardTitle>
          <CardDescription>
            Choose how the dashboard looks. Your choice is remembered.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? (
              <Moon className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Sun className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <Label htmlFor="theme-switch" className="text-sm font-medium">
                {theme === 'dark' ? 'Dark mode' : 'Light mode'}
              </Label>
              <p className="text-xs text-muted-foreground">
                Toggle to switch appearance
              </p>
            </div>
          </div>
          <Switch
            id="theme-switch"
            checked={theme === 'dark'}
            onCheckedChange={(v) => setTheme(v ? 'dark' : 'light')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data management</CardTitle>
          <CardDescription>
            Your data is stored locally in your browser. Currently:{' '}
            {tasks.length} tasks, {notes.length} notes, {goals.length} goals.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to demo data
          </Button>
          <Button
            variant="outline"
            onClick={() => setClearOpen(true)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear all data
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">About</CardTitle>
          <CardDescription>
            StudyFlow — a student productivity dashboard built with React,
            TypeScript and Tailwind CSS. All data lives in your browser's
            local storage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SettingsIcon className="h-4 w-4" />
            Version 1.0 · Local-first · No account required
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={clearOpen} onOpenChange={setClearOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your tasks, notes and goals.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClear}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, clear everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
