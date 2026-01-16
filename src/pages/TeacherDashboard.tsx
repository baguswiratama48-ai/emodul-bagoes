import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  ClipboardList,
  FileText,
  ChevronDown,
  ChevronUp,
  BookOpen,
  LogOut,
  Home,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Lightbulb,
  Filter,
  Recycle,
  TrendingUp,
  RefreshCw,
  Lock,
  Unlock,
  Database,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { lkpdAnswerKeys, lkpdAnswerKeysPKWU, quizAnswerKeysEkonomi, quizAnswerKeysPKWU } from '@/data/answerKeys';
import { demandModule } from '@/data/moduleContent';
import { pkwuModule } from '@/data/pkwuModuleContent';
import { FeedbackForm } from '@/components/teacher/FeedbackForm';
import { ResetStudentWork } from '@/components/teacher/ResetStudentWork';

interface StudentProfile {
  id: string;
  full_name: string;
  nis: string | null;
  kelas: string | null;
}

interface StudentQuizResult {
  user_id: string;
  full_name: string;
  nis: string;
  kelas: string;
  total_questions: number;
  correct_answers: number;
  score: number;
  module_id?: string;
}

interface StudentLkpdAnswer {
  id: string;
  user_id: string;
  full_name: string;
  kelas: string;
  problem_id: number;
  answer: string;
  submitted_at: string;
  feedback?: string;
  module_id?: string;
}

interface StudentTriggerAnswer {
  id: string;
  user_id: string;
  full_name: string;
  kelas: string;
  question_id: number;
  answer: string;
  submitted_at: string;
  feedback?: string;
  module_id?: string;
}

interface FeedbackMap {
  [key: string]: string;
}

// Kelas untuk mapel Ekonomi dan PKWU
const EKONOMI_KELAS = ['X.9', 'X.10', 'X.11'];
const PKWU_KELAS = ['XI.3', 'XI.5', 'XI.6', 'XI.7', 'XI.8', 'XI.9', 'XI.10', 'XI.11'];
const ITEMS_PER_PAGE = 20;

export default function TeacherDashboard() {
  const { user, signOut, isGuru } = useAuth();
  const [quizResults, setQuizResults] = useState<StudentQuizResult[]>([]);
  const [lkpdAnswers, setLkpdAnswers] = useState<StudentLkpdAnswer[]>([]);
  const [triggerAnswers, setTriggerAnswers] = useState<StudentTriggerAnswer[]>([]);
  const [reflectionAnswers, setReflectionAnswers] = useState<StudentTriggerAnswer[]>([]);
  const [allStudents, setAllStudents] = useState<StudentProfile[]>([]);
  const [expandedAnswerKey, setExpandedAnswerKey] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedKelas, setSelectedKelas] = useState<string>('all');
  const [availableKelas, setAvailableKelas] = useState<string[]>([]);
  const [feedbackMap, setFeedbackMap] = useState<FeedbackMap>({});
  const [selectedMapel, setSelectedMapel] = useState<'ekonomi' | 'pkwu'>('ekonomi');
  const [quizSettings, setQuizSettings] = useState<Record<string, boolean>>({});

  // Pagination States
  const [currentPageTrigger, setCurrentPageTrigger] = useState(1);
  const [currentPageReflection, setCurrentPageReflection] = useState(1);
  const [currentPageLkpd, setCurrentPageLkpd] = useState(1);
  const [currentPageQuiz, setCurrentPageQuiz] = useState(1);

  // Determine which classes to show based on selected mapel
  const mapelKelas = useMemo(() => {
    return selectedMapel === 'ekonomi' ? EKONOMI_KELAS : PKWU_KELAS;
  }, [selectedMapel]);

  // Filter available kelas based on selected mapel
  const filteredAvailableKelas = useMemo(() => {
    return availableKelas.filter(k => mapelKelas.includes(k));
  }, [availableKelas, mapelKelas]);

  useEffect(() => {
    if (isGuru) {
      fetchStudentData();
    }
  }, [isGuru]);

  // Reset kelas filter & pagination when mapel changes
  useEffect(() => {
    setSelectedKelas('all');
    setCurrentPageTrigger(1);
    setCurrentPageReflection(1);
    setCurrentPageLkpd(1);
    setCurrentPageQuiz(1);
  }, [selectedMapel]);

  const fetchStudentData = async () => {
    setLoading(true);

    // Fetch all profiles with NIS and kelas
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, full_name, nis, kelas');

    const profilesMap: Record<string, StudentProfile> = {};
    const kelasSet = new Set<string>();

    profilesData?.forEach((p) => {
      profilesMap[p.id] = {
        id: p.id,
        full_name: p.full_name || 'Unknown',
        nis: p.nis,
        kelas: p.kelas
      };
      if (p.kelas) {
        kelasSet.add(p.kelas);
      }
    });

    setAllStudents(Object.values(profilesMap));
    setAvailableKelas(Array.from(kelasSet).sort());

    // Fetch all teacher feedback
    const { data: feedbackData } = await supabase
      .from('teacher_feedback')
      .select('answer_id, answer_type, feedback');

    const fbMap: FeedbackMap = {};
    feedbackData?.forEach((fb: any) => {
      fbMap[`${fb.answer_type}-${fb.answer_id}`] = fb.feedback;
    });
    setFeedbackMap(fbMap);

    // Fetch quiz answers with module_id
    const { data: quizData } = await supabase
      .from('quiz_answers')
      .select('user_id, question_id, is_correct, module_id');

    if (quizData) {
      const userScores: Record<string, StudentQuizResult> = {};
      quizData.forEach((answer: any) => {
        const profile = profilesMap[answer.user_id];
        const key = `${answer.user_id}-${answer.module_id || 'default'}`;
        if (!userScores[key]) {
          userScores[key] = {
            user_id: answer.user_id,
            full_name: profile?.full_name || 'Unknown',
            nis: profile?.nis || '-',
            kelas: profile?.kelas || '-',
            total_questions: 0,
            correct_answers: 0,
            score: 0,
            module_id: answer.module_id
          };
        }
        userScores[key].total_questions++;
        if (answer.is_correct) {
          userScores[key].correct_answers++;
        }
      });

      Object.values(userScores).forEach(user => {
        user.score = Math.round((user.correct_answers / user.total_questions) * 100);
      });

      setQuizResults(Object.values(userScores));
    }

    // Fetch LKPD answers with module_id
    const { data: lkpdData } = await supabase
      .from('lkpd_answers')
      .select('id, user_id, problem_id, answer, submitted_at, module_id')
      .order('submitted_at', { ascending: false });

    if (lkpdData) {
      setLkpdAnswers(lkpdData.map((item: any) => {
        const profile = profilesMap[item.user_id];
        return {
          id: item.id,
          user_id: item.user_id,
          full_name: profile?.full_name || 'Unknown',
          kelas: profile?.kelas || '-',
          problem_id: item.problem_id,
          answer: item.answer,
          submitted_at: item.submitted_at,
          feedback: fbMap[`lkpd-${item.id}`],
          module_id: item.module_id
        };
      }));
    }

    // Fetch trigger answers (only pemantik, not refleksi)
    const { data: triggerData } = await supabase
      .from('trigger_answers')
      .select('id, user_id, module_id, question_id, answer, submitted_at')
      .not('module_id', 'like', '%-refleksi')
      .order('submitted_at', { ascending: false });

    if (triggerData) {
      setTriggerAnswers(triggerData.map((item: any) => {
        const profile = profilesMap[item.user_id];
        return {
          id: item.id,
          user_id: item.user_id,
          full_name: profile?.full_name || 'Unknown',
          kelas: profile?.kelas || '-',
          question_id: item.question_id,
          answer: item.answer,
          submitted_at: item.submitted_at,
          feedback: fbMap[`trigger-${item.id}`],
          module_id: item.module_id
        };
      }));
    }

    // Fetch reflection answers
    const { data: reflectionData } = await supabase
      .from('trigger_answers')
      .select('id, user_id, module_id, question_id, answer, submitted_at')
      .like('module_id', '%-refleksi')
      .order('submitted_at', { ascending: false });

    if (reflectionData) {
      setReflectionAnswers(reflectionData.map((item: any) => {
        const profile = profilesMap[item.user_id];
        return {
          id: item.id,
          user_id: item.user_id,
          full_name: profile?.full_name || 'Unknown',
          kelas: profile?.kelas || '-',
          question_id: item.question_id,
          answer: item.answer,
          submitted_at: item.submitted_at,
          feedback: fbMap[`reflection-${item.id}`],
          module_id: item.module_id
        };
      }));
    }

    // Fetch quiz status
    const { data: settingsData } = await supabase
      .from('quiz_settings' as any)
      .select('*');

    if (settingsData) {
      const settingsMap: Record<string, boolean> = {};
      (settingsData as any[]).forEach((s: any) => {
        settingsMap[s.module_id] = s.is_active;
      });
      setQuizSettings(settingsMap);
    }

    setLoading(false);
  };

  // Realtime Subscription
  useEffect(() => {
    const channels = supabase.channel('custom-all-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quiz_answers' }, () => fetchStudentData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lkpd_answers' }, () => fetchStudentData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trigger_answers' }, () => fetchStudentData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teacher_feedback' }, () => fetchStudentData())
      .subscribe();

    return () => {
      supabase.removeChannel(channels);
    };
  }, []);

  const handleToggleQuiz = async (isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('quiz_settings' as any)
        .upsert({
          module_id: currentModuleId,
          is_active: isActive,
          updated_at: new Date().toISOString()
        } as any, { onConflict: 'module_id' });

      if (error) throw error;

      setQuizSettings(prev => ({ ...prev, [currentModuleId]: isActive }));
      toast.success(`Kuis berhasil ${isActive ? 'dibuka' : 'ditutup'}`);
    } catch (error) {
      console.error('Error updating quiz status:', error);
      toast.error('Gagal mengubah status kuis');
    }
  };

  // Helper for sorting by name
  const sortByName = (a: { full_name: string }, b: { full_name: string }) => {
    return a.full_name.localeCompare(b.full_name);
  };

  // Filter functions based on mapel and kelas
  const filteredQuizResults = useMemo(() => {
    let results = quizResults.filter(r => mapelKelas.includes(r.kelas));
    if (selectedKelas !== 'all') {
      results = results.filter(r => r.kelas === selectedKelas);
    }
    // Filter by module type
    if (selectedMapel === 'pkwu') {
      results = results.filter(r => r.module_id === 'kerajinan-limbah' || !r.module_id);
    } else {
      results = results.filter(r => r.module_id === 'permintaan' || !r.module_id);
    }
    return results.sort(sortByName);
  }, [quizResults, mapelKelas, selectedKelas, selectedMapel]);

  const filteredLkpdAnswers = useMemo(() => {
    let answers = lkpdAnswers.filter(a => mapelKelas.includes(a.kelas));
    if (selectedKelas !== 'all') {
      answers = answers.filter(a => a.kelas === selectedKelas);
    }
    return answers.sort(sortByName);
  }, [lkpdAnswers, mapelKelas, selectedKelas]);

  const filteredTriggerAnswers = useMemo(() => {
    let answers = triggerAnswers.filter(a => mapelKelas.includes(a.kelas));
    if (selectedKelas !== 'all') {
      answers = answers.filter(a => a.kelas === selectedKelas);
    }
    return answers.sort(sortByName);
  }, [triggerAnswers, mapelKelas, selectedKelas]);

  const filteredReflectionAnswers = useMemo(() => {
    let answers = reflectionAnswers.filter(a => mapelKelas.includes(a.kelas));
    if (selectedKelas !== 'all') {
      answers = answers.filter(a => a.kelas === selectedKelas);
    }
    return answers.sort(sortByName);
  }, [reflectionAnswers, mapelKelas, selectedKelas]);

  // Questions based on mapel
  const triggerQuestions = selectedMapel === 'ekonomi' ? [
    { id: 1, question: "Pernahkah kamu memperhatikan saat ada diskon besar-besaran, mengapa orang jadi lebih banyak membeli?" },
    { id: 2, question: "Jika uang sakumu naik 2x lipat, apakah kamu akan membeli lebih banyak jajanan? Mengapa?" },
    { id: 3, question: "Ketika harga pulsa mahal, apa yang biasanya kamu lakukan? Apakah mencari alternatif lain?" },
  ] : [
    { id: 1, question: "Pernahkah kamu melihat sampah plastik atau kardus di sekitarmu? Menurut kamu, bisakah sampah tersebut diubah menjadi sesuatu yang berguna?" },
    { id: 2, question: "Jika kamu bisa membuat kerajinan dari barang bekas, produk apa yang akan kamu buat dan siapa yang akan membelinya?" },
    { id: 3, question: "Menurutmu, mengapa produk dari bahan daur ulang semakin diminati orang-orang sekarang?" },
  ];

  const lkpdProblems = selectedMapel === 'ekonomi' ? [
    { id: 1, title: "Soal 1: Penjualan Es Teh di Kantin" },
    { id: 2, title: "Soal 2: Penjualan Pulpen di Koperasi" },
    { id: 3, title: "Soal 3: Penjualan Bakso di Stadion" },
    { id: 4, title: "Soal 4: Analisis Kasus" },
  ] : [
    { id: 1, title: "Soal 1: Identifikasi Limbah" },
    { id: 2, title: "Soal 2: Analisis Peluang Usaha" },
    { id: 3, title: "Soal 3: Desain Produk" },
    { id: 4, title: "Soal 4: Analisis SWOT" },
  ];

  const reflectionQuestions = [
    { id: 1, question: "Bagaimana perasaanmu belajar hari ini?" },
    { id: 2, question: "Apa yang kamu sukai dari pembelajaran hari ini?" },
    { id: 3, question: "Menurut Anda bagaimana belajar menggunakan media e-modul ini?" },
    { id: 4, question: "Apa yang perlu ditambahkan dari media pembelajaran e-modul ini?" },
    { id: 5, question: "Apa yang kamu sukai dari Bapak Bagus Panca Wiratama, S.Pd., M.Pd.? (Boleh Kritik dan Saran)" },
  ];

  const currentModule = selectedMapel === 'ekonomi' ? demandModule : pkwuModule;
  const currentModuleId = selectedMapel === 'ekonomi' ? 'permintaan' : 'kerajinan-limbah';
  const currentLkpdAnswerKeys = selectedMapel === 'ekonomi' ? lkpdAnswerKeys : lkpdAnswerKeysPKWU;

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  // Mapel & Filter Components
  const MapelSelector = () => (
    <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
      <Button
        variant={selectedMapel === 'ekonomi' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setSelectedMapel('ekonomi')}
        className={`gap-2 ${selectedMapel === 'ekonomi' ? 'bg-gradient-to-r from-teal-500 to-cyan-500' : ''}`}
      >
        <TrendingUp className="h-4 w-4" /> Ekonomi
      </Button>
      <Button
        variant={selectedMapel === 'pkwu' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setSelectedMapel('pkwu')}
        className={`gap-2 ${selectedMapel === 'pkwu' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : ''}`}
      >
        <Recycle className="h-4 w-4" /> PKWU
      </Button>
    </div>
  );

  const KelasFilter = () => (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedKelas} onValueChange={setSelectedKelas}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter Kelas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kelas</SelectItem>
          {filteredAvailableKelas.map(kelas => (
            <SelectItem key={kelas} value={kelas}>Kelas {kelas}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedMapel === 'ekonomi' ? 'bg-gradient-to-r from-teal-500 to-cyan-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}>
                {selectedMapel === 'ekonomi' ? <TrendingUp className="h-4 w-4 text-white" /> : <Recycle className="h-4 w-4 text-white" />}
              </div>
              <span className="font-display font-bold text-gradient">E-Modul Bagoes</span>
            </Link>
            <Badge variant="secondary">Guru</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2"><Home className="h-4 w-4" /> Beranda</Button>
            </Link>
            <Button variant="outline" size="sm" onClick={signOut} className="gap-2"><LogOut className="h-4 w-4" /> Keluar</Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8">
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-display font-bold mb-2">
                  Dashboard Guru (v2) - {selectedMapel === 'ekonomi' ? 'Ekonomi' : 'PKWU'}
                </h1>
                <p className="text-muted-foreground">
                  {selectedMapel === 'ekonomi' ? 'Kelola modul Ekonomi untuk Kelas X.9 - X.11' : 'Kelola modul PKWU untuk Kelas XI.3 - XI.11'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/backup">
                  <Button variant="outline" className="gap-2 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10">
                    <Database className="h-4 w-4" /> Backup Data
                  </Button>
                </Link>
                <Link to="/guru/kelola-siswa">
                  <Button variant="outline" className="gap-2"><Users className="h-4 w-4" /> Kelola Siswa</Button>
                </Link>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <MapelSelector />
              <KelasFilter />
              <div className="ml-auto flex items-center gap-3 bg-card border rounded-lg p-2 shadow-sm">
                <div className={`p-1.5 rounded-full ${quizSettings[currentModuleId] ? 'bg-success/20 text-success' : 'bg-destructive/10 text-destructive'}`}>
                  {quizSettings[currentModuleId] ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                </div>
                <div className="flex flex-col"><span className="text-sm font-medium">Status Kuis</span><span className="text-xs text-muted-foreground">{quizSettings[currentModuleId] ? 'Terbuka' : 'Tertutup'}</span></div>
                <Switch checked={quizSettings[currentModuleId] || false} onCheckedChange={handleToggleQuiz} />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid sm:grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedMapel === 'ekonomi' ? 'bg-primary/10 text-primary' : 'bg-green-500/10 text-green-500'}`}>
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{filteredQuizResults.length}</p>
                    <p className="text-sm text-muted-foreground">Kuis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedMapel === 'ekonomi' ? 'bg-secondary/20 text-secondary' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    <ClipboardList className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{new Set(filteredLkpdAnswers.map(a => a.user_id)).size}</p>
                    <p className="text-sm text-muted-foreground">LKPD</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center"><MessageCircle className="h-6 w-6 text-warning" /></div>
                  <div>
                    <p className="text-2xl font-bold">{new Set(filteredTriggerAnswers.map(a => a.user_id)).size}</p>
                    <p className="text-sm text-muted-foreground">Pemantik</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center"><Lightbulb className="h-6 w-6 text-amber-500" /></div>
                  <div>
                    <p className="text-2xl font-bold">{new Set(filteredReflectionAnswers.map(a => a.user_id)).size}</p>
                    <p className="text-sm text-muted-foreground">Refleksi</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center"><CheckCircle2 className="h-6 w-6 text-success" /></div>
                  <div>
                    <p className="text-2xl font-bold">
                      {filteredQuizResults.length > 0 ? Math.round(filteredQuizResults.reduce((acc, r) => acc + r.score, 0) / filteredQuizResults.length) : 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">Rata-rata</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Tabs defaultValue="trigger-answers" className="w-full">
              <TabsList className="w-full grid grid-cols-6 mb-6">
                <TabsTrigger value="trigger-answers" className="gap-2"><MessageCircle className="h-4 w-4" /> <span className="hidden sm:inline">Pemantik</span></TabsTrigger>
                <TabsTrigger value="reflection-answers" className="gap-2"><Lightbulb className="h-4 w-4" /> <span className="hidden sm:inline">Refleksi</span></TabsTrigger>
                <TabsTrigger value="lkpd-answers" className="gap-2"><ClipboardList className="h-4 w-4" /> <span className="hidden sm:inline">LKPD</span></TabsTrigger>
                <TabsTrigger value="quiz-results" className="gap-2"><CheckCircle2 className="h-4 w-4" /> <span className="hidden sm:inline">Kuis</span></TabsTrigger>
                <TabsTrigger value="answer-keys" className="gap-2"><FileText className="h-4 w-4" /> <span className="hidden sm:inline">Kunci</span></TabsTrigger>
                <TabsTrigger value="reset" className="gap-2"><RefreshCw className="h-4 w-4" /> <span className="hidden sm:inline">Reset</span></TabsTrigger>
              </TabsList>

              <TabsContent value="trigger-answers">
                <Card>
                  <CardHeader>
                    <CardTitle>Jawaban Pertanyaan Pemantik</CardTitle>
                    <CardDescription>Jawaban siswa sebelum materi</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {filteredTriggerAnswers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground"><p>Belum ada data.</p></div>
                    ) : (
                      <div className="space-y-6">
                        {triggerQuestions.map((q) => {
                          const answersForQuestion = filteredTriggerAnswers.filter(a => a.question_id === q.id);
                          const totalAnswers = answersForQuestion.length;
                          const startIndex = (currentPageTrigger - 1) * ITEMS_PER_PAGE;
                          const paginated = answersForQuestion.slice(startIndex, startIndex + ITEMS_PER_PAGE);

                          return (
                            <div key={q.id} className="border rounded-xl overflow-hidden shadow-sm">
                              <div className={`p-4 ${selectedMapel === 'pkwu' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-muted/50'} border-b`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline">Pertanyaan {q.id}</Badge>
                                  <Badge variant="secondary">{totalAnswers} jawaban</Badge>
                                </div>
                                <p className="font-medium text-lg">{q.question}</p>
                              </div>
                              <div className="divide-y bg-card">
                                {paginated.map((answer, i) => (
                                  <div key={i} className="p-4 hover:bg-accent/5 transition-colors">
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <p className="font-semibold text-primary">{answer.full_name}</p>
                                        <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                                          <Badge variant="outline" className="text-[10px] h-5">Kelas {answer.kelas}</Badge>
                                          <span>{new Date(answer.submitted_at).toLocaleDateString()}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <p className="text-sm bg-muted/30 p-3 rounded-lg border border-border/50">{answer.answer}</p>
                                    <FeedbackForm studentId={answer.user_id} answerId={answer.id} answerType="trigger" existingFeedback={answer.feedback} onFeedbackSaved={fetchStudentData} />
                                  </div>
                                ))}
                              </div>
                              {totalAnswers > ITEMS_PER_PAGE && (
                                <div className="p-4 border-t bg-muted/20 flex justify-center gap-2">
                                  <Button size="sm" variant="ghost" disabled={currentPageTrigger === 1} onClick={() => setCurrentPageTrigger(p => p - 1)}>Prev</Button>
                                  <span className="self-center text-sm">{currentPageTrigger}</span>
                                  <Button size="sm" variant="ghost" disabled={paginated.length < ITEMS_PER_PAGE} onClick={() => setCurrentPageTrigger(p => p + 1)}>Next</Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reflection-answers">
                <Card>
                  <CardHeader>
                    <CardTitle>Jawaban Refleksi</CardTitle>
                    <CardDescription>Refleksi pembelajaran siswa</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {filteredReflectionAnswers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground"><p>Belum ada data.</p></div>
                    ) : (
                      <div className="space-y-6">
                        {reflectionQuestions.map((q) => {
                          const answersForQuestion = filteredReflectionAnswers.filter(a => a.question_id === q.id);
                          const totalAnswers = answersForQuestion.length;
                          const startIndex = (currentPageReflection - 1) * ITEMS_PER_PAGE;
                          const paginated = answersForQuestion.slice(startIndex, startIndex + ITEMS_PER_PAGE);

                          return (
                            <div key={q.id} className="border rounded-xl overflow-hidden shadow-sm">
                              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-b">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="border-amber-500 text-amber-700">Refleksi {q.id}</Badge>
                                  <Badge variant="secondary">{totalAnswers} jawaban</Badge>
                                </div>
                                <p className="font-medium">{q.question}</p>
                              </div>
                              <div className="divide-y bg-card">
                                {paginated.map((answer, i) => (
                                  <div key={i} className="p-4 hover:bg-accent/5 transition-colors">
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <p className="font-semibold text-primary">{answer.full_name}</p>
                                        <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                                          <Badge variant="outline" className="text-[10px] h-5">Kelas {answer.kelas}</Badge>
                                          <span>{new Date(answer.submitted_at).toLocaleDateString()}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <p className="text-sm bg-muted/30 p-3 rounded-lg border border-border/50">{answer.answer}</p>
                                    <FeedbackForm studentId={answer.user_id} answerId={answer.id} answerType="reflection" existingFeedback={answer.feedback} onFeedbackSaved={fetchStudentData} />
                                  </div>
                                ))}
                              </div>
                              {totalAnswers > ITEMS_PER_PAGE && (
                                <div className="p-4 border-t bg-muted/20 flex justify-center gap-2">
                                  <Button size="sm" variant="ghost" disabled={currentPageReflection === 1} onClick={() => setCurrentPageReflection(p => p - 1)}>Prev</Button>
                                  <span className="self-center text-sm">{currentPageReflection}</span>
                                  <Button size="sm" variant="ghost" disabled={paginated.length < ITEMS_PER_PAGE} onClick={() => setCurrentPageReflection(p => p + 1)}>Next</Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="lkpd-answers">
                <Card>
                  <CardHeader>
                    <CardTitle>Jawaban LKPD</CardTitle>
                    <CardDescription>Jawaban lembar kerja siswa</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {filteredLkpdAnswers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground"><p>Belum ada data.</p></div>
                    ) : (
                      <div className="space-y-6">
                        {lkpdProblems.map((q) => {
                          const answersForQuestion = filteredLkpdAnswers.filter(a => a.problem_id === q.id);
                          const totalAnswers = answersForQuestion.length;
                          const startIndex = (currentPageLkpd - 1) * ITEMS_PER_PAGE;
                          const paginated = answersForQuestion.slice(startIndex, startIndex + ITEMS_PER_PAGE);

                          return (
                            <div key={q.id} className="border rounded-xl overflow-hidden shadow-sm">
                              <div className={`p-4 ${selectedMapel === 'pkwu' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-muted/50'} border-b`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline">Soal {q.id}</Badge>
                                  <Badge variant="secondary">{totalAnswers} jawaban</Badge>
                                </div>
                                <p className="font-medium text-lg">{q.title}</p>
                              </div>
                              <div className="divide-y bg-card">
                                {paginated.map((answer, i) => (
                                  <div key={i} className="p-4 hover:bg-accent/5 transition-colors">
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <p className="font-semibold text-primary">{answer.full_name}</p>
                                        <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                                          <Badge variant="outline" className="text-[10px] h-5">Kelas {answer.kelas}</Badge>
                                          <span>{new Date(answer.submitted_at).toLocaleDateString()}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <p className="text-sm bg-muted/30 p-3 rounded-lg font-mono whitespace-pre-wrap border border-border/50">{answer.answer}</p>
                                    <FeedbackForm studentId={answer.user_id} answerId={answer.id} answerType="lkpd" existingFeedback={answer.feedback} onFeedbackSaved={fetchStudentData} />
                                  </div>
                                ))}
                              </div>
                              {totalAnswers > ITEMS_PER_PAGE && (
                                <div className="p-4 border-t bg-muted/20 flex justify-center gap-2">
                                  <Button size="sm" variant="ghost" disabled={currentPageLkpd === 1} onClick={() => setCurrentPageLkpd(p => p - 1)}>Prev</Button>
                                  <span className="self-center text-sm">{currentPageLkpd}</span>
                                  <Button size="sm" variant="ghost" disabled={paginated.length < ITEMS_PER_PAGE} onClick={() => setCurrentPageLkpd(p => p + 1)}>Next</Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="quiz-results">
                <Card>
                  <CardHeader>
                    <CardTitle>Hasil Kuis</CardTitle>
                    <CardDescription>Rekap nilai kuis siswa</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {filteredQuizResults.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground"><p>Belum ada data nilai.</p></div>
                    ) : (
                      <>
                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Nama Siswa</TableHead>
                                <TableHead>Kelas</TableHead>
                                <TableHead>Skor</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredQuizResults
                                .slice((currentPageQuiz - 1) * ITEMS_PER_PAGE, currentPageQuiz * ITEMS_PER_PAGE)
                                .map((result, i) => (
                                  <TableRow key={i}>
                                    <TableCell>{(currentPageQuiz - 1) * ITEMS_PER_PAGE + i + 1}</TableCell>
                                    <TableCell className="font-medium">{result.full_name}</TableCell>
                                    <TableCell>{result.kelas}</TableCell>
                                    <TableCell>
                                      <Badge variant={result.score >= 70 ? 'default' : 'destructive'} className={result.score >= 70 ? 'bg-success hover:bg-success/90' : ''}>
                                        {result.score}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      {result.score >= 70 ? <span className="text-success flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Lulus</span> : <span className="text-destructive flex items-center gap-1"><XCircle className="h-4 w-4" /> Belum Lulus</span>}
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </div>
                        {filteredQuizResults.length > ITEMS_PER_PAGE && (
                          <div className="flex justify-center gap-4 mt-6">
                            <Button variant="outline" size="sm" onClick={() => setCurrentPageQuiz(p => Math.max(1, p - 1))} disabled={currentPageQuiz === 1}><ChevronLeft className="h-4 w-4 mr-1" /> Prev</Button>
                            <span className="text-sm font-medium self-center">Halaman {currentPageQuiz} dari {Math.ceil(filteredQuizResults.length / ITEMS_PER_PAGE)}</span>
                            <Button variant="outline" size="sm" onClick={() => setCurrentPageQuiz(p => Math.min(Math.ceil(filteredQuizResults.length / ITEMS_PER_PAGE), p + 1))} disabled={currentPageQuiz === Math.ceil(filteredQuizResults.length / ITEMS_PER_PAGE)}>Next <ChevronRight className="h-4 w-4 ml-1" /></Button>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="answer-keys">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Kunci Jawaban LKPD - {selectedMapel === 'ekonomi' ? 'Ekonomi' : 'PKWU'}</CardTitle>
                      <CardDescription>Panduan penilaian untuk jawaban isian panjang (essay)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {(selectedMapel === 'ekonomi' ? lkpdAnswerKeys : lkpdAnswerKeysPKWU)?.map((key: { id: number; title: string; verification?: string[]; steps?: string[] }) => (
                          <div key={key.id} className="border rounded-lg p-4 bg-muted/30">
                            <button onClick={() => setExpandedAnswerKey(expandedAnswerKey === key.id ? null : key.id)} className="flex items-center justify-between w-full font-medium text-left">
                              <span>{key.title}</span>
                              {expandedAnswerKey === key.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                            {expandedAnswerKey === key.id && (
                              <div className="mt-4 pl-4 border-l-2 border-primary/20 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <h4 className="text-sm font-semibold text-muted-foreground">Verifikasi / Kriteria Jawaban:</h4>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                  {(key.verification || key.steps || []).map((step, i) => (
                                    <li key={i}>{step}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Kunci Jawaban Kuis - {selectedMapel === 'ekonomi' ? 'Ekonomi' : 'PKWU'}</CardTitle>
                      <CardDescription>Jawaban benar untuk soal pilihan ganda</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                        <div className="grid gap-4">
                          {Object.values(selectedMapel === 'ekonomi' ? quizAnswerKeysEkonomi : quizAnswerKeysPKWU).map((key: any, index: number) => (
                            <div key={index} className="pb-4 border-b last:border-0 last:pb-0">
                              <p className="font-medium mb-1">Soal {index + 1}</p>
                              <p className="text-sm text-green-600 font-bold mb-1">Jawaban: {(['A', 'B', 'C', 'D', 'E'] as const)[key.correctAnswer] || key.correctAnswer}</p>
                              <p className="text-xs text-muted-foreground bg-muted p-2 rounded">💡 {key.explanation}</p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="reset">
                <ResetStudentWork
                  students={allStudents}
                  moduleId={currentModuleId}
                  onReset={fetchStudentData}
                />
              </TabsContent>

            </Tabs>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}