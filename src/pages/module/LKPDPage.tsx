import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ClipboardList, 
  ArrowRight, 
  ArrowLeft,
  FileText,
  CheckCircle2,
  HelpCircle,
  Calculator
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { useProgress } from '@/hooks/useProgress';
import { demandModule } from '@/data/moduleContent';

const lkpdProblems = [
  {
    id: 1,
    title: "Soal 1: Penjualan Es Teh di Kantin",
    story: "Bu Siti menjual es teh di kantin sekolah. Ketika harga es teh Rp5.000 per gelas, ia berhasil menjual 100 gelas per hari. Setelah menurunkan harga menjadi Rp3.000 per gelas, penjualannya meningkat menjadi 160 gelas per hari.",
    question: "Tentukan fungsi permintaan es teh di kantin Bu Siti!",
    hint: "Gunakan rumus: a = ΔQ/ΔP, lalu substitusi ke persamaan garis",
    data: {
      p1: "5.000",
      q1: "100",
      p2: "3.000", 
      q2: "160"
    }
  },
  {
    id: 2,
    title: "Soal 2: Penjualan Pulpen di Koperasi",
    story: "Koperasi sekolah menjual pulpen. Saat harga pulpen Rp4.000 per buah, terjual 50 buah per minggu. Ketika harga dinaikkan menjadi Rp6.000 per buah, jumlah yang terjual menurun menjadi 30 buah per minggu.",
    question: "Tentukan fungsi permintaan pulpen di koperasi sekolah!",
    hint: "Perhatikan: harga naik, permintaan turun (sesuai hukum permintaan)",
    data: {
      p1: "4.000",
      q1: "50",
      p2: "6.000",
      q2: "30"
    }
  },
  {
    id: 3,
    title: "Soal 3: Penjualan Bakso di Stadion",
    story: "Pak Joko berjualan bakso di stadion. Pada saat pertandingan biasa, dengan harga Rp15.000 per mangkok, ia menjual 80 mangkok. Saat ia memberikan diskon menjadi Rp12.000 per mangkok, penjualan meningkat menjadi 110 mangkok.",
    question: "Tentukan fungsi permintaan bakso Pak Joko dan hitung berapa mangkok yang akan terjual jika harga diturunkan lagi menjadi Rp10.000!",
    hint: "Setelah menemukan fungsi, substitusikan P = 10.000 untuk mencari Q",
    data: {
      p1: "15.000",
      q1: "80",
      p2: "12.000",
      q2: "110"
    }
  },
  {
    id: 4,
    title: "Soal 4: Analisis Kasus",
    story: "Toko buku menjual novel dengan harga Rp75.000 dan terjual 40 eksemplar per bulan. Setelah ada diskon 20%, penjualan meningkat menjadi 60 eksemplar per bulan.",
    question: "a) Tentukan fungsi permintaan novel tersebut!\nb) Jika toko ingin menjual 80 eksemplar per bulan, berapa harga yang harus ditetapkan?",
    hint: "Harga setelah diskon 20% = 75.000 - (20% × 75.000) = 60.000. Untuk bagian b, substitusi Q = 80 lalu cari P",
    data: {
      p1: "75.000",
      q1: "40",
      p2: "60.000 (setelah diskon)",
      q2: "60"
    }
  },
];

export default function LKPDPage() {
  const { moduleId } = useParams();
  const { markSectionComplete } = useProgress();
  const module = demandModule;
  
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showHints, setShowHints] = useState<Record<number, boolean>>({});

  const handleAnswerChange = (id: number, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
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
            Latihan menentukan fungsi permintaan dari soal cerita
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

        {/* Rumus Pengingat */}
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

                {/* Data Points */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-card rounded-lg border text-center">
                    <p className="text-xs text-muted-foreground">P₁</p>
                    <p className="font-mono font-medium text-foreground">Rp{problem.data.p1}</p>
                  </div>
                  <div className="p-3 bg-card rounded-lg border text-center">
                    <p className="text-xs text-muted-foreground">Q₁</p>
                    <p className="font-mono font-medium text-foreground">{problem.data.q1}</p>
                  </div>
                  <div className="p-3 bg-card rounded-lg border text-center">
                    <p className="text-xs text-muted-foreground">P₂</p>
                    <p className="font-mono font-medium text-foreground">Rp{problem.data.p2}</p>
                  </div>
                  <div className="p-3 bg-card rounded-lg border text-center">
                    <p className="text-xs text-muted-foreground">Q₂</p>
                    <p className="font-mono font-medium text-foreground">{problem.data.q2}</p>
                  </div>
                </div>

                {/* Question */}
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="font-medium text-foreground">{problem.question}</p>
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
                
                {answers[problem.id]?.trim() && (
                  <div className="flex items-center gap-2 text-success text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Jawaban tersimpan</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Tips */}
        <motion.div variants={itemVariants}>
          <Card className="bg-accent/50 border-accent">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground font-medium mb-2">Langkah-langkah Pengerjaan:</p>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal pl-4">
                    <li>Identifikasi data titik A (P₁, Q₁) dan titik B (P₂, Q₂) dari soal cerita</li>
                    <li>Hitung ΔQ = Q₂ - Q₁ dan ΔP = P₂ - P₁</li>
                    <li>Hitung slope: a = ΔQ / ΔP</li>
                    <li>Substitusi ke persamaan: Q - Q₁ = a(P - P₁)</li>
                    <li>Sederhanakan menjadi bentuk Qd = aP + b</li>
                    <li>Verifikasi dengan memasukkan nilai P₁ dan P₂</li>
                  </ol>
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