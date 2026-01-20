import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileEdit,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { useProgress } from '@/hooks/useProgress';
import { getModuleById } from '@/data/moduleUtils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function TaskNotesPage() {
  const { moduleId } = useParams();
  const { markSectionComplete } = useProgress();
  const module = getModuleById(moduleId);

  if (!module) {
    return <div className="flex items-center justify-center min-h-screen">Modul tidak ditemukan</div>;
  }

  const notesSection = module.sections.find(s => s.id === 'tugas-catatan');

  if (!notesSection) {
    return <div className="flex items-center justify-center min-h-screen">Materi Tugas Catatan tidak ditemukan</div>;
  }

  const handleComplete = () => {
    markSectionComplete(module.id, 'tugas-catatan');
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
    <ModuleLayout module={module} currentSection="tugas-catatan">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm mb-4">
            <FileEdit className="h-4 w-4" />
            <span>Tugas Catatan</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            {module.title}
          </h1>
          <p className="text-muted-foreground">
            Silakan catat materi di bawah ini di buku catatan Anda.
          </p>
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="text-2xl">{notesSection.icon}</span>
                <span>{notesSection.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 className="text-2xl font-bold text-foreground mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-medium text-foreground mt-4 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="text-foreground leading-relaxed mb-4">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-foreground">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
                      {children}
                    </blockquote>
                  ),
                  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6 rounded-lg border border-border">
                      <table className="w-full border-collapse">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
                  tbody: ({ children }) => <tbody>{children}</tbody>,
                  tr: ({ children }) => <tr className="border-b border-border last:border-0">{children}</tr>,
                  th: ({ children }) => <th className="px-4 py-3 text-left font-semibold text-foreground bg-muted">{children}</th>,
                  td: ({ children }) => <td className="px-4 py-3 text-foreground">{children}</td>,
                  hr: () => <hr className="my-6 border-border" />,
                }}
              >
                {notesSection.content || ''}
              </ReactMarkdown>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Navigation */}
        <motion.div variants={itemVariants} className="flex justify-between items-center pt-8 border-t border-border">
          <Link to={`/modul/${module.id}/materi`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Materi
            </Button>
          </Link>
          <Link to={`/modul/${module.id}/video`}>
            <Button
              onClick={handleComplete}
              className="gap-2 bg-gradient-primary hover:opacity-90"
            >
              Lanjut ke Video
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </ModuleLayout>
  );
}
