import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookMarked, 
  ArrowRight, 
  ArrowLeft,
  Search,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { useProgress } from '@/hooks/useProgress';
import { getModuleById, isPKWUModule } from '@/data/moduleUtils';

export default function GlossaryPage() {
  const { moduleId } = useParams();
  const { markSectionComplete } = useProgress();
  const module = getModuleById(moduleId);
  
  if (!module) {
    return <div className="flex items-center justify-center min-h-screen">Modul tidak ditemukan</div>;
  }
  
  const isPKWU = isPKWUModule(moduleId);
  const [searchQuery, setSearchQuery] = useState('');

  const glossaryEntries = Object.entries(module.glossary || {}).sort((a, b) => 
    a[0].localeCompare(b[0])
  );

  const filteredEntries = glossaryEntries.filter(([term, definition]) =>
    term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleComplete = () => {
    markSectionComplete(module.id, 'glosarium');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <ModuleLayout module={module} currentSection="glosarium">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm mb-4">
            <BookMarked className="h-4 w-4" />
            <span>Glosarium</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Daftar Istilah
          </h1>
          <p className="text-muted-foreground">
            Kumpulan istilah penting yang perlu kamu pahami dalam materi {isPKWU ? 'kerajinan limbah' : 'permintaan'}.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div variants={itemVariants}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari istilah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants}>
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="text-foreground font-medium">Total Istilah</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {filteredEntries.length} dari {glossaryEntries.length} istilah
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Glossary List */}
        <motion.div variants={itemVariants} className="space-y-4">
          {filteredEntries.length === 0 ? (
            <Card className="bg-muted/50">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  Tidak ditemukan istilah yang cocok dengan "{searchQuery}"
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredEntries.map(([term, definition], index) => (
              <motion.div
                key={term}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-primary">{term}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground leading-relaxed">{definition}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Alphabet Jump */}
        {!searchQuery && (
          <motion.div variants={itemVariants}>
            <Card className="bg-accent/50 border-accent">
              <CardContent className="pt-6">
                <p className="text-sm text-foreground mb-3">
                  💡 <strong>Tips:</strong> Gunakan kotak pencarian di atas untuk menemukan istilah dengan cepat. 
                  Kamu juga bisa kembali ke halaman ini kapan saja jika lupa arti suatu istilah.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div variants={itemVariants} className="flex justify-between items-center pt-8 border-t border-border">
          <Link to={`/modul/${module.id}/kuis`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kuis
            </Button>
          </Link>
          <Link to={`/modul/${module.id}/rangkuman`}>
            <Button 
              onClick={handleComplete}
              className="gap-2 bg-gradient-primary hover:opacity-90"
            >
              Lanjut ke Rangkuman
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </ModuleLayout>
  );
}
