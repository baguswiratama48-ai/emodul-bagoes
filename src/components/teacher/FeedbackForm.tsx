import { useState, useEffect } from 'react';
import { MessageSquare, Send, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface FeedbackFormProps {
  studentId: string;
  answerId: string;
  answerType: 'trigger' | 'lkpd' | 'reflection';
  existingFeedback?: string;
  onFeedbackSaved?: () => void;
}

export function FeedbackForm({ 
  studentId, 
  answerId, 
  answerType, 
  existingFeedback,
  onFeedbackSaved 
}: FeedbackFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState(existingFeedback || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!!existingFeedback);

  useEffect(() => {
    if (existingFeedback) {
      setFeedback(existingFeedback);
    }
  }, [existingFeedback]);

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
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsExpanded(true)}
        className="gap-2 text-muted-foreground hover:text-primary"
      >
        <MessageSquare className="h-4 w-4" />
        {existingFeedback ? 'Edit Feedback' : 'Beri Feedback'}
      </Button>
    );
  }

  return (
    <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Feedback Guru</span>
      </div>
      <Textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Tulis feedback untuk siswa..."
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
