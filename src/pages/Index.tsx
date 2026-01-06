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
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useProgress } from '@/hooks/useProgress';
import { modules } from '@/data/moduleContent';

const Index = () => {
  const { darkMode, toggleDarkMode, getModuleProgress, calculateProgress } = useProgress();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-foreground">E-Modul Bagoes</h1>
              <p className="text-xs text-muted-foreground">Belajar Jadi Lebih Bagoes</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-warning" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        
        <motion.div 
          className="container mx-auto px-4 py-20 relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Ekonomi Kelas X SMA</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              <span className="text-gradient">E-Modul Bagoes</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              "Belajar Jadi Lebih <span className="text-primary font-semibold">Bagoes</span>"
            </p>
            
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Platform pembelajaran interaktif untuk memahami konsep ekonomi dengan cara yang menyenangkan dan mudah dipahami.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/modul/permintaan">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-white shadow-lg gap-2">
                  Mulai Belajar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto"
          >
            {[
              { icon: BookOpen, label: 'Modul', value: '1+' },
              { icon: Target, label: 'Tujuan', value: '7' },
              { icon: Clock, label: 'Jam Pelajaran', value: '4 JP' },
              { icon: GraduationCap, label: 'Kuis', value: '10+' },
            ].map((stat, i) => (
              <div 
                key={i}
                className="text-center p-4 rounded-2xl bg-card/50 backdrop-blur border border-border"
              >
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Modules Section */}
      <section className="py-20 bg-muted/50">
        <motion.div 
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Modul Pembelajaran
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pilih modul yang ingin kamu pelajari. Setiap modul dilengkapi dengan materi, video, dan kuis interaktif.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {modules.map((module, index) => {
              const progress = getModuleProgress(module.id);
              const progressPercent = calculateProgress(module.id, 8);
              
              return (
                <motion.div key={module.id} variants={itemVariants}>
                  <Link to={`/modul/${module.id}`}>
                    <Card className="h-full card-hover cursor-pointer border-2 hover:border-primary/50">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
                            <TrendingUp className="h-6 w-6 text-white" />
                          </div>
                          {progress.isCompleted && (
                            <span className="px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                              Selesai
                            </span>
                          )}
                        </div>
                        <CardTitle className="mt-4">{module.title}</CardTitle>
                        <CardDescription>{module.subtitle}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {module.description}
                        </p>
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

            {/* Coming Soon Card */}
            <motion.div variants={itemVariants}>
              <Card className="h-full border-2 border-dashed opacity-60">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <CardTitle className="mt-4 text-muted-foreground">Penawaran (Supply)</CardTitle>
                  <CardDescription>Coming Soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Modul tentang konsep penawaran dan kurva penawaran akan segera hadir!
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 E-Modul Bagoes. Dibuat dengan ❤️ untuk pembelajaran ekonomi yang lebih baik.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
