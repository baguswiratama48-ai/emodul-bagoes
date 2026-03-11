import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileCheck,
  ArrowLeft,
  CheckCircle2,
  Home,
  Trophy,
  Sparkles,
  Save,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { useProgress } from '@/hooks/useProgress';
import { getModuleById, isPKWUModule } from '@/data/moduleUtils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import confetti from 'canvas-confetti';

// Summary for Ekonomi (Permintaan)
const permintaanSummaryPoints = [
  {
    title: "Pengertian Permintaan",
    content: "Permintaan adalah jumlah barang/jasa yang ingin dan mampu dibeli konsumen pada berbagai tingkat harga dalam periode waktu tertentu."
  },
  {
    title: "Hukum Permintaan",
    content: "Jika harga naik → permintaan turun. Jika harga turun → permintaan naik (ceteris paribus)."
  },
  {
    title: "Kurva Permintaan",
    content: "Kurva berslope negatif yang menunjukkan hubungan terbalik antara harga dan jumlah yang diminta."
  },
  {
    title: "Fungsi Permintaan",
    content: "Qd = -aP + b, di mana Qd = jumlah diminta, P = harga, a = slope (negatif), b = konstanta."
  },
];

// Summary for Ekonomi (Penawaran) - NEW
const penawaranSummaryPoints = [
  {
    title: "Pengertian Penawaran",
    content: "Penawaran (Supply) adalah jumlah barang/jasa yang dijual/ditawarkan oleh produsen pada tingkat harga tertentu."
  },
  {
    title: "Hukum Penawaran",
    content: "Hubungan Positif: Jika harga naik → penawaran naik. Jika harga turun → penawaran turun (ceteris paribus)."
  },
  {
    title: "Faktor Penawaran",
    content: "Harga barang itu sendiri, biaya produksi, teknologi, pajak, subsidi, harga barang lain, dan prediksi harga masa depan."
  },
  {
    title: "Kurva Penawaran",
    content: "Kurva berslope positif (miring dari kiri bawah ke kanan atas), menunjukkan hubungan berbanding lurus antara P dan Q."
  },
  {
    title: "Pergerakan vs Pergeseran",
    content: "Pergerakan: akibat perubahan harga sendiri (sepanjang kurva). Pergeseran: akibat faktor lain seperti teknologi/biaya (kurva geser kiri/kanan)."
  }
];

// Summary for Ekonomi (Pasar)
const pasarSummaryPoints = [
  {
    title: "Pengertian Pasar",
    content: "Pasar adalah tempat bertemunya permintaan (pembeli) dan penawaran (penjual) untuk melakukan transaksi barang atau jasa."
  },
  {
    title: "Struktur Pasar",
    content: "Terbagi menjadi Pasar Persaingan Sempurna dan Pasar Persaingan Tidak Sempurna (Monopoli, Oligopoli, Monopolistik)."
  },
  {
    title: "Fungsi Pasar",
    content: "Fungsi Distribusi, Fungsi Pembentuk Harga (Nilai), dan Fungsi Promosi."
  }
];

// Summary for PKWU
const pkwuSummaryPoints = [
  {
    title: "Pengertian Limbah Bangun Datar",
    content: "Limbah bangun datar adalah bahan sisa yang memiliki bentuk dasar dua dimensi seperti kertas, kardus, plastik lembaran, dan kain perca."
  },
  {
    title: "Konsep Upcycling",
    content: "Proses mengubah limbah menjadi produk bernilai lebih tinggi dari bentuk aslinya, berbeda dengan recycling yang mengolah kembali menjadi bahan dasar."
  },
  {
    title: "Proses Produksi",
    content: "Tahapan: pengumpulan bahan → persiapan → desain → pengerjaan → quality control → packaging."
  },
  {
    title: "Strategi Pemasaran",
    content: "Memanfaatkan online marketplace, media sosial, storytelling, eco-branding, dan kolaborasi."
  }
];

// Summary for SDM (Sumber Daya Usaha)
const sdmSummaryPoints = [
  {
    title: "6M Sumber Daya Usaha",
    content: "Sumber daya usaha meliputi Man (Manusia), Money (Uang), Material (Fisik), Machine (Teknologi), Method (Metode), dan Market (Pasar)."
  },
  {
    title: "Man & Money",
    content: "Man: Unsur manajemen penting untuk mencapai tujuan. Money: Alat tukar dan pengukur nilai untuk membiayai kegiatan usaha."
  },
  {
    title: "Material, Machine, Method",
    content: "Material: Bahan baku. Machine: Teknologi/alat produksi. Method: Cara kerja efektif dan efisien."
  },
  {
    title: "Market (Pasar)",
    content: "Strategi pemasaran untuk menyebarkan hasil produksi agar sampai ke tangan konsumen."
  },
  {
    title: "Administrasi Usaha",
    content: "Kegiatan catat-mencatat, surat-menyurat, dsb untuk menunjang kelancaran usaha dan pengambilan keputusan."
  },
  {
    title: "Pemasaran yang Berhasil",
    content: "Ditandai dengan jangkauan pasar yang luas dan masa produksi yang bertahan lama. Perlu mempertimbangkan sasaran pasar, selera konsumen, dan harga."
  }
];

// Reflection questions for Ekonomi
const ekonomiReflectionQuestions = [
  "Apa hal paling menarik yang kamu pelajari dari materi ini?",
  "Bagaimana kamu akan menerapkan konsep ini dalam kehidupan sehari-hari?",
  "Adakah bagian materi yang masih belum kamu pahami? Tuliskan di sini!"
];

export default function SummaryPage() {
  const { moduleId } = useParams();
  const { markSectionComplete, markModuleComplete, getModuleProgress } = useProgress();
  const module = getModuleById(moduleId);
  const { toast } = useToast();
  const { user } = useAuth();

  const [reflections, setReflections] = useState<Record<number, string>>({});
  const [savedReflections, setSavedReflections] = useState<Record<number, string>>({});
  const [feedbackMap, setFeedbackMap] = useState<Record<number, string>>({});
  const [idsMap, setIdsMap] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  if (!module) {
    return <div className="flex items-center justify-center min-h-screen">Modul tidak ditemukan</div>;
  }

  const progress = getModuleProgress(module.id);
  const isPKWU = isPKWUModule(moduleId);
  const [isCompleted, setIsCompleted] = useState(progress.isCompleted);

  const questionsToUse = module.summaryQuestions || ekonomiReflectionQuestions.map((q, i) => ({ id: i + 1, question: q, hint: 'Tuliskan refleksimu di sini.' }));

  // Fetch existing answers
  useEffect(() => {
    const fetchAnswers = async () => {
      if (!user || !moduleId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('trigger_answers')
          .select('id, question_id, answer')
          .eq('user_id', user.id)
          .eq('module_id', `${moduleId}-summary`);

        if (error) throw error;

        const answersMap: Record<number, string> = {};
        const tempIdsMap: Record<number, string> = {};

        data?.forEach((item) => {
          answersMap[item.question_id] = item.answer;
          tempIdsMap[item.question_id] = item.id;
        });
        setReflections(answersMap);
        setSavedReflections(answersMap);
        setIdsMap(tempIdsMap);

        // Fetch Feedback
        if (data && data.length > 0) {
          const { data: feedbackData } = await supabase
            .from('teacher_feedback')
            .select('answer_id, feedback')
            .eq('answer_type', 'summary-reflection') 
            .in('answer_id', Object.values(tempIdsMap));

          if (feedbackData) {
            const fbMap: Record<number, string> = {};
            feedbackData.forEach((fb: any) => {
              const qId = Object.keys(tempIdsMap).find(key => tempIdsMap[Number(key)] === fb.answer_id);
              if (qId) fbMap[Number(qId)] = fb.feedback;
            });
            setFeedbackMap(fbMap);
          }
        }
      } catch (error) {
        console.error('Error fetching summary reflections:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnswers();
  }, [user, moduleId]);

  const handleReflectionChange = (id: number, value: string) => {
    setReflections(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveReflection = async (questionId: number) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Kamu harus login untuk menyimpan jawaban",
        variant: "destructive",
      });
      return;
    }

    setSaving(prev => ({ ...prev, [questionId]: true }));

    try {
      const answer = reflections[questionId];
      if (!answer?.trim()) return;

      const { data, error } = await supabase
        .from('trigger_answers')
        .upsert({
          user_id: user.id,
          module_id: `${moduleId}-summary`,
          question_id: questionId,
          answer: answer.trim(),
        }, {
          onConflict: 'user_id,module_id,question_id',
        })
        .select('id')
        .single();

      if (error) throw error;
      if (data) setIdsMap(prev => ({ ...prev, [questionId]: data.id }));

      setSavedReflections(prev => ({ ...prev, [questionId]: answer }));

      toast({
        title: "Berhasil",
        description: "Refleksi berhasil dikirim ke guru",
      });

    } catch (error) {
      console.error('Error saving summary reflection:', error);
      toast({
        title: "Error",
        description: "Gagal mengirim refleksi",
        variant: "destructive",
      });
    } finally {
      setSaving(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const handleCompleteModule = () => {
    markSectionComplete(module.id, 'rangkuman');
    markModuleComplete(module.id);
    setIsCompleted(true);

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
  };

  let summaryPoints = permintaanSummaryPoints;
  let keyFormulaTitle = "Fungsi Permintaan";
  let keyFormulaContent = "Qd = -aP + b";

  if (moduleId === 'kerajinan-limbah') {
    summaryPoints = pkwuSummaryPoints;
  } else if (moduleId === 'pkwu-sumber-daya') {
    summaryPoints = sdmSummaryPoints;
  } else if (moduleId === 'penawaran') {
    summaryPoints = penawaranSummaryPoints;
    keyFormulaTitle = "Fungsi Penawaran";
    keyFormulaContent = "Qs = aP + b";
  } else if (moduleId === 'pasar') {
    summaryPoints = pasarSummaryPoints;
  }

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
    <ModuleLayout module={module} currentSection="rangkuman">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm mb-4">
            <FileCheck className="h-4 w-4" />
            <span>Rangkuman & Refleksi</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Rangkuman Materi
          </h1>
          <p className="text-muted-foreground">
            Berikut adalah ringkasan poin-poin penting dari materi {isPKWU ? 'kerajinan limbah' : 'permintaan'} yang sudah kamu pelajari.
          </p>
        </motion.div>

        {/* Summary Points */}
        <motion.div variants={itemVariants} className="space-y-4">
          {summaryPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <div className="flex">
                  <div className="w-2 bg-gradient-primary" />
                  <div className="flex-1">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span>{point.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{point.content}</p>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Key Formula - Only for Ekonomi */}
        {!isPKWU && (
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Rumus Penting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-card rounded-lg border">
                    <h4 className="font-medium mb-2">{keyFormulaTitle}</h4>
                    <p className="text-2xl font-mono text-primary">{keyFormulaContent}</p>
                  </div>
                  <div className="p-4 bg-card rounded-lg border">
                    <h4 className="font-medium mb-2">Menghitung Slope</h4>
                    <p className="text-2xl font-mono text-primary">a = ΔQ / ΔP</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Key Concepts - Only for PKWU (excluding Sumber Daya) */}
        {isPKWU && moduleId !== 'pkwu-sumber-daya' && (
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-600" />
                  Konsep Penting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-card rounded-lg border">
                    <h4 className="font-medium mb-2">Rumus Harga Jual</h4>
                    <p className="text-lg font-mono text-green-600">Harga = Biaya + Margin</p>
                  </div>
                  <div className="p-4 bg-card rounded-lg border">
                    <h4 className="font-medium mb-2">Prinsip Upcycling</h4>
                    <p className="text-lg font-mono text-green-600">Limbah → Nilai Lebih Tinggi</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Reflection */}
        {moduleId !== 'pkwu-sumber-daya' && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-amber-500" />
                  Refleksi Pembelajaran
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {questionsToUse.map((q: any) => (
                  <div key={q.id} className="space-y-3">
                    <label className="block text-foreground font-medium">
                      {q.id}. {q.question}
                    </label>
                    <p className="text-xs text-muted-foreground italic mb-2">
                      💡 {q.hint}
                    </p>
                    <Textarea
                      placeholder="Tuliskan jawabanmu..."
                      className="resize-none min-h-[100px]"
                      value={reflections[q.id] || ''}
                      onChange={(e) => handleReflectionChange(q.id, e.target.value)}
                      disabled={isLoading}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {savedReflections[q.id] && (
                          <div className="flex items-center gap-1 text-xs text-success font-medium">
                            <CheckCircle2 className="h-3 w-3" />
                            Sudah dikirim
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant={savedReflections[q.id] === reflections[q.id] ? "outline" : "default"}
                        onClick={() => handleSaveReflection(q.id)}
                        disabled={!reflections[q.id]?.trim() || saving[q.id] || savedReflections[q.id] === reflections[q.id]}
                        className="gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {saving[q.id] ? 'Mengirim...' : 'Kirim ke Guru'}
                      </Button>
                    </div>

                    {feedbackMap[q.id] && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-1 text-blue-700 dark:text-blue-400">
                          <MessageSquare className="h-4 w-4" />
                          <span className="font-medium text-xs">Feedback Guru</span>
                        </div>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          {feedbackMap[q.id]}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Completion */}
        {!isCompleted ? (
          <motion.div variants={itemVariants}>
            <Card className={`border-success/30 ${isPKWU ? 'bg-gradient-to-br from-green-500/5 to-green-500/10' : 'bg-gradient-to-br from-success/5 to-success/10'}`}>
              <CardContent className="pt-6 text-center">
                <Trophy className={`h-12 w-12 mx-auto mb-4 ${isPKWU ? 'text-green-600' : 'text-success'}`} />
                <h3 className="text-xl font-bold mb-2">Kamu Sudah di Akhir Modul!</h3>
                <p className="text-muted-foreground mb-6">
                  Selamat telah menyelesaikan semua materi tentang {isPKWU ? 'Kerajinan dari Limbah' : 'Permintaan'}.
                  Klik tombol di bawah untuk menandai modul ini sebagai selesai.
                </p>
                <Button
                  onClick={handleCompleteModule}
                  size="lg"
                  className={`gap-2 text-white ${isPKWU ? 'bg-green-600 hover:bg-green-700' : 'bg-success hover:bg-success/90'}`}
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Tandai Modul Selesai
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            <Card className={`border-success/30 ${isPKWU ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10' : 'bg-gradient-to-br from-success/10 to-primary/10'}`}>
              <CardContent className="pt-6 text-center">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${isPKWU ? 'bg-green-500/20' : 'bg-success/20'}`}>
                  <Trophy className={`h-10 w-10 ${isPKWU ? 'text-green-600' : 'text-success'}`} />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gradient">Selamat! 🎉</h3>
                <p className="text-muted-foreground mb-6">
                  Kamu telah berhasil menyelesaikan modul <strong>{isPKWU ? 'Kerajinan dari Limbah' : 'Permintaan (Demand)'}</strong>.
                  Lanjutkan perjalanan belajarmu dengan modul berikutnya!
                </p>
                <div className="flex justify-center gap-4">
                  <Link to="/">
                    <Button variant="outline" className="gap-2">
                      <Home className="h-4 w-4" />
                      Kembali ke Beranda
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div variants={itemVariants} className="flex justify-between items-center pt-8 border-t border-border">
          <Link to={`/modul/${module.id}/glosarium`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Glosarium
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <Home className="h-4 w-4" />
              Beranda
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </ModuleLayout>
  );
}
