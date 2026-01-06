import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft,
  MessageCircle,
  Lightbulb,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { useProgress } from '@/hooks/useProgress';
import { demandModule } from '@/data/moduleContent';

const triggerQuestions = [
  {
    id: 1,
    question: "Pernahkah kamu memperhatikan saat ada diskon besar-besaran, mengapa orang jadi lebih banyak membeli?",
    hint: "Pikirkan hubungan antara harga dan keinginan membeli.",
    icon: "🛒",
  },
  {
    id: 2,
    question: "Jika uang sakumu naik 2x lipat, apakah kamu akan membeli lebih banyak jajanan? Mengapa?",
    hint: "Pertimbangkan pengaruh pendapatan terhadap keputusan belanja.",
    icon: "💰",
  },
  {
    id: 3,
    question: "Ketika harga pulsa mahal, apa yang biasanya kamu lakukan? Apakah mencari alternatif lain?",
    hint: "Pikirkan tentang barang pengganti (substitusi).",
    icon: "📱",
  },
];

export default function TriggerQuestions() {
  const { moduleId } = useParams();
  const { markSectionComplete } = useProgress();
  const module = demandModule;
  
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());

  const handleAnswerChange = (id: number, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const toggleHint = (id: number) => {
    setRevealedHints(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleComplete = () => {
    markSectionComplete(module.id, 'pemantik');
  };

  const answeredCount = Object.values(answers).filter(a => a.trim().length > 0).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <ModuleLayout module={module} currentSection="pemantik">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm mb-4">
            <HelpCircle className="h-4 w-4" />
            <span>Pertanyaan Pemantik</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Mari Berpikir! 🤔
          </h1>
          <p className="text-muted-foreground">
            Sebelum masuk ke materi, coba jawab pertanyaan-pertanyaan berikut untuk memancing rasa ingin tahumu!
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div variants={itemVariants}>
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <span className="text-foreground font-medium">Refleksi Awal</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {answeredCount} dari {triggerQuestions.length} terjawab
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Questions */}
        {triggerQuestions.map((q, index) => (
          <motion.div key={q.id} variants={itemVariants}>
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardTitle className="flex items-start gap-4">
                  <span className="text-3xl">{q.icon}</span>
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">
                      Pertanyaan {index + 1}
                    </span>
                    <span className="text-lg font-medium text-foreground leading-relaxed">
                      {q.question}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <Textarea
                  placeholder="Tuliskan jawabanmu di sini..."
                  className="min-h-[100px] resize-none"
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                />
                
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleHint(q.id)}
                    className="text-muted-foreground hover:text-foreground gap-2"
                  >
                    <Lightbulb className="h-4 w-4" />
                    {revealedHints.has(q.id) ? 'Sembunyikan Petunjuk' : 'Lihat Petunjuk'}
                  </Button>
                  
                  {answers[q.id]?.trim() && (
                    <span className="flex items-center gap-1 text-success text-sm">
                      <CheckCircle className="h-4 w-4" />
                      Terjawab
                    </span>
                  )}
                </div>

                {revealedHints.has(q.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-lg bg-warning/10 border border-warning/20"
                  >
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">{q.hint}</p>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Info */}
        <motion.div variants={itemVariants}>
          <Card className="bg-accent/50 border-accent">
            <CardContent className="pt-6">
              <p className="text-sm text-foreground">
                💡 <strong>Catatan:</strong> Tidak ada jawaban yang benar atau salah di sini. 
                Pertanyaan-pertanyaan ini bertujuan untuk membantu kamu berpikir tentang konsep 
                permintaan sebelum mempelajari materi secara mendalam.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div variants={itemVariants} className="flex justify-between items-center pt-8 border-t border-border">
          <Link to={`/modul/${module.id}`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </Link>
          <Link to={`/modul/${module.id}/materi`}>
            <Button 
              onClick={handleComplete}
              className="gap-2 bg-gradient-primary hover:opacity-90"
            >
              Lanjut ke Materi
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </ModuleLayout>
  );
}
