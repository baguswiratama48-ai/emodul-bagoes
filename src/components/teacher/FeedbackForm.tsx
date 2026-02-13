import { useState, useEffect } from 'react';
import { MessageSquare, Send, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface FeedbackFormProps {
  studentId: string;
  answerId: string;
  answerType: 'trigger' | 'lkpd' | 'reflection' | 'video';
  existingFeedback?: string;
  studentReply?: string;
  studentReplyAt?: string;
  onFeedbackSaved?: () => void;
}

export function FeedbackForm({
  studentId,
  answerId,
  answerType,
  existingFeedback,
  studentReply,
  studentReplyAt,
  onFeedbackSaved
}: FeedbackFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState(existingFeedback || '');
  const [rating, setRating] = useState(0); // Add rating state
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!!existingFeedback);

  // Helper to extract rating from existing feedback if possible (optional, but good for UX)
  useEffect(() => {
    if (existingFeedback) {
      if (existingFeedback.includes('⭐⭐⭐⭐⭐')) setRating(5);
      else if (existingFeedback.includes('⭐⭐⭐⭐')) setRating(4);
      else if (existingFeedback.includes('⭐⭐⭐')) setRating(3);
      else if (existingFeedback.includes('⭐⭐')) setRating(2);
      else if (existingFeedback.includes('⭐')) setRating(1);
    }
  }, [existingFeedback]);

  const handleRating = (score: number) => {
    setRating(score);
    let text = '';
    switch (score) {
      case 1:
        text = "⭐ Perlu Perbaikan: Jawaban belum menjawab pertanyaan inti. Coba baca ulang materinya ya.";
        break;
      case 2:
        text = "⭐⭐ Cukup: Jawaban sudah ada, namun perlu lebih detail lagi.";
        break;
      case 3:
        text = "⭐⭐⭐ Baik: Jawaban sudah menjawab pertanyaan dengan baik.";
        break;
      case 4:
        text = "⭐⭐⭐⭐ Sangat Baik: Jawaban detail dan relevan dengan konteks materi.";
        break;
      case 5:
        text = "⭐⭐⭐⭐⭐ Luar Biasa: Analisis sangat mendalam dan kreatif! Pertahankan.";
        break;
    }
    setFeedback(text);
  };



  const handleSave = async () => {
    if (!user || !feedback.trim()) return;

    setSaving(true);
    try {
      // Check if feedback exists
      const { data: existing } = await supabase
        .from('teacher_feedback')
        .select('id')
        .eq('student_id', studentId)
        .eq('answer_id', answerId)
        .eq('answer_type', answerType)
        .maybeSingle();

      if (existing) {
        // Update
        await supabase
          .from('teacher_feedback')
          .update({ feedback: feedback.trim() })
          .eq('id', existing.id);
      } else {
        // Insert
        await supabase
          .from('teacher_feedback')
          .insert({
            teacher_id: user.id,
            student_id: studentId,
            answer_id: answerId,
            answer_type: answerType,
            feedback: feedback.trim()
          });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      toast({
        title: "Feedback tersimpan",
        description: "Feedback berhasil disimpan untuk siswa"
      });
      onFeedbackSaved?.();
    } catch (error) {
      toast({
        title: "Gagal menyimpan",
        description: "Terjadi kesalahan saat menyimpan feedback",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isExpanded) {
    return (
      <div className="flex flex-col items-start gap-2">
        {studentReply && (
          <div className="w-full p-3 bg-muted/50 rounded-lg border text-sm">
            <div className="flex items-center gap-2 font-medium text-xs text-muted-foreground mb-1">
              <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">Balasan Siswa</span>
              {studentReplyAt && (
                <span>{new Date(studentReplyAt).toLocaleDateString()}</span>
              )}
            </div>
            <p>{studentReply}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(true)}
          className="gap-2 text-muted-foreground hover:text-primary"
        >
          <MessageSquare className="h-4 w-4" />
          {existingFeedback ? 'Edit Feedback' : 'Beri Feedback'}
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
      {studentReply && (
        <div className="mb-3 p-3 bg-background rounded-lg border text-sm">
          <div className="flex items-center gap-2 font-medium text-xs text-muted-foreground mb-1">
            <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">Balasan Siswa</span>
            {studentReplyAt && (
              <span>{new Date(studentReplyAt).toLocaleDateString()}</span>
            )}
          </div>
          <p>{studentReply}</p>
        </div>
      )}
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Feedback Guru</span>
      </div>
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            className={`transition-all hover:scale-110 focus:outline-none ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
              }`}
            type="button"
          >
            <Star className="h-6 w-6" />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {rating > 0 ? `${rating}/5 Bintang` : 'Beri nilai'}
        </span>
      </div>

      <Textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Tulis feedback atau pilih bintang..."
        className="min-h-[80px] mb-2"
      />
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={saving || !feedback.trim()}
          className="gap-2"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : saved ? (
            <Check className="h-4 w-4" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {saved ? 'Tersimpan' : 'Simpan'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(false)}
        >
          Tutup
        </Button>
      </div>
    </div>
  );
}
