import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ClipboardList, 
  ArrowRight, 
  ArrowLeft,
  FileText,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { useProgress } from '@/hooks/useProgress';
import { demandModule } from '@/data/moduleContent';

const demandScheduleData = [
  { price: 8000, quantity: 30 },
  { price: 7000, quantity: 50 },
  { price: 6000, quantity: 70 },
  { price: 5000, quantity: 100 },
  { price: 4000, quantity: 140 },
];

const lkpdQuestions = [
  {
    id: 1,
    question: "Berdasarkan tabel di atas, bagaimana hubungan antara harga dan jumlah permintaan minuman dingin?",
    type: "textarea",
  },
  {
    id: 2,
    question: "Apakah data tersebut sesuai dengan hukum permintaan? Jelaskan alasanmu!",
    type: "textarea",
  },
  {
    id: 3,
    question: "Hitunglah fungsi permintaan berdasarkan data titik (Rp8.000, 30 gelas) dan (Rp4.000, 140 gelas)!",
    type: "textarea",
  },
  {
    id: 4,
    question: "Jika harga diturunkan menjadi Rp3.000, berapakah perkiraan jumlah permintaan? (Gunakan fungsi yang sudah kamu hitung)",
    type: "input",
  },
  {
    id: 5,
    question: "Faktor apa saja yang mungkin mempengaruhi permintaan minuman dingin di kantin selain harga? Sebutkan minimal 3 faktor!",
    type: "textarea",
  },
];

export default function LKPDPage() {
  const { moduleId } = useParams();
  const { markSectionComplete } = useProgress();
  const module = demandModule;
  
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleAnswerChange = (id: number, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
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
            Analisis studi kasus permintaan minuman dingin di kantin sekolah.
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div variants={itemVariants}>
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-foreground font-medium">Progress LKPD</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {answeredCount} dari {lkpdQuestions.length} pertanyaan terjawab
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Case Study */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Studi Kasus: Permintaan Minuman Dingin di Kantin
              </CardTitle>
              <CardDescription>
                Perhatikan data skedul permintaan berikut dengan seksama, kemudian jawab pertanyaan-pertanyaan di bawahnya.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4">
                Berikut adalah data permintaan minuman dingin di kantin SMA Harapan Bangsa selama satu minggu:
              </p>
              
              <div className="bg-card rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">No</TableHead>
                      <TableHead className="text-center">Harga per Gelas (Rp)</TableHead>
                      <TableHead className="text-center">Jumlah Diminta (gelas/hari)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demandScheduleData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-center font-medium">{index + 1}</TableCell>
                        <TableCell className="text-center">Rp{row.price.toLocaleString()}</TableCell>
                        <TableCell className="text-center">{row.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Questions */}
        {lkpdQuestions.map((q, index) => (
          <motion.div key={q.id} variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-start gap-3 text-lg">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-foreground">{q.question}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {q.type === 'textarea' ? (
                  <Textarea
                    placeholder="Tuliskan jawabanmu di sini..."
                    className="min-h-[120px] resize-none"
                    value={answers[q.id] || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  />
                ) : (
                  <Input
                    placeholder="Jawaban..."
                    value={answers[q.id] || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  />
                )}
                
                {answers[q.id]?.trim() && (
                  <div className="flex items-center gap-2 mt-3 text-success text-sm">
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
                <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground font-medium mb-2">Petunjuk Pengerjaan:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Jawablah setiap pertanyaan dengan jelas dan lengkap</li>
                    <li>• Gunakan rumus dan konsep yang sudah dipelajari</li>
                    <li>• Untuk menghitung fungsi permintaan, gunakan rumus: (Q - Q₁)/(Q₂ - Q₁) = (P - P₁)/(P₂ - P₁)</li>
                    <li>• Jawabanmu akan tersimpan secara otomatis di browser</li>
                  </ul>
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
