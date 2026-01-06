import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Target, 
  Clock, 
  BookOpen, 
  CheckCircle2,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { useProgress } from '@/hooks/useProgress';
import { demandModule } from '@/data/moduleContent';

export default function ModuleInfo() {
  const { moduleId } = useParams();
  const { markSectionComplete, getModuleProgress } = useProgress();
  const module = demandModule; // For now, only one module
  const progress = getModuleProgress(module.id);

  const handleComplete = () => {
    markSectionComplete(module.id, 'info');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <ModuleLayout module={module} currentSection="info">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm mb-4">
            <BookOpen className="h-4 w-4" />
            <span>Ekonomi Kelas X</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            {module.title}
          </h1>
          <p className="text-xl text-muted-foreground">{module.subtitle}</p>
        </motion.div>

        {/* Description */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="pt-6">
              <p className="text-foreground leading-relaxed">
                {module.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Info */}
        <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alokasi Waktu</p>
                <p className="font-semibold text-foreground">{module.duration}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-secondary/20 border-secondary/30">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Target className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tujuan Pembelajaran</p>
                <p className="font-semibold text-foreground">{module.objectives.length} Tujuan</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Prerequisites */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-warning" />
                Kompetensi Awal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Sebelum mempelajari modul ini, pastikan kamu sudah memahami:
              </p>
              <ul className="space-y-2">
                {module.prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{prereq}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Learning Objectives */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Tujuan Pembelajaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Setelah mempelajari modul ini, kamu diharapkan mampu:
              </p>
              <ul className="space-y-3">
                {module.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-foreground">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Understanding */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-gradient">Pemahaman Bermakna</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">
                Memahami konsep permintaan sangat penting karena permintaan adalah salah satu 
                kekuatan utama yang menggerakkan pasar. Dengan memahami bagaimana permintaan 
                bekerja, kamu dapat menganalisis perilaku konsumen, memprediksi perubahan harga, 
                dan membuat keputusan ekonomi yang lebih baik dalam kehidupan sehari-hari.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div variants={itemVariants} className="flex justify-between items-center pt-8 border-t border-border">
          <div />
          <Link to={`/modul/${module.id}/pemantik`}>
            <Button 
              onClick={handleComplete}
              className="gap-2 bg-gradient-primary hover:opacity-90"
            >
              Lanjut ke Pertanyaan Pemantik
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </ModuleLayout>
  );
}
