import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ClipboardList, 
  ArrowRight, 
  ArrowLeft,
  FileText,
  CheckCircle2,
  HelpCircle,
  Calculator,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { useProgress } from '@/hooks/useProgress';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getModuleById, isPKWUModule } from '@/data/moduleUtils';
import { supabase } from '@/integrations/supabase/client';

// LKPD for Ekonomi
const ekonomiLkpdProblems = [
  {
    id: 1,
    title: "Soal 1: Penjualan Es Teh di Kantin",
    story: "Bu Siti menjual es teh di kantin sekolah. Ketika harga es teh Rp5.000 per gelas, ia berhasil menjual 100 gelas per hari. Setelah menurunkan harga menjadi Rp3.000 per gelas, penjualannya meningkat menjadi 160 gelas per hari.",
    question: "Tentukan fungsi permintaan es teh di kantin Bu Siti!",
    hint: "Identifikasi dua titik dari cerita, lalu gunakan rumus: a = ΔQ/ΔP",
  },
  {
    id: 2,
    title: "Soal 2: Penjualan Pulpen di Koperasi",
    story: "Koperasi sekolah menjual pulpen. Saat harga pulpen Rp4.000 per buah, terjual 50 buah per minggu. Ketika harga dinaikkan menjadi Rp6.000 per buah, jumlah yang terjual menurun menjadi 30 buah per minggu.",
    question: "Tentukan fungsi permintaan pulpen di koperasi sekolah!",
    hint: "Perhatikan: harga naik, permintaan turun (sesuai hukum permintaan)",
  },
  {
    id: 3,
    title: "Soal 3: Penjualan Bakso di Stadion",
    story: "Pak Joko berjualan bakso di stadion. Pada saat pertandingan biasa, dengan harga Rp15.000 per mangkok, ia menjual 80 mangkok. Saat ia memberikan diskon menjadi Rp12.000 per mangkok, penjualan meningkat menjadi 110 mangkok.",
    question: "Tentukan fungsi permintaan bakso Pak Joko dan hitung berapa mangkok yang akan terjual jika harga diturunkan lagi menjadi Rp10.000!",
    hint: "Setelah menemukan fungsi, substitusikan P = 10.000 untuk mencari Q",
  },
  {
    id: 4,
    title: "Soal 4: Analisis Kasus",
    story: "Toko buku menjual novel dengan harga Rp75.000 dan terjual 40 eksemplar per bulan. Setelah ada diskon 20%, penjualan meningkat menjadi 60 eksemplar per bulan.",
    question: "a) Tentukan fungsi permintaan novel tersebut!\nb) Jika toko ingin menjual 80 eksemplar per bulan, berapa harga yang harus ditetapkan?",
    hint: "Hitung dulu harga setelah diskon 20%. Untuk bagian b, substitusi Q = 80 lalu cari P",
  },
];

// LKPD for PKWU
const pkwuLkpdProblems = [
  {
    id: 1,
    title: "Soal 1: Identifikasi Limbah",
    story: "Kamu diminta untuk mengamati lingkungan sekitar rumah atau sekolahmu. Identifikasi jenis-jenis limbah bangun datar yang dapat ditemukan.",
    question: "Buatlah daftar minimal 5 jenis limbah bangun datar yang kamu temukan, beserta potensi produk kerajinan yang bisa dibuat dari masing-masing limbah tersebut!",
    hint: "Perhatikan limbah kertas, kardus, plastik, kain, dan bahan lainnya yang memiliki bentuk datar/lembaran.",
  },
  {
    id: 2,
    title: "Soal 2: Analisis Peluang Usaha",
    story: "Seorang pengrajin membuat tas dari bungkus kopi sachet bekas. Modal pembuatan per tas adalah Rp20.000 (tenaga kerja dan bahan pendukung). Tas tersebut dijual seharga Rp85.000.",
    question: "a) Hitung keuntungan per tas!\nb) Jika dalam sebulan terjual 30 tas, berapa total keuntungan yang didapat?\nc) Analisis kelebihan dan kekurangan usaha ini!",
    hint: "Keuntungan = Harga Jual - Modal. Pertimbangkan juga aspek sustainability.",
  },
  {
    id: 3,
    title: "Soal 3: Desain Produk",
    story: "Kamu diberi tugas untuk merancang sebuah produk kerajinan dari limbah plastik sachet kemasan.",
    question: "Buatlah rencana produk yang meliputi:\na) Nama dan jenis produk\nb) Bahan limbah yang digunakan\nc) Target pasar\nd) Estimasi harga jual\ne) Langkah-langkah pembuatan (minimal 5 langkah)",
    hint: "Pikirkan produk yang memiliki nilai guna dan estetika tinggi.",
  },
  {
    id: 4,
    title: "Soal 4: Analisis SWOT",
    story: "Kamu berencana memulai usaha kerajinan dari limbah kain perca untuk dijual di marketplace online.",
    question: "Buatlah analisis SWOT (Strengths, Weaknesses, Opportunities, Threats) untuk rencana usaha tersebut! Jelaskan minimal 3 poin untuk setiap aspek.",
    hint: "Pertimbangkan faktor internal (kekuatan & kelemahan) dan eksternal (peluang & ancaman).",
  },
];

export default function LKPDPage() {
  const { moduleId } = useParams();
  const { markSectionComplete } = useProgress();
  const { user } = useAuth();
  const { toast } = useToast();
  const module = getModuleById(moduleId);
  
  if (!module) {
    return <div className="flex items-center justify-center min-h-screen">Modul tidak ditemukan</div>;
  }
  
  const isPKWU = isPKWUModule(moduleId);
  const lkpdProblems = isPKWU ? pkwuLkpdProblems : ekonomiLkpdProblems;
  
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showHints, setShowHints] = useState<Record<number, boolean>>({});
  const [saving, setSaving] = useState<Record<number, boolean>>({});
  const [savedAnswers, setSavedAnswers] = useState<Record<number, boolean>>({});

  // Load existing answers from database
  useEffect(() => {
    if (user) {
      loadExistingAnswers();
    }
  }, [user]);

  const loadExistingAnswers = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('lkpd_answers')
      .select('problem_id, answer')
      .eq('user_id', user.id)
      .eq('module_id', module.id);

    if (data) {
      const loadedAnswers: Record<number, string> = {};
      const loadedSaved: Record<number, boolean> = {};
      data.forEach(item => {
        loadedAnswers[item.problem_id] = item.answer;
        loadedSaved[item.problem_id] = true;
      });
      setAnswers(loadedAnswers);
      setSavedAnswers(loadedSaved);
    }
  };

  const handleAnswerChange = (id: number, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setSavedAnswers(prev => ({ ...prev, [id]: false }));
  };

  const saveAnswer = async (problemId: number) => {
    if (!user || !answers[problemId]?.trim()) return;

    setSaving(prev => ({ ...prev, [problemId]: true }));

    const { error } = await supabase
      .from('lkpd_answers')
      .upsert({
        user_id: user.id,
        module_id: module.id,
        problem_id: problemId,
        answer: answers[problemId],
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,module_id,problem_id'
      });

    setSaving(prev => ({ ...prev, [problemId]: false }));

    if (error) {
      toast({
        title: 'Gagal menyimpan',
        description: 'Terjadi kesalahan saat menyimpan jawaban.',
        variant: 'destructive'
      });
    } else {
      setSavedAnswers(prev => ({ ...prev, [problemId]: true }));
      toast({
        title: 'Tersimpan',
        description: `Jawaban soal ${problemId} berhasil disimpan.`
      });
    }
  };

  const toggleHint = (id: number) => {
    setShowHints(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleComplete = () => {
    markSectionComplete(module.id, 'lkpd');
  };

  const answeredCount = Object.values(answers).filter(a => a.trim().length > 0).length;

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
    <ModuleLayout module={module} currentSection="lkpd">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm mb-4">
            <ClipboardList className="h-4 w-4" />
            <span>LKPD</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Lembar Kerja Peserta Didik
          </h1>
          <p className="text-muted-foreground">
            {isPKWU ? 'Latihan menganalisis peluang usaha kerajinan dari limbah' : 'Latihan menentukan fungsi permintaan dari soal cerita'}
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div variants={itemVariants}>
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  <span className="text-foreground font-medium">Progress LKPD</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {answeredCount} dari {lkpdProblems.length} soal terjawab
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rumus Pengingat - Only for Ekonomi */}
        {!isPKWU && (
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📐</span>
                  Rumus yang Digunakan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-card rounded-lg border">
                    <p className="font-medium text-foreground mb-2">Rumus Slope:</p>
                    <p className="font-mono text-lg text-primary">a = (Q₂ - Q₁) / (P₂ - P₁)</p>
                  </div>
                  <div className="p-4 bg-card rounded-lg border">
                    <p className="font-medium text-foreground mb-2">Bentuk Fungsi Permintaan:</p>
                    <p className="font-mono text-lg text-primary">Qd = aP + b</p>
                  </div>
                </div>
                <div className="p-4 bg-card rounded-lg border">
                  <p className="font-medium text-foreground mb-2">Persamaan Garis Melalui Dua Titik:</p>
                  <p className="font-mono text-primary">(Q - Q₁) / (Q₂ - Q₁) = (P - P₁) / (P₂ - P₁)</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Panduan PKWU */}
        {isPKWU && (
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">♻️</span>
                  Panduan Analisis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-card rounded-lg border">
                    <p className="font-medium text-foreground mb-2">Rumus Harga Jual:</p>
                    <p className="font-mono text-lg text-green-600">Harga = Biaya Produksi + Margin</p>
                  </div>
                  <div className="p-4 bg-card rounded-lg border">
                    <p className="font-medium text-foreground mb-2">Keuntungan:</p>
                    <p className="font-mono text-lg text-green-600">Laba = Harga Jual - Modal</p>
                  </div>
                </div>
                <div className="p-4 bg-card rounded-lg border">
                  <p className="font-medium text-foreground mb-2">Analisis SWOT:</p>
                  <p className="font-mono text-green-600">Strengths • Weaknesses • Opportunities • Threats</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Problems */}
        {lkpdProblems.map((problem, index) => (
          <motion.div key={problem.id} variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start gap-3 text-lg">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-foreground">{problem.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Story */}
                <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                  <p className="text-foreground leading-relaxed">{problem.story}</p>
                </div>

                {/* Question */}
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="font-medium text-foreground whitespace-pre-line">{problem.question}</p>
                </div>

                {/* Hint Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleHint(problem.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  {showHints[problem.id] ? 'Sembunyikan Petunjuk' : 'Tampilkan Petunjuk'}
                </Button>

                {showHints[problem.id] && (
                  <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg">
                    <p className="text-sm text-foreground">
                      <strong>💡 Petunjuk:</strong> {problem.hint}
                    </p>
                  </div>
                )}

                {/* Answer Area */}
                <div className="space-y-2">
                  <Label htmlFor={`answer-${problem.id}`}>Jawaban:</Label>
                  <Textarea
                    id={`answer-${problem.id}`}
                    placeholder="Tuliskan langkah-langkah penyelesaian dan jawabanmu di sini..."
                    className="min-h-[150px] font-mono text-sm"
                    value={answers[problem.id] || ''}
                    onChange={(e) => handleAnswerChange(problem.id, e.target.value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    {savedAnswers[problem.id] && (
                      <div className="flex items-center gap-2 text-success text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Tersimpan di database</span>
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => saveAnswer(problem.id)}
                    disabled={!answers[problem.id]?.trim() || saving[problem.id]}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saving[problem.id] ? 'Menyimpan...' : 'Simpan Jawaban'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Tips - Different for each subject */}
        <motion.div variants={itemVariants}>
          <Card className={`border-accent ${isPKWU ? 'bg-green-50/50 dark:bg-green-900/10' : 'bg-accent/50'}`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <FileText className={`h-5 w-5 flex-shrink-0 mt-0.5 ${isPKWU ? 'text-green-600' : 'text-primary'}`} />
                <div>
                  <p className="text-sm text-foreground font-medium mb-2">Langkah-langkah Pengerjaan:</p>
                  {isPKWU ? (
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal pl-4">
                      <li>Baca soal dengan teliti dan pahami konteksnya</li>
                      <li>Identifikasi data yang diberikan dalam soal</li>
                      <li>Tentukan pendekatan analisis yang sesuai</li>
                      <li>Kerjakan dengan sistematis dan runtut</li>
                      <li>Periksa kembali jawaban sebelum disimpan</li>
                    </ol>
                  ) : (
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal pl-4">
                      <li>Identifikasi data titik A (P₁, Q₁) dan titik B (P₂, Q₂) dari soal cerita</li>
                      <li>Hitung ΔQ = Q₂ - Q₁ dan ΔP = P₂ - P₁</li>
                      <li>Hitung slope: a = ΔQ / ΔP</li>
                      <li>Substitusi ke persamaan: Q - Q₁ = a(P - P₁)</li>
                      <li>Sederhanakan menjadi bentuk Qd = aP + b</li>
                      <li>Verifikasi dengan memasukkan nilai P₁ dan P₂</li>
                    </ol>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div variants={itemVariants} className="flex justify-between items-center pt-8 border-t border-border">
          <Link to={`/modul/${module.id}/video`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Video
            </Button>
          </Link>
          <Link to={`/modul/${module.id}/kuis`}>
            <Button 
              onClick={handleComplete}
              className="gap-2 bg-gradient-primary hover:opacity-90"
            >
              Lanjut ke Kuis
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </ModuleLayout>
  );
}