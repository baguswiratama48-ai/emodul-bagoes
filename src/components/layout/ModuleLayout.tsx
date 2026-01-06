import { ReactNode, useState } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { ModuleSidebar } from './ModuleSidebar';
import { ModuleHeader } from './ModuleHeader';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Module } from '@/data/moduleContent';

interface ModuleLayoutProps {
  children: ReactNode;
  module: Module;
  currentSection?: string;
}

export function ModuleLayout({ children, module, currentSection }: ModuleLayoutProps) {
  const { darkMode, toggleDarkMode, getModuleProgress } = useProgress();
  const progress = getModuleProgress(module.id);
  const totalSections = module.sections.length + 4; // sections + videos + quiz + lkpd + summary
  const completedCount = progress.completedSections.length;
  const progressPercent = Math.round((completedCount / totalSections) * 100);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ModuleSidebar 
          module={module} 
          currentSection={currentSection}
          progress={progress}
        />
        <SidebarInset className="flex-1 flex flex-col">
          <ModuleHeader 
            moduleTitle={module.title}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            progressPercent={progressPercent}
          />
          <main className="flex-1 overflow-auto">
            <div className="container max-w-4xl py-8 px-4 md:px-8">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
