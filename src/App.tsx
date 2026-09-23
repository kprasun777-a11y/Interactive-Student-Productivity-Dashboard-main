import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { AppProvider, useApp } from '@/hooks/use-app';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { MobileNav } from '@/components/layout/mobile-nav';
import { DashboardPage } from '@/pages/dashboard';
import { TasksPage } from '@/pages/tasks';
import { NotesPage } from '@/pages/notes';
import { DeadlinesPage } from '@/pages/deadlines';
import { GoalsPage } from '@/pages/goals';
import { SettingsPage } from '@/pages/settings';
import { TooltipProvider } from '@/components/ui/tooltip';

function Shell() {
  const { view } = useApp();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {view === 'dashboard' && <DashboardPage />}
            {view === 'tasks' && <TasksPage />}
            {view === 'notes' && <NotesPage />}
            {view === 'deadlines' && <DeadlinesPage />}
            {view === 'goals' && <GoalsPage />}
            {view === 'settings' && <SettingsPage />}
          </div>
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <TooltipProvider>
        <Shell />
      </TooltipProvider>
    </AppProvider>
  );
}
