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
import { getModuleById, isPKWUModule } from '@/data/moduleUtils';

export default function ModuleInfo() {
  const { moduleId } = useParams();
  const { markSectionComplete, getModuleProgress } = useProgress();
  const module = getModuleById(moduleId);

  if (!module) {
    return <div className="flex items-center justify-center min-h-screen">Modul tidak ditemukan</div>;
  }

  const progress = getModuleProgress(module.id);
  const isPKWU = isPKWUModule(moduleId);

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
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm mb-4 ${isPKWU ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-accent text-accent-foreground'}`}>
            <BookOpen className="h-4 w-4" />
            <span>{isPKWU ? 'PKWU Kelas XI' : 'Ekonomi Kelas X'}</span>
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
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Alokasi Waktu</p>
                  <p className="font-semibold text-foreground">{module.duration}</p>
                </div>
              </div>

              {module.model && (
                <div className="flex items-center gap-4 pt-2 border-t border-primary/10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Model Pembelajaran</p>
                    <p className="font-semibold text-foreground">{module.model}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-secondary/20 border-secondary/30">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Target className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tujuan Pembelajaran</p>
                  <p className="font-semibold text-foreground">{module.objectives.length} Tujuan</p>
                </div>
              </div>

              {module.product && (
                <div className="flex items-center gap-4 pt-2 border-t border-secondary/20">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Produk Akhir</p>
                    <p className="font-semibold text-foreground">{module.product}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Metadata (if available) */}
        {(module.level || module.phase || module.lessonNumber || module.activity) && (
          <motion.div variants={itemVariants}>
            <Card className="bg-muted/30">
              <CardContent className="pt-6 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {module.level && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Kelas/Fase</p>
                    <p className="font-medium">{module.level} {module.phase ? `/ ${module.phase}` : ''}</p>
                  </div>
                )}
                {module.lessonNumber && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Materi Ke</p>
                    <p className="font-medium">{module.lessonNumber}</p>
                  </div>
                )}
                {module.activity && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Bentuk Kegiatan</p>
                    <p className="font-medium">{module.activity}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

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
          <Card className={`bg-gradient-to-br ${isPKWU ? 'from-green-500/5 to-emerald-500/5 border-green-500/20' : 'from-primary/5 to-secondary/5 border-primary/20'}`}>
            <CardHeader>
              <CardTitle className={isPKWU ? 'text-green-700 dark:text-green-300' : 'text-gradient'}>Pemahaman Bermakna</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">
                {module.meaningfulUnderstanding || (isPKWU
                  ? 'Limbah bukanlah akhir dari sebuah materi, melainkan awal dari peluang ekonomi yang berkelanjutan. Kreativitas dan analisis pasar yang tajam memungkinkan kita mengubah sampah yang tidak bernilai menjadi sumber penghasilan yang berharga (green economy) melalui inovasi kerajinan.'
                  : 'Memahami konsep permintaan sangat penting karena permintaan adalah salah satu kekuatan utama yang menggerakkan pasar. Dengan memahami bagaimana permintaan bekerja, kamu dapat menganalisis perilaku konsumen, memprediksi perubahan harga, dan membuat keputusan ekonomi yang lebih baik dalam kehidupan sehari-hari.')}
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
