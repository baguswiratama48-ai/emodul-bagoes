import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileCheck, 
  ArrowLeft,
  CheckCircle2,
  Home,
  Trophy,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { useProgress } from '@/hooks/useProgress';
import { getModuleById, isPKWUModule } from '@/data/moduleUtils';
import confetti from 'canvas-confetti';

// Summary for Ekonomi
const ekonomiSummaryPoints = [
  {
    title: "Pengertian Permintaan",
    content: "Permintaan adalah jumlah barang/jasa yang ingin dan mampu dibeli konsumen pada berbagai tingkat harga dalam periode waktu tertentu."
  },
  {
    title: "Macam-Macam Permintaan",
    content: "Berdasarkan daya beli: efektif, potensial, absolut. Berdasarkan jumlah: individu dan pasar."
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
  {
    title: "Perubahan Permintaan",
    content: "Pergerakan sepanjang kurva (karena harga) vs pergeseran kurva (karena faktor non-harga seperti pendapatan, selera, dll)."
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
    title: "Sumber Ide Kreatif",
    content: "Ide dapat berasal dari observasi lingkungan, tren pasar, kebutuhan konsumen, dan riset referensi."
  },
  {
    title: "Analisis Peluang Usaha",
    content: "Meliputi identifikasi produk, riset target pasar, analisis pesaing, dan penentuan USP (Unique Selling Point)."
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

// Reflection questions for Ekonomi
const ekonomiReflectionQuestions = [
  "Apa hal paling menarik yang kamu pelajari dari materi permintaan ini?",
  "Bagaimana kamu akan menerapkan konsep permintaan dalam kehidupan sehari-hari?",
  "Adakah bagian materi yang masih belum kamu pahami? Tuliskan di sini!"
];

// Reflection questions for PKWU
const pkwuReflectionQuestions = [
  "Apa hal paling menarik yang kamu pelajari dari materi kerajinan limbah ini?",
  "Bagaimana kamu akan menerapkan konsep upcycling dalam kehidupan sehari-hari?",
  "Produk kerajinan limbah apa yang ingin kamu coba buat? Jelaskan!"
];

export default function SummaryPage() {
  const { moduleId } = useParams();
  const { markSectionComplete, markModuleComplete, getModuleProgress } = useProgress();
  const module = getModuleById(moduleId);
  
  if (!module) {
    return <div className="flex items-center justify-center min-h-screen">Modul tidak ditemukan</div>;
  }
  
  const progress = getModuleProgress(module.id);
  const isPKWU = isPKWUModule(moduleId);
  const summaryPoints = isPKWU ? pkwuSummaryPoints : ekonomiSummaryPoints;
  const reflectionQuestions = isPKWU ? pkwuReflectionQuestions : ekonomiReflectionQuestions;
  
  const [reflections, setReflections] = useState<Record<number, string>>({});
  const [isCompleted, setIsCompleted] = useState(progress.isCompleted);

  const handleReflectionChange = (index: number, value: string) => {
    setReflections(prev => ({ ...prev, [index]: value }));
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
                    <h4 className="font-medium mb-2">Fungsi Permintaan</h4>
                    <p className="text-2xl font-mono text-primary">Qd = -aP + b</p>
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

        {/* Key Concepts - Only for PKWU */}
        {isPKWU && (
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
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Refleksi Pembelajaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {reflectionQuestions.map((question, index) => (
                <div key={index}>
                  <label className="block text-foreground font-medium mb-2">
                    {index + 1}. {question}
                  </label>
                  <Textarea
                    placeholder="Tuliskan jawabanmu..."
                    className="resize-none"
                    value={reflections[index] || ''}
                    onChange={(e) => handleReflectionChange(index, e.target.value)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

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
