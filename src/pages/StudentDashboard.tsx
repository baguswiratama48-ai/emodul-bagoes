import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ClipboardList,
  MessageCircle,
  BookOpen,
  LogOut,
  Home,
  Trophy,
  FileText,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { demandModule } from '@/data/moduleContent';
import { pkwuModule } from '@/data/pkwuModuleContent';

interface QuizAnswer {
  question_id: string;
  selected_answer: number;
  is_correct: boolean;
  answered_at: string;
}

interface LkpdAnswer {
  id: string;
  problem_id: number;
  answer: string;
  submitted_at: string;
}

interface TriggerAnswer {
  id: string;
  question_id: number;
  answer: string;
  submitted_at: string;
}

interface TeacherFeedback {
  id: string;
  answer_id: string;
  answer_type: 'trigger' | 'lkpd' | 'reflection';
  feedback: string;
  created_at: string;
}

// Kelas untuk mapel Ekonomi
const EKONOMI_KELAS = ['X.9', 'X.10', 'X.11'];
// Kelas untuk mapel PKWU
const PKWU_KELAS = ['XI.3', 'XI.5', 'XI.6', 'XI.7', 'XI.8', 'XI.9', 'XI.10', 'XI.11'];

// Trigger questions untuk Ekonomi
const ekonomiTriggerQuestions = [
  { id: 1, question: "Pernahkah kamu memperhatikan saat ada diskon besar-besaran, mengapa orang jadi lebih banyak membeli?" },
  { id: 2, question: "Jika uang sakumu naik 2x lipat, apakah kamu akan membeli lebih banyak jajanan? Mengapa?" },
  { id: 3, question: "Ketika harga pulsa mahal, apa yang biasanya kamu lakukan? Apakah mencari alternatif lain?" },
];

// Trigger questions untuk PKWU
const pkwuTriggerQuestions = [
  { id: 1, question: "Pernahkah kamu melihat sampah plastik atau kardus di sekitarmu? Menurut kamu, bisakah sampah tersebut diubah menjadi sesuatu yang berguna?" },
  { id: 2, question: "Jika kamu bisa membuat kerajinan dari barang bekas, produk apa yang akan kamu buat dan siapa yang akan membelinya?" },
  { id: 3, question: "Menurutmu, mengapa produk dari bahan daur ulang semakin diminati orang-orang sekarang?" },
];

// LKPD problems untuk Ekonomi
const ekonomiLkpdProblems = [
  { id: 1, title: "Soal 1: Penjualan Es Teh di Kantin" },
  { id: 2, title: "Soal 2: Penjualan Pulpen di Koperasi" },
  { id: 3, title: "Soal 3: Penjualan Bakso di Stadion" },
  { id: 4, title: "Soal 4: Analisis Kasus" },
];

// LKPD problems untuk PKWU
const pkwuLkpdProblems = [
  { id: 1, title: "Soal 1: Identifikasi Limbah" },
  { id: 2, title: "Soal 2: Analisis Peluang Usaha" },
  { id: 3, title: "Soal 3: Desain Produk" },
  { id: 4, title: "Soal 4: Analisis SWOT" },
];

export default function StudentDashboard() {
  const { user, signOut } = useAuth();
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [lkpdAnswers, setLkpdAnswers] = useState<LkpdAnswer[]>([]);
  const [triggerAnswers, setTriggerAnswers] = useState<TriggerAnswer[]>([]);
  const [feedbackList, setFeedbackList] = useState<TeacherFeedback[]>([]);
  const [notesCount, setNotesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [nis, setNis] = useState('');
  const [kelas, setKelas] = useState('');

  // Determine if student is in PKWU class based on their kelas
  const isPKWU = PKWU_KELAS.includes(kelas);
  const currentModule = isPKWU ? pkwuModule : demandModule;
  const triggerQuestions = isPKWU ? pkwuTriggerQuestions : ekonomiTriggerQuestions;
  const lkpdProblems = isPKWU ? pkwuLkpdProblems : ekonomiLkpdProblems;

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    if (!user) return;
    setLoading(true);

    // Fetch profile with NIS and kelas first
    const { data: profileData } = await supabase
      .from('profiles')
      .select('full_name, nis, kelas')
      .eq('id', user.id)
      .maybeSingle();

    let studentKelas = '';
    if (profileData) {
      setFullName(profileData.full_name || 'Siswa');
      setNis(profileData.nis || '-');
      setKelas(profileData.kelas || '-');
      studentKelas = profileData.kelas || '';
    }

    // Determine module based on kelas
    const studentIsPKWU = PKWU_KELAS.includes(studentKelas);
    const moduleId = studentIsPKWU ? pkwuModule.id : demandModule.id;

    // Fetch quiz answers for the correct module
    const { data: quizData } = await supabase
      .from('quiz_answers')
      .select('question_id, selected_answer, is_correct, answered_at')
      .eq('user_id', user.id)
      .eq('module_id', moduleId)
      .order('answered_at', { ascending: false });

    if (quizData) {
      setQuizAnswers(quizData);
    }

    // Fetch LKPD answers for the correct module
    const { data: lkpdData } = await supabase
      .from('lkpd_answers')
      .select('id, problem_id, answer, submitted_at')
      .eq('user_id', user.id)
      .eq('module_id', moduleId)
      .order('submitted_at', { ascending: false });

    if (lkpdData) {
      setLkpdAnswers(lkpdData);
    }

    // Fetch trigger answers for the correct module
    const { data: triggerData } = await supabase
      .from('trigger_answers')
      .select('id, question_id, answer, submitted_at')
      .eq('user_id', user.id)
      .eq('module_id', moduleId)
      .order('submitted_at', { ascending: false });

    if (triggerData) {
      setTriggerAnswers(triggerData);
    }

    // Fetch teacher feedback
    const { data: feedbackData } = await supabase
      .from('teacher_feedback')
      .select('*')
      .eq('student_id', user.id);

    if (feedbackData) {
      setFeedbackList(feedbackData as TeacherFeedback[]);
    }

    // Fetch notes count
    const { count } = await supabase
      .from('student_notes' as any)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    setNotesCount(count || 0);

    setLoading(false);
  };

  // Calculate quiz score
  const correctAnswers = quizAnswers.filter(a => a.is_correct).length;
  const quizScore = quizAnswers.length > 0 ? Math.round((correctAnswers / quizAnswers.length) * 100) : 0;

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-bold text-gradient">E-Modul Bagoes</span>
            </Link>
            <Badge variant="secondary">Siswa</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Beranda
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          {/* Page Header */}
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-display font-bold mb-2">Halo, {fullName}! 👋</h1>
            <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
              <span>Lihat progress dan hasil belajarmu</span>
              {nis !== '-' && (
                <Badge variant="outline" className="font-mono">NIS: {nis}</Badge>
              )}
              {kelas !== '-' && (
                <Badge variant="secondary">Kelas {kelas}</Badge>
              )}
              <Badge className={isPKWU ? 'bg-green-600' : 'bg-primary'}>
                {isPKWU ? 'PKWU' : 'Ekonomi'}
              </Badge>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{quizScore}%</p>
                    <p className="text-sm text-muted-foreground">Nilai Kuis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{quizAnswers.length}/{currentModule.quizQuestions.length}</p>
                    <p className="text-sm text-muted-foreground">Kuis Dijawab</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <ClipboardList className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{lkpdAnswers.length}/{lkpdProblems.length}</p>
                    <p className="text-sm text-muted-foreground">LKPD Dikerjakan</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Link to="/upload-catatan">
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{notesCount}</p>
                      <p className="text-sm text-muted-foreground">Catatan Diupload</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          {/* Main Content */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="quiz" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="quiz" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  Hasil Kuis
                </TabsTrigger>
                <TabsTrigger value="lkpd" className="gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Jawaban LKPD
                </TabsTrigger>
                <TabsTrigger value="trigger" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Pemantik
                </TabsTrigger>
              </TabsList>

              {/* Quiz Results Tab */}
              <TabsContent value="quiz" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Hasil Kuis
                    </CardTitle>
                    <CardDescription>Lihat hasil dan review jawabanmu</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : quizAnswers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="mb-4">Kamu belum mengerjakan kuis</p>
                        <Link to={`/module/${currentModule.id}/kuis`}>
                          <Button>Mulai Kuis</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Score Summary */}
                        <div className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl text-center">
                          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${quizScore >= 70 ? 'bg-success/10' : 'bg-destructive/10'
                            }`}>
                            <span className="text-3xl font-bold">{quizScore}%</span>
                          </div>
                          <p className="text-lg font-medium">
                            {quizScore >= 70 ? '🎉 Selamat! Kamu lulus!' : '💪 Terus belajar ya!'}
                          </p>
                          <p className="text-muted-foreground">
                            {correctAnswers} dari {quizAnswers.length} jawaban benar
                          </p>
                          <Progress value={quizScore} className="mt-4 h-3" />
                        </div>

                        {/* Answer Review */}
                        <div className="space-y-4">
                          <h4 className="font-semibold">Review Jawaban</h4>
                          {currentModule.quizQuestions.map((q, index) => {
                            const answer = quizAnswers.find(a => a.question_id === q.id);
                            if (!answer) return null;
                            return (
                              <div key={q.id} className={`p-4 border rounded-lg ${answer.is_correct ? 'border-success/50 bg-success/5' : 'border-destructive/50 bg-destructive/5'}`}>
                                <div className="flex items-start gap-3">
                                  {answer.is_correct ? (
                                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                                  ) : (
                                    <FileText className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                                  )}
                                  <div className="flex-1">
                                    <p className="font-medium mb-2">{index + 1}. {q.question}</p>
                                    <p className="text-sm text-muted-foreground mb-1">
                                      Jawabanmu: <span className={answer.is_correct ? 'text-success' : 'text-destructive'}>{q.options[answer.selected_answer]}</span>
                                    </p>
                                    {!answer.is_correct && (
                                      <p className="text-sm text-success">Jawaban benar: {q.options[q.correctAnswer]}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* LKPD Answers Tab */}
              <TabsContent value="lkpd" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5" />
                      Jawaban LKPD
                    </CardTitle>
                    <CardDescription>Jawaban yang sudah kamu kumpulkan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : lkpdAnswers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="mb-4">Kamu belum mengerjakan LKPD</p>
                        <Link to={`/module/${currentModule.id}/lkpd`}>
                          <Button>Kerjakan LKPD</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {lkpdProblems.map((problem) => {
                          const answer = lkpdAnswers.find(a => a.problem_id === problem.id);
                          return (
                            <div key={problem.id} className="border rounded-lg overflow-hidden">
                              <div className="p-4 bg-muted/50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">Soal {problem.id}</Badge>
                                  <span className="font-medium">{problem.title}</span>
                                </div>
                                {answer ? (
                                  <Badge variant="default" className="bg-success">Sudah Dijawab</Badge>
                                ) : (
                                  <Badge variant="secondary">Belum Dijawab</Badge>
                                )}
                              </div>
                              {answer && (
                                <div className="p-4">
                                  <p className="text-xs text-muted-foreground mb-2">
                                    Dikumpulkan: {new Date(answer.submitted_at).toLocaleDateString('id-ID', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                  <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
                                    {answer.answer}
                                  </div>

                                  {/* Teacher Feedback */}
                                  {feedbackList.find(f => f.answer_type === 'lkpd' && f.answer_id === answer.id) && (
                                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                      <div className="flex items-center gap-2 mb-1 text-blue-700 dark:text-blue-400">
                                        <MessageSquare className="h-4 w-4" />
                                        <span className="font-medium text-sm">Feedback Guru</span>
                                      </div>
                                      <p className="text-sm text-blue-800 dark:text-blue-300">
                                        {feedbackList.find(f => f.answer_type === 'lkpd' && f.answer_id === answer.id)?.feedback}
                                      </p>
                                    </div>
                                  )}
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

              {/* Trigger Answers Tab */}
              <TabsContent value="trigger" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Jawaban Pertanyaan Pemantik
                    </CardTitle>
                    <CardDescription>Refleksi awalmu sebelum mempelajari materi</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : triggerAnswers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="mb-4">Kamu belum menjawab pertanyaan pemantik</p>
                        <Link to={`/module/${currentModule.id}/pemantik`}>
                          <Button>Jawab Pertanyaan</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {triggerQuestions.map((q) => {
                          const answer = triggerAnswers.find(a => a.question_id === q.id);
                          return (
                            <div key={q.id} className="border rounded-lg overflow-hidden">
                              <div className="p-4 bg-muted/50">
                                <div className="flex items-start gap-3">
                                  <Badge variant="outline" className="flex-shrink-0">{q.id}</Badge>
                                  <p className="font-medium">{q.question}</p>
                                </div>
                              </div>
                              {answer ? (
                                <div className="p-4">
                                  <p className="text-xs text-muted-foreground mb-2">
                                    Dijawab: {new Date(answer.submitted_at).toLocaleDateString('id-ID', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                  <div className="bg-muted/30 rounded-lg p-4 text-sm">
                                    {answer.answer}
                                  </div>

                                  {/* Teacher Feedback */}
                                  {feedbackList.find(f => f.answer_type === 'trigger' && f.answer_id === answer.id) && (
                                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                      <div className="flex items-center gap-2 mb-1 text-blue-700 dark:text-blue-400">
                                        <MessageSquare className="h-4 w-4" />
                                        <span className="font-medium text-sm">Feedback Guru</span>
                                      </div>
                                      <p className="text-sm text-blue-800 dark:text-blue-300">
                                        {feedbackList.find(f => f.answer_type === 'trigger' && f.answer_id === answer.id)?.feedback}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="p-4 text-center text-muted-foreground text-sm">
                                  Belum dijawab
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Link to answer more if not all answered */}
                        {triggerAnswers.length < triggerQuestions.length && (
                          <div className="text-center pt-4">
                            <Link to={`/module/${currentModule.id}/pemantik`}>
                              <Button variant="outline">Lanjut Menjawab</Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main >
    </div >
  );
}
