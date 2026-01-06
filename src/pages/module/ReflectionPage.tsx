import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Save, CheckCircle2, Lightbulb } from 'lucide-react';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { demandModule } from '@/data/moduleContent';
import { useProgress } from '@/hooks/useProgress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const reflectionQuestions = [
  {
    id: 1,
    question: 'Apa hal baru yang kamu pelajari dari modul ini tentang konsep permintaan?',
    hint: 'Pikirkan tentang pengertian, hukum, dan faktor-faktor yang mempengaruhi permintaan.',
  },
  {
    id: 2,
    question: 'Bagaimana kamu bisa menerapkan konsep permintaan dalam kehidupan sehari-hari?',
    hint: 'Contoh: saat berbelanja, mengamati harga di pasar, atau memahami perilaku konsumen.',
  },
  {
    id: 3,
    question: 'Bagian mana dari materi ini yang menurutmu paling menantang? Mengapa?',
    hint: 'Identifikasi kesulitan untuk bisa mencari bantuan atau belajar lebih dalam.',
  },
  {
    id: 4,
    question: 'Apa pertanyaan yang masih kamu miliki tentang permintaan dan kurva permintaan?',
    hint: 'Tidak apa-apa jika masih ada yang belum dipahami, itu bagian dari proses belajar.',
  },
];

export default function ReflectionPage() {
  const { moduleId } = useParams();
  const module = demandModule;
  const { markSectionComplete } = useProgress();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [savedAnswers, setSavedAnswers] = useState<Record<number, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch existing answers
  useEffect(() => {
    const fetchAnswers = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('trigger_answers')
          .select('question_id, answer')
          .eq('user_id', user.id)
          .eq('module_id', `${moduleId}-refleksi`);

        if (error) throw error;

        const answersMap: Record<number, string> = {};
        data?.forEach((item) => {
          answersMap[item.question_id] = item.answer;
        });
        setAnswers(answersMap);
        setSavedAnswers(answersMap);
      } catch (error) {
        console.error('Error fetching reflection answers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnswers();
  }, [user, moduleId]);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Kamu harus login untuk menyimpan jawaban",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      for (const [questionId, answer] of Object.entries(answers)) {
        if (!answer.trim()) continue;

        const { error } = await supabase
          .from('trigger_answers')
          .upsert({
            user_id: user.id,
            module_id: `${moduleId}-refleksi`,
            question_id: parseInt(questionId),
            answer: answer.trim(),
          }, {
            onConflict: 'user_id,module_id,question_id',
          });

        if (error) throw error;
      }

      setSavedAnswers({ ...answers });
      markSectionComplete(moduleId || 'permintaan', 'refleksi');
      
      toast({
        title: "Berhasil!",
        description: "Jawaban refleksi berhasil disimpan",
      });
    } catch (error) {
      console.error('Error saving reflection answers:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan jawaban",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const allAnswered = reflectionQuestions.every(q => answers[q.id]?.trim());
  const hasChanges = JSON.stringify(answers) !== JSON.stringify(savedAnswers);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (!module) {
    return <div>Module not found</div>;
  }

  return (
    <ModuleLayout module={module} currentSection="refleksi">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white mb-4">
            <Lightbulb className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Refleksi Pembelajaran
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Luangkan waktu untuk merefleksikan apa yang telah kamu pelajari. 
            Refleksi membantu memperdalam pemahaman dan mengidentifikasi area yang perlu dipelajari lebih lanjut.
          </p>
        </motion.div>

        {/* Reflection Questions */}
        <motion.div variants={itemVariants} className="space-y-6">
          {reflectionQuestions.map((item, index) => (
            <Card key={item.id} className="border-l-4 border-l-amber-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span>{item.question}</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground ml-11">
                  💡 {item.hint}
                </p>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={answers[item.id] || ''}
                  onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                  placeholder="Tulis jawabanmu di sini..."
                  className="min-h-[120px] resize-none"
                  disabled={isLoading}
                />
                {savedAnswers[item.id] && answers[item.id] === savedAnswers[item.id] && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Tersimpan</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Save Button */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            size="lg"
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Menyimpan...' : 'Simpan Refleksi'}
          </Button>
        </motion.div>

        {/* Completion Message */}
        {allAnswered && !hasChanges && (
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 text-center"
          >
            <CheckCircle2 className="h-12 w-12 text-amber-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Refleksi Selesai! 🎉
            </h3>
            <p className="text-muted-foreground">
              Terima kasih telah meluangkan waktu untuk merefleksikan pembelajaran. 
              Kamu bisa melanjutkan ke rangkuman modul.
            </p>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div variants={itemVariants} className="flex justify-between pt-6">
          <Button variant="outline" asChild>
            <Link to={`/modul/${moduleId}/glosarium`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Glosarium
            </Link>
          </Button>
          <Button asChild>
            <Link to={`/modul/${moduleId}/rangkuman`}>
              Rangkuman
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </ModuleLayout>
  );
}
