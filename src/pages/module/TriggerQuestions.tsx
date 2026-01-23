import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  MessageSquare,
  Lightbulb,
  CheckCircle,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { useProgress } from '@/hooks/useProgress';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getModuleById, isPKWUModule } from '@/data/moduleUtils';
import { supabase } from '@/integrations/supabase/client';

// Trigger questions for Permintaan (Demand)
const permintaanTriggerQuestions = [
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

// Trigger questions for Penawaran (Supply)
const penawaranTriggerQuestions = [
  {
    id: 1,
    question: "Apa yang biasanya kamu lakukan jika barang yang kamu jual laku keras dan harganya naik?",
    hint: "Pikirkan tentang kesempatan untuk mendapatkan keuntungan lebih besar.",
    icon: "📈",
  },
  {
    id: 2,
    question: "Mengapa penjual tidak selalu menjual jumlah barang yang sama setiap hari?",
    hint: "Pikirkan tentang ketersediaan stok, biaya produksi, atau kondisi pasar.",
    icon: "📦",
  },
  {
    id: 3,
    question: "Selain harga, hal apa saja yang bisa membuat penjual menambah atau mengurangi barang dagangannya?",
    hint: "Ingat faktor-faktor seperti biaya produksi, teknologi, atau pajak/subsidi.",
    icon: "🏭",
  },
];

// Trigger questions for PKWU
const pkwuTriggerQuestions = [
  {
    id: 1,
    question: "Pernahkah kamu melihat sampah plastik atau kardus di sekitarmu? Menurut kamu, bisakah sampah tersebut diubah menjadi sesuatu yang berguna?",
    hint: "Pikirkan tentang kreativitas dan nilai tambah dari limbah.",
    icon: "♻️",
  },
  {
    id: 2,
    question: "Jika kamu bisa membuat kerajinan dari bahan bekas, produk apa yang ingin kamu buat dan siapa yang akan membelinya?",
    hint: "Pertimbangkan target pasar dan kebutuhan konsumen.",
    icon: "🎨",
  },
  {
    id: 3,
    question: "Mengapa menurut kamu produk ramah lingkungan (eco-friendly) semakin diminati oleh masyarakat?",
    hint: "Pikirkan tentang tren kesadaran lingkungan dan green economy.",
    icon: "🌿",
  },
];

// Trigger questions for PKWU (Sumber Daya Usaha)
const sumberDayaTriggerQuestions = [
  {
    id: 1,
    question: "Sebuah usaha kerajinan dari bahan limbah memiliki tenaga kerja terampil dan bahan baku yang mudah diperoleh, tetapi usaha tersebut tetap mengalami kerugian. Menurut analisismu, faktor apa yang paling mungkin menjadi penyebab utama masalah tersebut? Jelaskan alasan dan solusi yang dapat dilakukan.",
    hint: "Pikirkan tentang aspek 6M selain Man dan Material, seperti pengelolaan keuangan atau metode kerja.",
    icon: "📉",
  },
  {
    id: 2,
    question: "Banyak usaha kerajinan kecil berjalan tanpa pencatatan keuangan dan administrasi yang rapi. Menurut pendapatmu, apa risiko terbesar dari kondisi tersebut bagi kelangsungan usaha, dan bagaimana dampaknya terhadap pengambilan keputusan usaha di masa depan?",
    hint: "Pertimbangkan sulitnya mengetahui untung/rugi dan merencanakan pengembangan usaha tanpa data.",
    icon: "📝",
  },
  {
    id: 3,
    question: "Jika kamu ingin memulai usaha kerajinan dari bahan limbah dengan modal terbatas, bagaimana cara menentukan sasaran pasar dan strategi pemasaran yang tepat agar produk tetap diminati konsumen? Jelaskan pertimbangan yang kamu gunakan.",
    hint: "Pikirkan tentang segmentasi pasar yang spesifik dan pemasaran biaya rendah (low budget marketing).",
    icon: "🎯",
  },
];

export default function TriggerQuestions() {
  const { moduleId } = useParams();
  const { markSectionComplete } = useProgress();
  const { user } = useAuth();
  const { toast } = useToast();
  const module = getModuleById(moduleId);

  if (!module) {
    return <div className="flex items-center justify-center min-h-screen">Modul tidak ditemukan</div>;
  }

  const isPKWU = isPKWUModule(moduleId);

  let triggerQuestions = permintaanTriggerQuestions;
  if (moduleId === 'kerajinan-limbah') {
    triggerQuestions = pkwuTriggerQuestions;
  } else if (moduleId === 'pkwu-sumber-daya') {
    triggerQuestions = sumberDayaTriggerQuestions;
  } else if (moduleId === 'penawaran') {
    triggerQuestions = penawaranTriggerQuestions;
  }

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [answerIds, setAnswerIds] = useState<Record<number, string>>({});
  const [feedbackMap, setFeedbackMap] = useState<Record<number, string>>({});
  const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState<Record<number, boolean>>({});
  const [savedAnswers, setSavedAnswers] = useState<Record<number, boolean>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(true);

  // Check if already submitted and load existing answers
  useEffect(() => {
    if (user) {
      checkSubmissionStatus();
    } else {
      setLoadingCheck(false);
    }
  }, [user]);

  const checkSubmissionStatus = async () => {
    if (!user) return;

    // FETCH 'id' IS CRITICAL HERE
    const { data } = await supabase
      .from('trigger_answers')
      .select('id, question_id, answer')
      .eq('user_id', user.id)
      .eq('module_id', module.id);

    if (data && data.length > 0) {
      const loadedAnswers: Record<number, string> = {};
      const loadedSaved: Record<number, boolean> = {};
      const loadedIds: Record<number, string> = {};

      data.forEach(item => {
        loadedAnswers[item.question_id] = item.answer;
        loadedSaved[item.question_id] = true;
        loadedIds[item.question_id] = item.id;
      });
      setAnswers(loadedAnswers);
      setSavedAnswers(loadedSaved);
      setAnswerIds(loadedIds);

      // Fetch feedback
      const { data: feedbackData } = await supabase
        .from('teacher_feedback')
        .select('answer_id, feedback')
        // We use 'trigger' as answer_type for trigger answers
        .eq('answer_type', 'trigger')
        .in('answer_id', Object.values(loadedIds));

      if (feedbackData) {
        const fbMap: Record<number, string> = {};
        feedbackData.forEach((fb: any) => {
          // Find question_id matching this answer_id
          const qId = Object.keys(loadedIds).find(key => loadedIds[Number(key)] === fb.answer_id);
          if (qId) fbMap[Number(qId)] = fb.feedback;
        });
        setFeedbackMap(fbMap);
      }

      // Check if all questions are answered (meaning submitted)
      const allAnswered = triggerQuestions.every(q => loadedAnswers[q.id]?.trim());
      setHasSubmitted(allAnswered);
    }
    setLoadingCheck(false);
  };

  const handleAnswerChange = (id: number, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setSavedAnswers(prev => ({ ...prev, [id]: false }));
  };

  const saveAnswer = async (questionId: number) => {
    if (!user || !answers[questionId]?.trim()) return;

    setSaving(prev => ({ ...prev, [questionId]: true }));

    const { error } = await supabase
      .from('trigger_answers')
      .upsert({
        user_id: user.id,
        module_id: module.id,
        question_id: questionId,
        answer: answers[questionId],
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,module_id,question_id'
      });

    setSaving(prev => ({ ...prev, [questionId]: false }));

    if (error) {
      toast({
        title: 'Gagal menyimpan',
        description: 'Terjadi kesalahan saat menyimpan jawaban.',
        variant: 'destructive'
      });
    } else {
      setSavedAnswers(prev => ({ ...prev, [questionId]: true }));
      toast({
        title: 'Tersimpan',
        description: `Jawaban pertanyaan ${questionId} berhasil disimpan.`
      });
    }
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
                {hasSubmitted ? (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-foreground whitespace-pre-wrap">{answers[q.id]}</p>
                    <div className="mt-2 flex items-center gap-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Sudah dikumpulkan
                      </p>
                    </div>

                    {/* Feedback Display */}
                    {feedbackMap[q.id] && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-1 text-blue-700 dark:text-blue-400">
                          <MessageSquare className="h-4 w-4" />
                          <span className="font-medium text-sm">Feedback Guru</span>
                        </div>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          {feedbackMap[q.id]}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
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

                      <div className="flex items-center gap-2">
                        {savedAnswers[q.id] && (
                          <span className="flex items-center gap-1 text-success text-sm">
                            <CheckCircle className="h-4 w-4" />
                            Tersimpan
                          </span>
                        )}
                        <Button
                          size="sm"
                          onClick={() => saveAnswer(q.id)}
                          disabled={!answers[q.id]?.trim() || saving[q.id]}
                          className="gap-2"
                        >
                          <Save className="h-4 w-4" />
                          {saving[q.id] ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                      </div>
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
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Info */}
        <motion.div variants={itemVariants}>
          <Card className={hasSubmitted ? 'bg-success/10 border-success/30' : 'bg-accent/50 border-accent'}>
            <CardContent className="pt-6">
              {hasSubmitted ? (
                <p className="text-sm text-foreground flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <strong>Pengerjaan sudah dikumpulkan.</strong> Jawaban tidak dapat diubah. Hubungi guru untuk reset jika diperlukan.
                </p>
              ) : (
                <p className="text-sm text-foreground">
                  💡 <strong>Catatan:</strong> Tidak ada jawaban yang benar atau salah di sini.
                  Pertanyaan-pertanyaan ini bertujuan untuk membantu kamu berpikir tentang konsep
                  permintaan sebelum mempelajari materi secara mendalam.
                </p>
              )}
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