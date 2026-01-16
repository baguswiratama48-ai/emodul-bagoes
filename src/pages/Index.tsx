import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  TrendingUp,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  GraduationCap,
  Target,
  Clock,
  LogOut,
  Settings,
  User,
  Recycle,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useProgress } from '@/hooks/useProgress';
import { useAuth } from '@/hooks/useAuth';
import { ekonomiModules } from '@/data/moduleContent';
import { pkwuModule } from '@/data/pkwuModuleContent';
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo.png';

const Index = () => {
  const { darkMode, toggleDarkMode, getModuleProgress } = useProgress(); // Removed calculateProgress
  const { user, role, signOut, isGuru } = useAuth();
  const [userKelas, setUserKelas] = useState<string | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchUserKelas = async () => {
      if (user?.id) {
        const { data } = await supabase
          .from('profiles')
          .select('kelas')
          .eq('id', user.id)
          .single();
        setUserKelas(data?.kelas || null);
      }
    };
    fetchUserKelas();
  }, [user?.id]);

  const { availableModules, mapelName, mapelKelas } = useMemo(() => {
    const isKelasX = userKelas?.startsWith('X.');
    const isKelasXI = userKelas?.startsWith('XI.');

    if (isGuru) {
      return { availableModules: [...ekonomiModules, pkwuModule], mapelName: 'Semua Mapel', mapelKelas: 'Guru' };
    }
    if (isKelasX) {
      return { availableModules: ekonomiModules, mapelName: 'Ekonomi', mapelKelas: `Kelas ${userKelas}` };
    }
    if (isKelasXI) {
      return { availableModules: [pkwuModule], mapelName: 'PKWU', mapelKelas: `Kelas ${userKelas}` };
    }
    return { availableModules: [...ekonomiModules, pkwuModule], mapelName: 'E-Modul', mapelKelas: '' };
  }, [userKelas, isGuru]);

  // Fetch real progress from database
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;

      const newProgressMap: Record<string, number> = {};

      for (const module of availableModules) {
        // 1. Quiz Answers
        const { count: quizCount } = await supabase
          .from('quiz_answers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('module_id', module.id);

        // 2. LKPD Answers
        const { count: lkpdCount } = await supabase
          .from('lkpd_answers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('module_id', module.id);

        // 3. Trigger Answers (Pemantik)
        const { count: triggerCount } = await supabase
          .from('trigger_answers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('module_id', module.id);

        // 4. Reflection Answers (Refleksi) - stored with suffix '-refleksi'
        const { count: reflectionCount } = await supabase
          .from('trigger_answers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('module_id', `${module.id}-refleksi`);

        const totalCompleted = (quizCount || 0) + (lkpdCount || 0) + (triggerCount || 0) + (reflectionCount || 0);
        // Total items = 10 Quiz + 4 LKPD + 3 Pemantik + 5 Refleksi = 22
        const percentage = Math.round((totalCompleted / 22) * 100);

        newProgressMap[module.id] = Math.min(percentage, 100);
      }

      setProgressMap(newProgressMap);
    };

    fetchProgress();
  }, [user, availableModules]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="E-Modul Bagoes" className="h-10 w-auto rounded-xl" />
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-foreground">E-Modul Bagoes</h1>
              <p className="text-xs text-muted-foreground">Belajar Jadi Lebih Bagoes</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user?.user_metadata?.full_name || user?.email}</span>
                <Badge variant={isGuru ? 'default' : 'secondary'} className="text-xs">
                  {role === 'guru' ? 'Guru' : 'Siswa'}
                </Badge>
              </div>
            </div>

            {isGuru ? (
              <Link to="/guru">
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard Guru (v2)</span>
                </Button>
              </Link>
            ) : (
              <Link to="/siswa">
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard Saya</span>
                </Button>
              </Link>
            )}

            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full">
              {darkMode ? <Sun className="h-5 w-5 text-warning" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button variant="ghost" size="icon" onClick={signOut} className="rounded-full text-muted-foreground hover:text-destructive">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

        <motion.div className="container mx-auto px-4 py-20 relative z-10" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>{mapelName} {mapelKelas}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              <span className="text-gradient">E-Modul Bagoes</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              "Belajar Jadi Lebih <span className="text-primary font-semibold">Bagoes</span>"
            </p>

            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Platform pembelajaran interaktif untuk memahami konsep {mapelName === 'PKWU' ? 'prakarya dan kewirausahaan' : 'ekonomi'} dengan cara yang menyenangkan.
            </p>

            {/* Buttons removed as requested */}
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            {[
              { icon: BookOpen, label: 'Modul', value: `${availableModules.length}+` },
              { icon: Target, label: 'Tujuan', value: '7' },
              { icon: Clock, label: 'Jam Pelajaran', value: '4 JP' },
              { icon: GraduationCap, label: 'Kuis', value: '10+' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-2xl bg-card/50 backdrop-blur border border-border">
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="py-20 bg-muted/50">
        <motion.div className="container mx-auto px-4" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Modul Pembelajaran</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pilih modul yang ingin kamu pelajari. Setiap modul dilengkapi dengan materi, video, dan kuis interaktif.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {availableModules.map((module) => {
              const progress = getModuleProgress(module.id);
              // Use real DB progress if available, fallback to 0
              const progressPercent = progressMap[module.id] || 0;
              const isPKWU = module.id === 'kerajinan-limbah';

              return (
                <motion.div key={module.id} variants={itemVariants}>
                  <Link to={`/modul/${module.id}`}>
                    <Card className="h-full card-hover cursor-pointer border-2 hover:border-primary/50">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${isPKWU ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-primary'}`}>
                            {isPKWU ? <Recycle className="h-6 w-6 text-white" /> : <TrendingUp className="h-6 w-6 text-white" />}
                          </div>
                          {progress.isCompleted && (
                            <span className="px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">Selesai</span>
                          )}
                        </div>
                        <CardTitle className="mt-4">{module.title}</CardTitle>
                        <CardDescription>{module.subtitle}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{module.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{progressPercent}%</span>
                          </div>
                          <Progress value={progressPercent} className="h-2" />
                        </div>
                        <div className="flex items-center gap-2 mt-4 text-sm text-primary font-medium">
                          <span>Mulai Belajar</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 E-Modul Bagoes. Dibuat dengan ❤️ untuk pembelajaran yang lebih baik.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
