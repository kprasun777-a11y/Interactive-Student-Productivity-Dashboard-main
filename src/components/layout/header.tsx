import { Menu, Moon, Sun } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useApp } from '@/hooks/use-app';
import { greeting } from '@/lib/date';

export function Header({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const { theme, toggleTheme } = useApp();
  const now = new Date();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenMobileNav}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex flex-col">
          <span className="text-base font-semibold leading-tight">
            {greeting()}, Student
          </span>
          <span className="text-xs text-muted-foreground">
            {format(now, 'EEEE, MMMM d, yyyy')}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          S
        </div>
      </div>
    </header>
  );
}
