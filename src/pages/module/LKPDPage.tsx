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
  Save,
  User,
  BookOpen,
  Target,
  ListChecks,
  Star
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
import { Separator } from '@/components/ui/separator';

// LKPD for Ekonomi
const ekonomiLkpdProblems = [
  {
    id: 1,
    title: "Soal 1: Penjualan Es Teh di Kantin",
    story: "Bu Siti menjual es teh di kantin sekolah. Ketika harga es teh Rp5.000 per gelas, ia berhasil menjual 100 gelas per hari. Setelah menurunkan harga menjadi Rp3.000 per gelas, penjualannya meningkat menjadi 160 gelas per hari.",
    question: "Tentukan fungsi permintaan es teh di kantin Bu Siti!",
    hint: "Identifikasi dua titik dari cerita, lalu gunakan rumus: a = ΔQ/ΔP",
    rubrik: "Skor 25: Jawaban lengkap dengan langkah sistematis dan hasil benar"
  },
  {
    id: 2,
    title: "Soal 2: Penjualan Pulpen di Koperasi",
    story: "Koperasi sekolah menjual pulpen. Saat harga pulpen Rp4.000 per buah, terjual 50 buah per minggu. Ketika harga dinaikkan menjadi Rp6.000 per buah, jumlah yang terjual menurun menjadi 30 buah per minggu.",
    question: "Tentukan fungsi permintaan pulpen di koperasi sekolah!",
    hint: "Perhatikan: harga naik, permintaan turun (sesuai hukum permintaan)",
    rubrik: "Skor 25: Jawaban lengkap dengan langkah sistematis dan hasil benar"
  },
  {
    id: 3,
    title: "Soal 3: Penjualan Bakso di Stadion",
    story: "Pak Joko berjualan bakso di stadion. Pada saat pertandingan biasa, dengan harga Rp15.000 per mangkok, ia menjual 80 mangkok. Saat ia memberikan diskon menjadi Rp12.000 per mangkok, penjualan meningkat menjadi 110 mangkok.",
    question: "Tentukan fungsi permintaan bakso Pak Joko dan hitung berapa mangkok yang akan terjual jika harga diturunkan lagi menjadi Rp10.000!",
    hint: "Setelah menemukan fungsi, substitusikan P = 10.000 untuk mencari Q",
    rubrik: "Skor 25: Jawaban lengkap dengan fungsi benar dan prediksi tepat"
  },
  {
    id: 4,
    title: "Soal 4: Analisis Kasus",
    story: "Toko buku menjual novel dengan harga Rp75.000 dan terjual 40 eksemplar per bulan. Setelah ada diskon 20%, penjualan meningkat menjadi 60 eksemplar per bulan.",
    question: "a) Tentukan fungsi permintaan novel tersebut!\nb) Jika toko ingin menjual 80 eksemplar per bulan, berapa harga yang harus ditetapkan?",
    hint: "Hitung dulu harga setelah diskon 20%. Untuk bagian b, substitusi Q = 80 lalu cari P",
    rubrik: "Skor 25: Jawaban lengkap bagian a dan b dengan langkah sistematis"
  },
];

// LKPD for PKWU - Lembar Analisis Peluang Usaha
const pkwuLkpdProblems = [
  {
    id: 1,
    icon: "🗑️",
    title: "Identifikasi Limbah",
    story: "Amati lingkungan sekitar rumah atau sekolahmu. Identifikasi jenis-jenis limbah bangun datar yang dapat ditemukan.",
    question: "Buatlah daftar minimal 5 jenis limbah bangun datar yang kamu temukan, beserta potensi produk kerajinan yang bisa dibuat dari masing-masing limbah tersebut!",
    hint: "Contoh: Botol minuman, Plastik sachet minuman, kardus bekas, kain perca, kertas bekas",
    rubrik: "Skor 15: Minimal 5 limbah dengan potensi produk yang relevan dan kreatif"
  },
  {
    id: 2,
    icon: "💡",
    title: "Ide Produk Kerajinan",
    story: "Berdasarkan limbah yang kamu temukan, pikirkan produk kerajinan yang bisa dibuat.",
    question: "Tuliskan ide produk kerajinan yang bisa kamu buat dari limbah yang kamu temukan!",
    hint: "Contoh: Tas Laptop atau Dompet Multifungsi dari plastik sachet",
    rubrik: "Skor 15: Ide produk kreatif, inovatif, dan memiliki nilai jual"
  },
  {
    id: 3,
    icon: "🔍",
    title: "Karakteristik Limbah",
    story: "Analisis karakteristik limbah yang akan kamu gunakan untuk membuat produk kerajinan.",
    question: "Jelaskan karakteristik limbah yang kamu pilih untuk membuat produk kerajinan!",
    hint: "Contoh: Anti air, kuat, ringan, warna bervariasi, mudah dibentuk",
    rubrik: "Skor 15: Karakteristik lengkap dan relevan dengan produk yang akan dibuat"
  },
  {
    id: 4,
    icon: "👥",
    title: "Target Pasar Utama",
    story: "Tentukan siapa yang akan menjadi target pasar dari produk kerajinan yang kamu buat.",
    question: "Siapa target pasar utama dari produk kerajinan yang kamu buat? Jelaskan alasannya!",
    hint: "Contoh: Mahasiswa/pekerja kantoran yang mencari produk unik & ramah lingkungan",
    rubrik: "Skor 15: Target pasar jelas dengan alasan yang logis"
  },
  {
    id: 5,
    icon: "⭐",
    title: "Analisis SWOT",
    story: "Lakukan analisis SWOT untuk rencana usaha kerajinan dari limbah yang kamu pilih.",
    question: "Buatlah analisis SWOT (Strengths, Weaknesses, Opportunities, Threats) untuk rencana usaha kerajinan limbahmu!",
    hint: "Pertimbangkan faktor internal (kekuatan & kelemahan) dan eksternal (peluang & ancaman)",
    rubrik: "Skor 20: Analisis SWOT lengkap dengan penjelasan yang logis"
  },
  {
    id: 6,
    icon: "📊",
    title: "Estimasi Peluang Pasar",
    story: "Berdasarkan analisis yang telah kamu lakukan, estimasikan peluang pasar untuk produk kerajinanmu.",
    question: "Berapa estimasi peluang pasar untuk produk kerajinanmu? (Tinggi/Sedang/Rendah) Berikan alasan yang logis!",
    hint: "Pertimbangkan target pasar, kompetitor, dan tren pasar saat ini",
    rubrik: "Skor 10: Estimasi dengan alasan yang logis dan didukung data/fakta"
  },
];

// Penilaian Presentasi PKWU
const pkwuPresentasiCriteria = [
  { aspek: "Kelengkapan Materi", deskripsi: "Menyampaikan semua aspek analisis peluang usaha secara lengkap", skor: 20 },
  { aspek: "Kejelasan Penyampaian", deskripsi: "Menyampaikan dengan bahasa yang jelas, runtut, dan mudah dipahami", skor: 20 },
  { aspek: "Kreativitas Ide", deskripsi: "Menampilkan ide produk yang inovatif dan memiliki nilai jual", skor: 20 },
  { aspek: "Penguasaan Materi", deskripsi: "Mampu menjawab pertanyaan dan menjelaskan dengan percaya diri", skor: 20 },
  { aspek: "Visualisasi/Media", deskripsi: "Menggunakan media presentasi yang menarik dan mendukung", skor: 20 },
];

// LKPD metadata
const ekonomiLkpdMeta = {
  title: "Lembar Kerja Peserta Didik (LKPD)",
  subtitle: "Menentukan Fungsi Permintaan dari Soal Cerita",
  mapel: "Ekonomi",
  kelas: "X",
  waktu: "45 menit",
  tujuan: [
    "Siswa mampu mengidentifikasi data harga dan jumlah dari soal cerita",
    "Siswa mampu menghitung slope (gradien) fungsi permintaan",
    "Siswa mampu menentukan fungsi permintaan dengan benar",
    "Siswa mampu menggunakan fungsi permintaan untuk prediksi"
  ],
  kompetensi: "Menganalisis dan menghitung fungsi permintaan menggunakan pendekatan matematika",
  petunjuk: [
    "Bacalah setiap soal dengan teliti dan pahami konteks ceritanya",
    "Identifikasi data yang diberikan: titik 1 (P₁, Q₁) dan titik 2 (P₂, Q₂)",
    "Gunakan rumus slope: a = (Q₂ - Q₁) / (P₂ - P₁)",
    "Substitusikan nilai ke persamaan garis untuk mendapatkan fungsi",
    "Tuliskan jawaban dengan langkah-langkah yang sistematis"
  ],
  rumus: [
    { nama: "Rumus Slope", formula: "a = (Q₂ - Q₁) / (P₂ - P₁)" },
    { nama: "Fungsi Permintaan", formula: "Qd = aP + b" },
    { nama: "Persamaan Garis", formula: "(Q - Q₁) / (Q₂ - Q₁) = (P - P₁) / (P₂ - P₁)" }
  ]
};

const pkwuLkpdMeta = {
  title: "Lembar Kerja Peserta Didik (LKPD)",
  subtitle: "Lembar Analisis Peluang Usaha",
  mapel: "Prakarya dan Kewirausahaan (PKWU)",
  kelas: "XI",
  waktu: "45 menit",
  tujuan: [
    "Siswa mampu mengidentifikasi berbagai limbah bangun datar di lingkungan sekitar",
    "Siswa mampu menganalisis karakteristik limbah untuk produk kerajinan",
    "Siswa mampu menentukan target pasar yang tepat",
    "Siswa mampu melakukan analisis SWOT untuk rencana usaha",
    "Siswa mampu mengestimasi peluang pasar dengan logis"
  ],
  kompetensi: "Menganalisis peluang usaha kerajinan dari bahan limbah berbentuk bangun datar",
  petunjuk: [
    "Bacalah setiap pertanyaan dengan teliti",
    "Jawab berdasarkan pengamatan dan analisis kamu sendiri",
    "Gunakan kreativitas dalam menjawab",
    "Pertimbangkan aspek ekonomi dan keberlanjutan",
    "Tuliskan jawaban dengan jelas dan sistematis"
  ],
  rumus: [
    { nama: "Peluang Usaha", formula: "Kebutuhan Pasar + Keunikan Produk + Modal Tersedia" },
    { nama: "Keuntungan", formula: "Laba = Harga Jual - Modal Produksi" },
    { nama: "Analisis SWOT", formula: "Strengths, Weaknesses, Opportunities, Threats" }
  ]
};

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
  const lkpdMeta = isPKWU ? pkwuLkpdMeta : ekonomiLkpdMeta;
  
  // PKWU only has main problems, no refleksi
  const allProblems = isPKWU ? pkwuLkpdProblems : ekonomiLkpdProblems;
  const totalQuestions = allProblems.length;
  
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showHints, setShowHints] = useState<Record<number, boolean>>({});
  const [saving, setSaving] = useState<Record<number, boolean>>({});
  const [savedAnswers, setSavedAnswers] = useState<Record<number, boolean>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(true);
  const [studentProfile, setStudentProfile] = useState<{ full_name: string; kelas: string; nis: string } | null>(null);

  // Fetch student profile and check submission status
  useEffect(() => {
    if (user) {
      fetchStudentProfile();
      checkSubmissionStatus();
    } else {
      setLoadingCheck(false);
    }
  }, [user]);

  const fetchStudentProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('full_name, kelas, nis')
      .eq('id', user.id)
      .single();
    
    if (data) {
      setStudentProfile(data);
    }
  };

  const checkSubmissionStatus = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('lkpd_answers')
      .select('problem_id, answer')
      .eq('user_id', user.id)
      .eq('module_id', module.id);

    if (data && data.length > 0) {
      const loadedAnswers: Record<number, string> = {};
      const loadedSaved: Record<number, boolean> = {};
      data.forEach(item => {
        loadedAnswers[item.problem_id] = item.answer;
        loadedSaved[item.problem_id] = true;
      });
      setAnswers(loadedAnswers);
      setSavedAnswers(loadedSaved);
      
      const allAnswered = allProblems.every(p => loadedAnswers[p.id]?.trim());
      setHasSubmitted(allAnswered);
    }
    setLoadingCheck(false);
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

  const answeredCount = Object.values(answers).filter(a => a?.trim()?.length > 0).length;
  const maxScore = isPKWU ? 100 : 100; // PKWU: 15+15+15+15+20+10+10 = 100

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
        className="space-y-6"
      >
        {/* 1. JUDUL LKPD */}
        <motion.div variants={itemVariants}>
          <Card className={`border-2 ${isPKWU ? 'border-green-500/30 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' : 'border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5'}`}>
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-background border mb-3 mx-auto">
                <ClipboardList className={`h-5 w-5 ${isPKWU ? 'text-green-600' : 'text-primary'}`} />
                <span className="font-medium">{lkpdMeta.mapel}</span>
              </div>
              <CardTitle className="text-2xl md:text-3xl font-display">
                {lkpdMeta.title}
              </CardTitle>
              <CardDescription className="text-lg font-medium text-foreground/80">
                {lkpdMeta.subtitle}
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* 2. IDENTITAS SISWA */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className={`h-5 w-5 ${isPKWU ? 'text-green-600' : 'text-primary'}`} />
                Identitas Siswa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Nama Lengkap</p>
                  <p className="font-medium">{studentProfile?.full_name || '-'}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Kelas</p>
                  <p className="font-medium">{studentProfile?.kelas || lkpdMeta.kelas}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">NIS</p>
                  <p className="font-medium">{studentProfile?.nis || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Mata Pelajaran</p>
                  <p className="font-medium">{lkpdMeta.mapel}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Alokasi Waktu</p>
                  <p className="font-medium">{lkpdMeta.waktu}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 3. TUJUAN PEMBELAJARAN & KOMPETENSI */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className={`h-5 w-5 ${isPKWU ? 'text-green-600' : 'text-primary'}`} />
                Tujuan Pembelajaran & Kompetensi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Kompetensi Dasar:</p>
                <p className={`p-3 rounded-lg border-l-4 ${isPKWU ? 'border-green-500 bg-green-50/50 dark:bg-green-900/20' : 'border-primary bg-primary/5'}`}>
                  {lkpdMeta.kompetensi}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Tujuan Pembelajaran:</p>
                <ul className="space-y-2">
                  {lkpdMeta.tujuan.map((tujuan, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${isPKWU ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'bg-primary/10 text-primary'}`}>
                        {index + 1}
                      </span>
                      <span className="text-sm">{tujuan}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 4. PETUNJUK BELAJAR */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ListChecks className={`h-5 w-5 ${isPKWU ? 'text-green-600' : 'text-primary'}`} />
                Petunjuk Pengerjaan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {lkpdMeta.petunjuk.map((petunjuk, index) => (
                  <li key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white ${isPKWU ? 'bg-green-600' : 'bg-primary'}`}>
                      {index + 1}
                    </span>
                    <span className="text-sm pt-0.5">{petunjuk}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </motion.div>

        {/* 5. INFORMASI PENDUKUNG (Rumus/Konsep) */}
        <motion.div variants={itemVariants}>
          <Card className={`${isPKWU ? 'bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20' : 'bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className={`h-5 w-5 ${isPKWU ? 'text-green-600' : 'text-primary'}`} />
                {isPKWU ? 'Konsep Penting' : 'Rumus yang Digunakan'}
              </CardTitle>
              <CardDescription>
                Informasi pendukung untuk mengerjakan LKPD
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-3 ${lkpdMeta.rumus.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                {lkpdMeta.rumus.map((item, index) => (
                  <div key={index} className="p-4 bg-card rounded-lg border">
                    <p className="font-medium text-foreground mb-2 text-sm">{item.nama}</p>
                    <p className={`font-mono text-base ${isPKWU ? 'text-green-600 dark:text-green-400' : 'text-primary'}`}>
                      {item.formula}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress */}
        <motion.div variants={itemVariants}>
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className={`h-5 w-5 ${isPKWU ? 'text-green-600' : 'text-primary'}`} />
                  <span className="text-foreground font-medium">Progress LKPD</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {answeredCount} dari {totalQuestions} soal terjawab
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 6. TUGAS DAN LANGKAH KERJA */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 mb-4">
            <FileText className={`h-5 w-5 ${isPKWU ? 'text-green-600' : 'text-primary'}`} />
            <h2 className="text-xl font-bold">Tugas dan Langkah Kerja</h2>
          </div>
        </motion.div>

        {lkpdProblems.map((problem, index) => (
          <motion.div key={problem.id} variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start gap-3 text-lg">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full text-lg flex items-center justify-center ${isPKWU ? 'bg-green-100 dark:bg-green-900/50' : 'bg-primary/10'}`}>
                    {isPKWU && 'icon' in problem ? (problem as { icon: string }).icon : (
                      <span className={`text-sm font-bold text-white ${isPKWU ? 'bg-green-600' : 'bg-primary'} w-full h-full rounded-full flex items-center justify-center`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    )}
                  </span>
                  <span className="text-foreground">{problem.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Story/Context */}
                <div className={`p-4 rounded-lg border-l-4 ${isPKWU ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : 'border-primary bg-muted/50'}`}>
                  <p className="text-sm font-medium text-muted-foreground mb-1">📖 Konteks:</p>
                  <p className="text-foreground leading-relaxed">{problem.story}</p>
                </div>

                {/* Question */}
                <div className="p-4 bg-accent/50 rounded-lg border">
                  <p className="text-sm font-medium text-muted-foreground mb-1">❓ Pertanyaan:</p>
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
                  <div className={`p-3 rounded-lg border ${isPKWU ? 'bg-amber-50/50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-700' : 'bg-warning/10 border-warning/30'}`}>
                    <p className="text-sm text-foreground">
                      <strong>💡 Contoh:</strong> {problem.hint}
                    </p>
                  </div>
                )}

                {/* Answer Area */}
                <div className="space-y-2">
                  <Label htmlFor={`answer-${problem.id}`} className="flex items-center gap-2">
                    <span>✏️ Jawaban:</span>
                    {hasSubmitted && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${isPKWU ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'bg-primary/10 text-primary'}`}>
                        Sudah Dikumpulkan
                      </span>
                    )}
                  </Label>
                  {hasSubmitted ? (
                    <div className="p-4 bg-muted/50 rounded-lg font-mono text-sm whitespace-pre-wrap border">
                      {answers[problem.id] || '(Tidak ada jawaban)'}
                    </div>
                  ) : (
                    <>
                      <Textarea
                        id={`answer-${problem.id}`}
                        placeholder="Tuliskan jawabanmu di sini..."
                        className="min-h-[120px] font-mono text-sm"
                        value={answers[problem.id] || ''}
                        onChange={(e) => handleAnswerChange(problem.id, e.target.value)}
                      />
                      <div className="flex items-center justify-between">
                        <div>
                          {savedAnswers[problem.id] && (
                            <div className={`flex items-center gap-2 text-sm ${isPKWU ? 'text-green-600' : 'text-success'}`}>
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Tersimpan di database</span>
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => saveAnswer(problem.id)}
                          disabled={!answers[problem.id]?.trim() || saving[problem.id]}
                          className={`gap-2 ${isPKWU ? 'bg-green-600 hover:bg-green-700' : ''}`}
                        >
                          <Save className="h-4 w-4" />
                          {saving[problem.id] ? 'Menyimpan...' : 'Simpan Jawaban'}
                        </Button>
                      </div>
                    </>
                  )}
                </div>

                {/* Rubrik per soal - only show if has rubrik */}
                {'rubrik' in problem && problem.rubrik && (
                  <div className={`p-3 rounded-lg border text-sm ${isPKWU ? 'bg-green-50/30 border-green-200 dark:bg-green-900/10 dark:border-green-800' : 'bg-primary/5 border-primary/20'}`}>
                    <span className="font-medium">📊 Kriteria Penilaian:</span> {problem.rubrik}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}


        {/* 7. PENILAIAN (Rubrik) */}
        <motion.div variants={itemVariants}>
          <Card className={`${isPKWU ? 'border-green-500/30' : 'border-primary/30'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className={`h-5 w-5 ${isPKWU ? 'text-green-600' : 'text-primary'}`} />
                Rubrik Penilaian LKPD
              </CardTitle>
              <CardDescription>
                Panduan penilaian untuk LKPD ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                {isPKWU ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-green-50 dark:bg-green-900/20">
                        <th className="p-3 text-left font-medium border">No</th>
                        <th className="p-3 text-left font-medium border">Aspek Penilaian</th>
                        <th className="p-3 text-center font-medium border w-20">Skor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3 border text-center">1</td>
                        <td className="p-3 border">Identifikasi Limbah (minimal 5 jenis)</td>
                        <td className="p-3 text-center border font-bold">15</td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td className="p-3 border text-center">2</td>
                        <td className="p-3 border">Ide Produk Kerajinan</td>
                        <td className="p-3 text-center border font-bold">15</td>
                      </tr>
                      <tr>
                        <td className="p-3 border text-center">3</td>
                        <td className="p-3 border">Karakteristik Limbah</td>
                        <td className="p-3 text-center border font-bold">15</td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td className="p-3 border text-center">4</td>
                        <td className="p-3 border">Target Pasar Utama</td>
                        <td className="p-3 text-center border font-bold">15</td>
                      </tr>
                      <tr>
                        <td className="p-3 border text-center">5</td>
                        <td className="p-3 border">Analisis SWOT</td>
                        <td className="p-3 text-center border font-bold">25</td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td className="p-3 border text-center">6</td>
                        <td className="p-3 border">Estimasi Peluang Pasar</td>
                        <td className="p-3 text-center border font-bold">15</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="bg-green-100 dark:bg-green-900/30">
                        <td className="p-3 border font-bold" colSpan={2}>Total Skor Maksimal</td>
                        <td className="p-3 text-center border font-bold">100</td>
                      </tr>
                    </tfoot>
                  </table>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-primary/5">
                        <th className="p-3 text-left font-medium border">Kriteria</th>
                        <th className="p-3 text-center font-medium border w-20">Skor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3 border">Jawaban lengkap dengan langkah sistematis dan hasil benar</td>
                        <td className="p-3 text-center border font-bold">25</td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td className="p-3 border">Jawaban benar namun langkah kurang lengkap</td>
                        <td className="p-3 text-center border font-bold">20</td>
                      </tr>
                      <tr>
                        <td className="p-3 border">Langkah benar namun hasil akhir salah</td>
                        <td className="p-3 text-center border font-bold">15</td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td className="p-3 border">Ada usaha menjawab namun banyak kesalahan</td>
                        <td className="p-3 text-center border font-bold">10</td>
                      </tr>
                      <tr>
                        <td className="p-3 border">Tidak menjawab atau jawaban tidak relevan</td>
                        <td className="p-3 text-center border font-bold">0</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="bg-primary/10">
                        <td className="p-3 border font-bold">Total Skor Maksimal</td>
                        <td className="p-3 text-center border font-bold">100</td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              </div>
              
              {hasSubmitted && (
                <div className={`mt-4 p-4 rounded-lg text-center ${isPKWU ? 'bg-green-50 dark:bg-green-900/20' : 'bg-primary/5'}`}>
                  <p className="text-sm text-muted-foreground mb-1">Status Pengumpulan</p>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className={`h-5 w-5 ${isPKWU ? 'text-green-600' : 'text-primary'}`} />
                    <span className="font-bold text-lg">LKPD Sudah Dikumpulkan</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Semua {totalQuestions} soal telah terjawab dan disimpan
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Penilaian Presentasi - Only for PKWU */}
        {isPKWU && (
          <motion.div variants={itemVariants}>
            <Card className="border-green-500/30 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">🎤</span>
                  Penilaian Presentasi Hasil LKPD
                </CardTitle>
                <CardDescription>
                  Panduan penilaian untuk presentasi hasil pengerjaan LKPD
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-green-50 dark:bg-green-900/20">
                        <th className="p-3 text-left font-medium border">No</th>
                        <th className="p-3 text-left font-medium border">Aspek Penilaian</th>
                        <th className="p-3 text-left font-medium border">Deskripsi</th>
                        <th className="p-3 text-center font-medium border w-20">Skor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pkwuPresentasiCriteria.map((item, index) => (
                        <tr key={index} className={index % 2 === 1 ? 'bg-muted/30' : ''}>
                          <td className="p-3 border text-center">{index + 1}</td>
                          <td className="p-3 border font-medium">{item.aspek}</td>
                          <td className="p-3 border text-muted-foreground">{item.deskripsi}</td>
                          <td className="p-3 text-center border font-bold">{item.skor}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-green-100 dark:bg-green-900/30">
                        <td className="p-3 border font-bold" colSpan={3}>Total Skor Maksimal Presentasi</td>
                        <td className="p-3 text-center border font-bold">100</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-green-100/50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
                    📋 Pedoman Presentasi
                  </h4>
                  <ul className="space-y-2 text-sm text-green-700 dark:text-green-400">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>Presentasikan hasil analisis peluang usaha kerajinan limbah yang telah kalian kerjakan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>Waktu presentasi maksimal 5-7 menit per kelompok/individu</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>Siapkan contoh produk atau visualisasi ide produk kerajinan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>Sesi tanya jawab akan dilakukan setelah presentasi</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center border border-green-200 dark:border-green-800">
                    <p className="text-2xl font-bold text-green-600">86-100</p>
                    <p className="text-xs text-muted-foreground">Sangat Baik (A)</p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center border border-blue-200 dark:border-blue-800">
                    <p className="text-2xl font-bold text-blue-600">71-85</p>
                    <p className="text-xs text-muted-foreground">Baik (B)</p>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center border border-amber-200 dark:border-amber-800">
                    <p className="text-2xl font-bold text-amber-600">56-70</p>
                    <p className="text-xs text-muted-foreground">Cukup (C)</p>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center border border-red-200 dark:border-red-800">
                    <p className="text-2xl font-bold text-red-600">&lt;56</p>
                    <p className="text-xs text-muted-foreground">Perlu Perbaikan (D)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div variants={itemVariants}>
          <div className="flex flex-col sm:flex-row gap-4 justify-between pt-4">
            <Button variant="outline" asChild className="gap-2">
              <Link to={`/modul/${module.id}/video`}>
                <ArrowLeft className="h-4 w-4" />
                Video Pembelajaran
              </Link>
            </Button>
            <Button 
              asChild 
              onClick={handleComplete}
              className={`gap-2 ${isPKWU ? 'bg-green-600 hover:bg-green-700' : ''}`}
            >
              <Link to={`/modul/${module.id}/kuis`}>
                Lanjut ke Kuis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </ModuleLayout>
  );
}
