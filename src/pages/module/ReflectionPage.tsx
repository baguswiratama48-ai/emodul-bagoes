import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Save, CheckCircle2, Lightbulb, MessageSquare } from 'lucide-react';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { getModuleById, isPKWUModule } from '@/data/moduleUtils';
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
    question: 'Bagaimana perasaanmu belajar hari ini?',
    hint: 'Ceritakan perasaanmu selama mengikuti pembelajaran.',
  },
  {
    id: 2,
    question: 'Apa yang kamu sukai dari pembelajaran hari ini?',
    hint: 'Bagian mana yang paling menarik atau menyenangkan.',
  },
  {
    id: 3,
    question: 'Menurut Anda bagaimana belajar menggunakan media e-modul ini?',
    hint: 'Berikan pendapatmu tentang pengalaman belajar dengan e-modul.',
  },
  {
    id: 4,
    question: 'Apa yang perlu ditambahkan dari media pembelajaran e-modul ini?',
    hint: 'Saran untuk pengembangan e-modul ke depannya.',
  },
  {
    id: 5,
    question: 'Apa yang kamu sukai dari Bapak Bagus Panca Wiratama, S.Pd., M.Pd.? (Boleh Kritik dan Saran)',
    hint: 'Berikan feedback jujur untuk guru.',
  },
];

export default function ReflectionPage() {
  const { moduleId } = useParams();
  const module = getModuleById(moduleId);
  const { markSectionComplete } = useProgress();
  const { toast } = useToast();
  const { user } = useAuth();

  if (!module) {
    return <div className="flex items-center justify-center min-h-screen">Modul tidak ditemukan</div>;
  }

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [savedAnswers, setSavedAnswers] = useState<Record<number, string>>({});
  const [answerIds, setAnswerIds] = useState<Record<number, string>>({}); // Store IDs for feedback
  const [feedbackMap, setFeedbackMap] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Use module-specific questions if available, otherwise use default
  const questionsToUse = module?.reflectionQuestions || reflectionQuestions;

  // Fetch existing answers
  useEffect(() => {
    const fetchAnswers = async () => {
      if (!user) return;

      try {
        // Fetch ID as well
        const { data, error } = await supabase
          .from('trigger_answers')
          .select('id, question_id, answer')
          .eq('user_id', user.id)
          .eq('module_id', `${moduleId}-refleksi`);

        if (error) throw error;

        const answersMap: Record<number, string> = {};
        const idsMap: Record<number, string> = {};

        data?.forEach((item) => {
          answersMap[item.question_id] = item.answer;
          idsMap[item.question_id] = item.id;
        });
        setAnswers(answersMap);
        setSavedAnswers(answersMap);
        setAnswerIds(idsMap);

        // Fetch Feedback
        if (data && data.length > 0) {
          const { data: feedbackData } = await supabase
            .from('teacher_feedback')
            .select('answer_id, feedback')
            .eq('answer_type', 'reflection') // Corrected to reflection
            .in('answer_id', Object.values(idsMap));

          if (feedbackData) {
            const fbMap: Record<number, string> = {};
            feedbackData.forEach((fb: any) => {
              const qId = Object.keys(idsMap).find(key => idsMap[Number(key)] === fb.answer_id);
              if (qId) fbMap[Number(qId)] = fb.feedback;
            });
            setFeedbackMap(fbMap);
          }
        }

        // Check if all questions are answered (meaning submitted)
        const allAnswered = questionsToUse.every(q => answersMap[q.id]?.trim());
        setHasSubmitted(allAnswered);
      } catch (error) {
        console.error('Error fetching reflection answers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnswers();
  }, [user, moduleId, questionsToUse]);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSave = async (questionId: number) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Kamu harus login untuk menyimpan jawaban",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setSaving(prev => ({ ...prev, [questionId]: true }));

    try {
      const answer = answers[questionId];
      if (!answer?.trim()) return;

      const { error } = await supabase
        .from('trigger_answers')
        .upsert({
          user_id: user.id,
          module_id: `${moduleId}-refleksi`,
          question_id: questionId,
          answer: answer.trim(),
        }, {
          onConflict: 'user_id,module_id,question_id',
        });

      if (error) throw error;

      setSavedAnswers(prev => ({ ...prev, [questionId]: answer }));

      toast({
        title: "Tersimpan",
        description: "Jawaban berhasil disimpan",
        duration: 2000,
      });

    } catch (error) {
      console.error('Error saving reflection answer:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan jawaban",
        variant: "destructive",
      });
    } finally {
      setSaving(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const allAnswered = questionsToUse.every(q => answers[q.id]?.trim());
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
            Refleksi Pembelajaran v2
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Luangkan waktu untuk merefleksikan apa yang telah kamu pelajari.
            Refleksi membantu memperdalam pemahaman dan mengidentifikasi area yang perlu dipelajari lebih lanjut.
          </p>
        </motion.div>

        {/* Reflection Questions */}
        <motion.div variants={itemVariants} className="space-y-6">
          {questionsToUse.map((item, index) => (
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
                {hasSubmitted ? (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="whitespace-pre-wrap">{answers[item.id]}</p>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Sudah dikumpulkan
                    </p>
                    {feedbackMap[item.id] && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-1 text-blue-700 dark:text-blue-400">
                          <MessageSquare className="h-4 w-4" />
                          <span className="font-medium text-sm">Feedback Guru</span>
                        </div>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          {feedbackMap[item.id]}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Textarea
                      value={answers[item.id] || ''}
                      onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                      placeholder="Tulis jawabanmu di sini..."
                      className="min-h-[120px] resize-none"
                      disabled={isLoading}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        {savedAnswers[item.id] && (
                          <div className="flex items-center gap-2 text-sm text-success">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Tersimpan</span>
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleSave(item.id)}
                        disabled={!answers[item.id]?.trim() || saving[item.id]}
                        className="gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {saving[item.id] ? 'Menyimpan...' : 'Simpan'}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
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
