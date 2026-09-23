import {
  LayoutDashboard,
  CheckSquare,
  StickyNote,
  CalendarClock,
  Target,
  Settings,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';
import type { ViewKey } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useApp } from '@/hooks/use-app';

interface NavItem {
  key: ViewKey;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'tasks', label: 'Tasks', icon: CheckSquare },
  { key: 'notes', label: 'Notes', icon: StickyNote },
  { key: 'deadlines', label: 'Deadlines', icon: CalendarClock },
  { key: 'goals', label: 'Daily Goals', icon: Target },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { view, setView } = useApp();
  return (
    <aside className="hidden h-screen w-60 shrink-0 flex-col border-r bg-card lg:flex">
      <div className="flex h-16 items-center gap-2.5 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">StudyFlow</span>
          <span className="text-xs text-muted-foreground">Productivity</span>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = view === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="px-6 py-4 text-xs text-muted-foreground">
        v1.0 · Local-first
      </div>
    </aside>
  );
}
