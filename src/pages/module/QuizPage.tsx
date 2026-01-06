import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  XCircle,
  Trophy,
  RotateCcw,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { useProgress } from '@/hooks/useProgress';
import { useAuth } from '@/hooks/useAuth';
import { getModuleById, isPKWUModule } from '@/data/moduleUtils';
import { supabase } from '@/integrations/supabase/client';
import confetti from 'canvas-confetti';

export default function QuizPage() {
  const { moduleId } = useParams();
  const { markSectionComplete, saveQuizScore, getModuleProgress } = useProgress();
  const { user } = useAuth();
  const module = getModuleById(moduleId);
  
  if (!module) {
    return <div className="flex items-center justify-center min-h-screen">Modul tidak ditemukan</div>;
  }
  
  const progress = getModuleProgress(module.id);
  const isPKWU = isPKWUModule(moduleId);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const questions = module.quizQuestions;
  const totalQuestions = questions.length;

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: answerIndex }));
    setShowExplanation(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const saveAnswersToDatabase = async () => {
    if (!user) return;

    // Save each answer to the database
    const answers = questions.map((q, index) => ({
      user_id: user.id,
      module_id: module.id,
      question_id: q.id,
      selected_answer: selectedAnswers[index] ?? -1,
      is_correct: selectedAnswers[index] === q.correctAnswer
    }));

    for (const answer of answers) {
      if (answer.selected_answer >= 0) {
        await supabase
          .from('quiz_answers')
          .upsert(answer, {
            onConflict: 'user_id,module_id,question_id'
          });
      }
    }
  };

  const handleSubmitQuiz = async () => {
    const score = calculateScore();
    saveQuizScore(module.id, 'main-quiz', score);
    
    // Save to database
    await saveAnswersToDatabase();
    
    setShowResults(true);
    
    if (score >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
    setShowExplanation(false);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / totalQuestions) * 100);
  };

  const handleComplete = () => {
    markSectionComplete(module.id, 'kuis');
  };

  const currentQ = questions[currentQuestion];
  const answeredCount = Object.keys(selectedAnswers).length;
  const score = calculateScore();
  const previousScore = progress.quizScores['main-quiz'];

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

  if (showResults) {
    return (
      <ModuleLayout module={module} currentSection="kuis">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="text-center">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
              score >= 70 ? 'bg-success/10' : 'bg-destructive/10'
            }`}>
              {score >= 70 ? (
                <Trophy className="h-12 w-12 text-success" />
              ) : (
                <RotateCcw className="h-12 w-12 text-destructive" />
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              {score >= 70 ? 'Selamat! 🎉' : 'Belum Berhasil'}
            </h1>
            
            <p className="text-muted-foreground mb-8">
              {score >= 70 
                ? 'Kamu telah berhasil menyelesaikan kuis dengan baik!'
                : 'Jangan menyerah! Pelajari lagi materinya dan coba lagi.'}
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-6xl font-bold text-gradient">{score}%</CardTitle>
                <CardDescription>
                  {questions.filter((q, i) => selectedAnswers[i] === q.correctAnswer).length} dari {totalQuestions} jawaban benar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Skor kamu</span>
                      <span className="font-medium">{score}%</span>
                    </div>
                    <Progress value={score} className="h-3" />
                  </div>
                  
                  {previousScore !== undefined && previousScore !== score && (
                    <p className="text-sm text-muted-foreground text-center">
                      Skor sebelumnya: {previousScore}%
                    </p>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={handleRetry}
                      className="flex-1 gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Ulangi Kuis
                    </Button>
                    {score >= 70 && (
                      <Link to={`/modul/${module.id}/glosarium`} className="flex-1">
                        <Button 
                          onClick={handleComplete}
                          className="w-full gap-2 bg-gradient-primary"
                        >
                          Lanjut
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Review Answers */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4">Review Jawaban</h3>
            <div className="space-y-4">
              {questions.map((q, index) => {
                const isCorrect = selectedAnswers[index] === q.correctAnswer;
                return (
                  <Card key={q.id} className={isCorrect ? 'border-success/50' : 'border-destructive/50'}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-foreground mb-2">
                            {index + 1}. {q.question}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            Jawabanmu: <span className={isCorrect ? 'text-success' : 'text-destructive'}>
                              {q.options[selectedAnswers[index]]}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-success">
                              Jawaban benar: {q.options[q.correctAnswer]}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground mt-2 p-3 bg-muted rounded-lg">
                            💡 {q.explanation}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>

          {/* Navigation for those who didn't pass */}
          {score < 70 && (
            <motion.div variants={itemVariants} className="flex justify-between items-center pt-8 border-t border-border">
              <Link to={`/modul/${module.id}/materi`}>
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Materi
                </Button>
              </Link>
              <Link to={`/modul/${module.id}/glosarium`}>
                <Button 
                  variant="ghost"
                  onClick={handleComplete}
                  className="gap-2"
                >
                  Lewati ke Glosarium
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout module={module} currentSection="kuis">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm mb-4">
            <CheckCircle2 className="h-4 w-4" />
            <span>Kuis</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Uji Pemahamanmu!
          </h1>
          <p className="text-muted-foreground">
            Jawab semua pertanyaan untuk menguji pemahaman tentang konsep permintaan.
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div variants={itemVariants}>
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-foreground font-medium">
                  Soal {currentQuestion + 1} dari {totalQuestions}
                </span>
                <span className="text-sm text-muted-foreground">
                  {answeredCount} terjawab
                </span>
              </div>
              <Progress value={((currentQuestion + 1) / totalQuestions) * 100} className="h-2" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Question */}
        <motion.div 
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl leading-relaxed">
                {currentQuestion + 1}. {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedAnswers[currentQuestion]?.toString()}
                onValueChange={(value) => handleAnswerSelect(currentQuestion, parseInt(value))}
                className="space-y-3"
              >
                {currentQ.options.map((option, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                    onClick={() => handleAnswerSelect(currentQuestion, index)}
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-foreground">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {selectedAnswers[currentQuestion] !== undefined && (
                <div className="mt-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="text-muted-foreground"
                  >
                    {showExplanation ? 'Sembunyikan' : 'Lihat'} Penjelasan
                    <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${showExplanation ? 'rotate-90' : ''}`} />
                  </Button>
                  
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 p-4 rounded-lg bg-muted"
                    >
                      <p className="text-sm text-foreground">
                        <strong className={selectedAnswers[currentQuestion] === currentQ.correctAnswer ? 'text-success' : 'text-destructive'}>
                          {selectedAnswers[currentQuestion] === currentQ.correctAnswer ? '✓ Benar!' : '✗ Kurang tepat.'}
                        </strong>
                        {' '}{currentQ.explanation}
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Question Navigation */}
        <motion.div variants={itemVariants}>
          <div className="flex flex-wrap gap-2 justify-center">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  currentQuestion === index
                    ? 'bg-primary text-primary-foreground'
                    : selectedAnswers[index] !== undefined
                    ? 'bg-success/10 text-success border border-success/30'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div variants={itemVariants} className="flex justify-between items-center pt-8 border-t border-border">
          <Button
            variant="outline"
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Sebelumnya
          </Button>
          
          {currentQuestion === totalQuestions - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={answeredCount < totalQuestions}
              className="gap-2 bg-gradient-primary hover:opacity-90"
            >
              Selesai & Lihat Hasil
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              className="gap-2"
            >
              Selanjutnya
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </motion.div>
      </motion.div>
    </ModuleLayout>
  );
}