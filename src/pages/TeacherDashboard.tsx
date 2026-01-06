import { useState, useEffect } from 'react';
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
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { lkpdAnswerKeys } from '@/data/answerKeys';
import { demandModule } from '@/data/moduleContent';

interface StudentQuizResult {
  user_id: string;
  full_name: string;
  total_questions: number;
  correct_answers: number;
  score: number;
}

interface StudentLkpdAnswer {
  user_id: string;
  full_name: string;
  problem_id: number;
  answer: string;
  submitted_at: string;
}

interface StudentTriggerAnswer {
  user_id: string;
  full_name: string;
  question_id: number;
  answer: string;
  submitted_at: string;
}

export default function TeacherDashboard() {
  const { user, signOut, isGuru } = useAuth();
  const [quizResults, setQuizResults] = useState<StudentQuizResult[]>([]);
  const [lkpdAnswers, setLkpdAnswers] = useState<StudentLkpdAnswer[]>([]);
  const [triggerAnswers, setTriggerAnswers] = useState<StudentTriggerAnswer[]>([]);
  const [reflectionAnswers, setReflectionAnswers] = useState<StudentTriggerAnswer[]>([]);
  const [expandedAnswerKey, setExpandedAnswerKey] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isGuru) {
      fetchStudentData();
    }
  }, [isGuru]);

  const fetchStudentData = async () => {
    setLoading(true);

    // First fetch all profiles for lookup
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, full_name');
    
    const profilesMap: Record<string, string> = {};
    profilesData?.forEach((p) => {
      profilesMap[p.id] = p.full_name || 'Unknown';
    });
    
    // Fetch quiz answers
    const { data: quizData } = await supabase
      .from('quiz_answers')
      .select('user_id, question_id, is_correct');

    if (quizData) {
      const userScores: Record<string, StudentQuizResult> = {};
      quizData.forEach((answer: any) => {
        if (!userScores[answer.user_id]) {
          userScores[answer.user_id] = {
            user_id: answer.user_id,
            full_name: profilesMap[answer.user_id] || 'Unknown',
            total_questions: 0,
            correct_answers: 0,
            score: 0
          };
        }
        userScores[answer.user_id].total_questions++;
        if (answer.is_correct) {
          userScores[answer.user_id].correct_answers++;
        }
      });

      Object.values(userScores).forEach(user => {
        user.score = Math.round((user.correct_answers / user.total_questions) * 100);
      });

      setQuizResults(Object.values(userScores));
    }

    // Fetch LKPD answers
    const { data: lkpdData } = await supabase
      .from('lkpd_answers')
      .select('user_id, problem_id, answer, submitted_at')
      .order('submitted_at', { ascending: false });

    if (lkpdData) {
      setLkpdAnswers(lkpdData.map((item: any) => ({
        user_id: item.user_id,
        full_name: profilesMap[item.user_id] || 'Unknown',
        problem_id: item.problem_id,
        answer: item.answer,
        submitted_at: item.submitted_at
      })));
    }

    // Fetch trigger answers (only pemantik, not refleksi)
    const { data: triggerData } = await supabase
      .from('trigger_answers')
      .select('user_id, module_id, question_id, answer, submitted_at')
      .not('module_id', 'like', '%-refleksi')
      .order('submitted_at', { ascending: false });

    if (triggerData) {
      setTriggerAnswers(triggerData.map((item: any) => ({
        user_id: item.user_id,
        full_name: profilesMap[item.user_id] || 'Unknown',
        question_id: item.question_id,
        answer: item.answer,
        submitted_at: item.submitted_at
      })));
    }

    // Fetch reflection answers
    const { data: reflectionData } = await supabase
      .from('trigger_answers')
      .select('user_id, module_id, question_id, answer, submitted_at')
      .like('module_id', '%-refleksi')
      .order('submitted_at', { ascending: false });

    if (reflectionData) {
      setReflectionAnswers(reflectionData.map((item: any) => ({
        user_id: item.user_id,
        full_name: profilesMap[item.user_id] || 'Unknown',
        question_id: item.question_id,
        answer: item.answer,
        submitted_at: item.submitted_at
      })));
    }

    setLoading(false);
  };

  const triggerQuestions = [
    { id: 1, question: "Pernahkah kamu memperhatikan saat ada diskon besar-besaran, mengapa orang jadi lebih banyak membeli?" },
    { id: 2, question: "Jika uang sakumu naik 2x lipat, apakah kamu akan membeli lebih banyak jajanan? Mengapa?" },
    { id: 3, question: "Ketika harga pulsa mahal, apa yang biasanya kamu lakukan? Apakah mencari alternatif lain?" },
  ];

  const reflectionQuestions = [
    { id: 1, question: "Bagaimana perasaanmu belajar hari ini?" },
    { id: 2, question: "Apa yang kamu sukai dari pembelajaran hari ini?" },
    { id: 3, question: "Menurut Anda bagaimana belajar menggunakan media e-modul ini?" },
    { id: 4, question: "Apa yang perlu ditambahkan dari media pembelajaran e-modul ini?" },
    { id: 5, question: "Apa yang kamu sukai dari Bapak Bagus Panca Wiratama, S.Pd., M.Pd.? (Boleh Kritik dan Saran)" },
  ];

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
            <Badge variant="secondary">Guru</Badge>
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
            <h1 className="text-3xl font-display font-bold mb-2">Dashboard Guru</h1>
            <p className="text-muted-foreground">Kelola modul, lihat hasil siswa, dan akses kunci jawaban</p>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid sm:grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{quizResults.length}</p>
                    <p className="text-sm text-muted-foreground">Mengerjakan Kuis</p>
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
                    <p className="text-2xl font-bold">{new Set(lkpdAnswers.map(a => a.user_id)).size}</p>
                    <p className="text-sm text-muted-foreground">Mengerjakan LKPD</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{new Set(triggerAnswers.map(a => a.user_id)).size}</p>
                    <p className="text-sm text-muted-foreground">Menjawab Pemantik</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{new Set(reflectionAnswers.map(a => a.user_id)).size}</p>
                    <p className="text-sm text-muted-foreground">Mengisi Refleksi</p>
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
                    <p className="text-2xl font-bold">
                      {quizResults.length > 0 
                        ? Math.round(quizResults.reduce((acc, r) => acc + r.score, 0) / quizResults.length) 
                        : 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">Rata-rata Kuis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="trigger-answers" className="w-full">
              <TabsList className="w-full grid grid-cols-5">
                <TabsTrigger value="trigger-answers" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Pemantik
                </TabsTrigger>
                <TabsTrigger value="reflection-answers" className="gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Refleksi
                </TabsTrigger>
                <TabsTrigger value="lkpd-answers" className="gap-2">
                  <ClipboardList className="h-4 w-4" />
                  LKPD
                </TabsTrigger>
                <TabsTrigger value="quiz-results" className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Kuis
                </TabsTrigger>
                <TabsTrigger value="answer-keys" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Kunci Jawaban
                </TabsTrigger>
              </TabsList>

              {/* Trigger Answers Tab */}
              <TabsContent value="trigger-answers" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Jawaban Pertanyaan Pemantik</CardTitle>
                    <CardDescription>Jawaban siswa untuk pertanyaan pemantik sebelum materi</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : triggerAnswers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Belum ada siswa yang menjawab pertanyaan pemantik</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {triggerQuestions.map((q) => {
                          const answersForQuestion = triggerAnswers.filter(a => a.question_id === q.id);
                          return (
                            <div key={q.id} className="border rounded-lg overflow-hidden">
                              <div className="p-4 bg-muted/50">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline">Pertanyaan {q.id}</Badge>
                                  <Badge variant="secondary">{answersForQuestion.length} jawaban</Badge>
                                </div>
                                <p className="font-medium">{q.question}</p>
                              </div>
                              {answersForQuestion.length > 0 && (
                                <div className="divide-y">
                                  {answersForQuestion.map((answer, index) => (
                                    <div key={`${answer.user_id}-${index}`} className="p-4">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium">{answer.full_name}</span>
                                        <span className="text-xs text-muted-foreground">
                                          {new Date(answer.submitted_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </span>
                                      </div>
                                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{answer.answer}</p>
                                    </div>
                                  ))}
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

              {/* Reflection Answers Tab */}
              <TabsContent value="reflection-answers" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Jawaban Refleksi Pembelajaran</CardTitle>
                    <CardDescription>Refleksi siswa setelah menyelesaikan modul</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : reflectionAnswers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Belum ada siswa yang mengisi refleksi</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reflectionQuestions.map((q) => {
                          const answersForQuestion = reflectionAnswers.filter(a => a.question_id === q.id);
                          return (
                            <div key={q.id} className="border rounded-lg overflow-hidden">
                              <div className="p-4 bg-amber-50 dark:bg-amber-900/20">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="border-amber-500 text-amber-700">Refleksi {q.id}</Badge>
                                  <Badge variant="secondary">{answersForQuestion.length} jawaban</Badge>
                                </div>
                                <p className="font-medium">{q.question}</p>
                              </div>
                              {answersForQuestion.length > 0 && (
                                <div className="divide-y">
                                  {answersForQuestion.map((answer, index) => (
                                    <div key={`${answer.user_id}-${index}`} className="p-4">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium">{answer.full_name}</span>
                                        <span className="text-xs text-muted-foreground">
                                          {new Date(answer.submitted_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </span>
                                      </div>
                                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{answer.answer}</p>
                                    </div>
                                  ))}
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

              {/* LKPD Answers Tab */}
              <TabsContent value="lkpd-answers" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Jawaban LKPD Siswa</CardTitle>
                    <CardDescription>Jawaban yang dikumpulkan siswa untuk LKPD</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : lkpdAnswers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Belum ada siswa yang mengerjakan LKPD</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {lkpdAnswers.map((answer, index) => (
                          <div key={`${answer.user_id}-${answer.problem_id}-${index}`} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">Soal {answer.problem_id}</Badge>
                                <span className="font-medium">{answer.full_name}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(answer.submitted_at).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-sm font-mono bg-muted/50 p-3 rounded whitespace-pre-wrap">{answer.answer}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Quiz Results Tab */}
              <TabsContent value="quiz-results" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hasil Kuis Siswa</CardTitle>
                    <CardDescription>Nilai dan progress siswa dalam mengerjakan kuis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : quizResults.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Belum ada siswa yang mengerjakan kuis</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Nama Siswa</TableHead>
                            <TableHead className="text-center">Soal Dijawab</TableHead>
                            <TableHead className="text-center">Benar</TableHead>
                            <TableHead className="text-center">Nilai</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {quizResults.map((result, index) => (
                            <TableRow key={result.user_id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell className="font-medium">{result.full_name}</TableCell>
                              <TableCell className="text-center">{result.total_questions}</TableCell>
                              <TableCell className="text-center">{result.correct_answers}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant={result.score >= 70 ? 'default' : 'destructive'}>
                                  {result.score}%
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Answer Keys Tab */}
              <TabsContent value="answer-keys" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Kunci Jawaban LKPD</CardTitle>
                    <CardDescription>Langkah-langkah penyelesaian untuk setiap soal</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {lkpdAnswerKeys.map((key) => (
                      <div key={key.id} className="border rounded-lg overflow-hidden">
                        <button
                          className="w-full p-4 flex items-center justify-between bg-muted/50 hover:bg-muted transition-colors text-left"
                          onClick={() => setExpandedAnswerKey(expandedAnswerKey === key.id ? null : key.id)}
                        >
                          <span className="font-medium">{key.title}</span>
                          {expandedAnswerKey === key.id ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>
                        {expandedAnswerKey === key.id && (
                          <div className="p-4 space-y-4 bg-card">
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground mb-2">Langkah Penyelesaian:</h4>
                              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm space-y-1">
                                {key.steps.map((step, i) => (
                                  <p key={i} className={step === '' ? 'h-2' : ''}>{step}</p>
                                ))}
                              </div>
                            </div>
                            <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
                              <h4 className="font-semibold text-success mb-2">✅ Jawaban:</h4>
                              <p className="font-mono text-lg whitespace-pre-line">{key.answer}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground mb-2">Verifikasi:</h4>
                              <div className="bg-accent/50 rounded-lg p-4 font-mono text-sm space-y-1">
                                {key.verification.map((v, i) => (
                                  <p key={i}>{v}</p>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Kunci Jawaban Kuis</CardTitle>
                    <CardDescription>Jawaban benar dan penjelasan untuk setiap soal</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {demandModule.quizQuestions.map((q, index) => (
                        <div key={q.id} className="p-4 border rounded-lg">
                          <div className="flex items-start gap-3 mb-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                              {index + 1}
                            </span>
                            <p className="font-medium">{q.question}</p>
                          </div>
                          <div className="ml-9 space-y-2">
                            {q.options.map((opt, optIndex) => (
                              <div 
                                key={optIndex} 
                                className={`p-2 rounded ${optIndex === q.correctAnswer ? 'bg-success/10 border border-success/30' : 'bg-muted/50'}`}
                              >
                                <div className="flex items-center gap-2">
                                  {optIndex === q.correctAnswer ? (
                                    <CheckCircle2 className="h-4 w-4 text-success" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <span className={optIndex === q.correctAnswer ? 'font-medium' : 'text-muted-foreground'}>
                                    {opt}
                                  </span>
                                </div>
                              </div>
                            ))}
                            <div className="mt-3 p-3 bg-accent/50 rounded-lg">
                              <p className="text-sm"><strong>Penjelasan:</strong> {q.explanation}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}