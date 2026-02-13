import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Video,
  ArrowRight,
  ArrowLeft,
  Play,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { useProgress } from '@/hooks/useProgress';
import { getModuleById, isPKWUModule } from '@/data/moduleUtils';

export default function VideoPage() {
  const { moduleId } = useParams();
  const { markSectionComplete, markVideoWatched, getModuleProgress } = useProgress();
  const module = getModuleById(moduleId);

  if (!module) {
    return <div className="flex items-center justify-center min-h-screen">Modul tidak ditemukan</div>;
  }

  const progress = getModuleProgress(module.id);
  const isPKWU = isPKWUModule(moduleId);

  const [selectedVideo, setSelectedVideo] = useState(module.videos[0]);
  const [answer, setAnswer] = useState('');
  const [answerId, setAnswerId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast(); // Fix import logic, assumed useToast hook is available

  // Load existing answer and feedback
  useEffect(() => {
    if (user && selectedVideo) {
      loadAnswer();
      setAnswer(''); // Reset when video changes
      setSaved(false);
      setFeedback('');
    }
  }, [user, selectedVideo, module.id]); // Add dependencies

  const loadAnswer = async () => {
    if (!user) return;

    try {
      const { data }: { data: any } = await supabase
        .from('video_answers' as any)
        .select('id, answer')
        .eq('user_id', user.id)
        .eq('module_id', module.id)
        .eq('video_id', selectedVideo.id)
        .maybeSingle();

      if (data) {
        setAnswer(data.answer || '');
        setAnswerId(data.id);
        setSaved(true);

        // Fetch feedback
        const { data: fbData } = await supabase
          .from('teacher_feedback')
          .select('feedback')
          .eq('answer_id', data.id)
          .eq('answer_type', 'video')
          .maybeSingle();

        if (fbData) {
          setFeedback(fbData.feedback);
        }
      }
    } catch (error) {
      console.error('Error loading video answer:', error);
    }
  };

  const saveAnswer = async () => {
    if (!user || !answer.trim()) return;
    setSaving(true);

    try {
      const { data, error }: { data: any, error: any } = await supabase
        .from('video_answers' as any)
        .upsert({
          user_id: user.id,
          module_id: module.id,
          video_id: selectedVideo.id,
          answer: answer.trim(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,module_id,video_id'
        })
        .select()
        .single();

      if (error) throw error;

      setAnswerId(data.id);
      setSaved(true);
      // toast({ title: 'Tersimpan', description: 'Jawaban berhasil disimpan' }); // importing toast context is tricky here without modifying imports
    } catch (error) {
      console.error('Error saving answer:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleVideoComplete = (videoId: string) => {
    markVideoWatched(module.id, videoId);
  };

  const handleComplete = () => {
    markSectionComplete(module.id, 'video');
  };

  const isVideoWatched = (videoId: string) => progress.watchedVideos.includes(videoId);
  const watchedCount = module.videos.filter(v => isVideoWatched(v.id)).length;

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
    <ModuleLayout module={module} currentSection="video">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm mb-4">
            <Video className="h-4 w-4" />
            <span>Video Pembelajaran</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Tonton Video Penjelasan
          </h1>
          <p className="text-muted-foreground">
            Simak video-video berikut untuk pemahaman yang lebih mendalam tentang {isPKWU ? 'kerajinan dari bahan limbah' : 'konsep permintaan'}.
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div variants={itemVariants}>
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-primary" />
                  <span className="text-foreground font-medium">Progress Video</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {watchedCount} dari {module.videos.length} video ditonton
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Video Player */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <div className="aspect-video bg-black">
              <iframe
                src={selectedVideo.url}
                title={selectedVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{selectedVideo.title}</CardTitle>
                  <CardDescription className="mt-2">{selectedVideo.description}</CardDescription>
                </div>
                <Button
                  variant={isVideoWatched(selectedVideo.id) ? "secondary" : "default"}
                  size="sm"
                  onClick={() => handleVideoComplete(selectedVideo.id)}
                  className={isVideoWatched(selectedVideo.id) ? "" : "bg-gradient-primary"}
                >
                  {isVideoWatched(selectedVideo.id) ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Sudah Ditonton
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Tandai Selesai
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Video Task Section */}
        {selectedVideo.task && (
          <motion.div variants={itemVariants}>
            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-blue-700 dark:text-blue-400">
                  <Clock className="h-5 w-5" />
                  Tugas Video
                </CardTitle>
                <CardDescription className="text-blue-600/80 dark:text-blue-400/80">
                  {selectedVideo.task}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {feedback ? (
                  <div className="p-4 bg-background rounded-lg border">
                    <p className="font-medium mb-2 text-sm text-muted-foreground">Jawaban Kamu:</p>
                    <p className="mb-4 text-sm">{answer}</p>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="font-bold text-yellow-800 dark:text-yellow-400 text-sm mb-1">Feedback Guru:</p>
                      <p className="text-yellow-700 dark:text-yellow-300 whitespace-pre-line">{feedback}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <textarea
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Tulis jawabanmu di sini..."
                      value={answer}
                      onChange={(e) => {
                        setAnswer(e.target.value);
                        setSaved(false);
                      }}
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={saveAnswer}
                        disabled={!answer.trim() || saving}
                      >
                        {saving ? 'Menyimpan...' : (saved ? 'Tersimpan' : 'Kirim Jawaban')}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Video List */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold mb-4">Daftar Video</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {module.videos.map((video, index) => (
              <Card
                key={video.id}
                className={`cursor-pointer transition-all ${selectedVideo.id === video.id
                  ? 'ring-2 ring-primary'
                  : 'hover:shadow-md'
                  }`}
                onClick={() => setSelectedVideo(video)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${isVideoWatched(video.id)
                      ? 'bg-success/10'
                      : 'bg-primary/10'
                      }`}>
                      {isVideoWatched(video.id) ? (
                        <CheckCircle2 className="h-6 w-6 text-success" />
                      ) : (
                        <Play className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground mb-1">
                        Video {index + 1}: {video.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {video.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div variants={itemVariants}>
          <Card className="bg-accent/50 border-accent">
            <CardContent className="pt-6">
              <p className="text-sm text-foreground">
                💡 <strong>Tips:</strong> Tonton semua video dengan seksama dan jangan ragu untuk
                memutar ulang bagian yang belum kamu pahami. Catat poin-poin penting untuk membantu
                mengingat materi.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div variants={itemVariants} className="flex justify-between items-center pt-8 border-t border-border">
          <Link to={`/modul/${module.id}/materi`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Materi
            </Button>
          </Link>
          <Link to={`/modul/${module.id}/lkpd`}>
            <Button
              onClick={handleComplete}
              className="gap-2 bg-gradient-primary hover:opacity-90"
            >
              Lanjut ke LKPD
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </ModuleLayout>
  );
}
