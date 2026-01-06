import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  HelpCircle, 
  FileText, 
  Video, 
  ClipboardList, 
  CheckCircle2,
  BookMarked,
  FileCheck,
  Home,
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Module } from '@/data/moduleContent';
import { ModuleProgress } from '@/hooks/useProgress';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface ModuleSidebarProps {
  module: Module;
  currentSection?: string;
  progress: ModuleProgress;
}

const sectionIcons: Record<string, any> = {
  info: BookOpen,
  pemantik: HelpCircle,
  materi: FileText,
  video: Video,
  lkpd: ClipboardList,
  kuis: CheckCircle2,
  glosarium: BookMarked,
  refleksi: Lightbulb,
  rangkuman: FileCheck,
};

export function ModuleSidebar({ module, currentSection, progress }: ModuleSidebarProps) {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const navigationItems = [
    { id: 'info', label: 'Informasi Modul', icon: BookOpen, path: `/modul/${module.id}` },
    { id: 'pemantik', label: 'Pertanyaan Pemantik', icon: HelpCircle, path: `/modul/${module.id}/pemantik` },
    { id: 'materi', label: 'Materi Pembelajaran', icon: FileText, path: `/modul/${module.id}/materi` },
    { id: 'video', label: 'Video Pembelajaran', icon: Video, path: `/modul/${module.id}/video` },
    { id: 'lkpd', label: 'LKPD', icon: ClipboardList, path: `/modul/${module.id}/lkpd` },
    { id: 'kuis', label: 'Kuis & Latihan', icon: CheckCircle2, path: `/modul/${module.id}/kuis` },
    { id: 'glosarium', label: 'Glosarium', icon: BookMarked, path: `/modul/${module.id}/glosarium` },
    { id: 'refleksi', label: 'Refleksi', icon: Lightbulb, path: `/modul/${module.id}/refleksi` },
    { id: 'rangkuman', label: 'Rangkuman', icon: FileCheck, path: `/modul/${module.id}/rangkuman` },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isCompleted = (id: string) => progress.completedSections.includes(id);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-display font-bold text-foreground">E-Modul Bagoes</span>
              <span className="text-xs text-muted-foreground">Belajar Jadi Lebih Bagoes</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
            {!isCollapsed && 'Navigasi'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/" 
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Home className="h-4 w-4" />
                    {!isCollapsed && <span>Beranda</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
            {!isCollapsed && module.title}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                const completed = isCompleted(item.id);

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all relative",
                          active 
                            ? "bg-primary text-primary-foreground shadow-md" 
                            : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          completed && !active && "text-success"
                        )}
                      >
                        <Icon className={cn("h-4 w-4", completed && !active && "text-success")} />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1">{item.label}</span>
                            {completed && !active && (
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            )}
                            {active && (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!isCollapsed && (
        <SidebarFooter className="p-4 border-t border-sidebar-border">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{progress.completedSections.length} / 9 bagian</span>
            </div>
            <Progress 
              value={(progress.completedSections.length / 9) * 100} 
              className="h-2"
            />
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
