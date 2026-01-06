import { Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface ModuleHeaderProps {
  moduleTitle: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  progressPercent: number;
}

export function ModuleHeader({ 
  moduleTitle, 
  darkMode, 
  onToggleDarkMode, 
  progressPercent 
}: ModuleHeaderProps) {
  return (
    <header className="sticky top-0 z-40 glass border-b border-border">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
          <div className="hidden sm:block">
            <h1 className="font-display font-semibold text-foreground">{moduleTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress indicator */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{progressPercent}%</span>
            <Progress value={progressPercent} className="w-24 h-2" />
          </div>

          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            className="rounded-full"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-warning" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
