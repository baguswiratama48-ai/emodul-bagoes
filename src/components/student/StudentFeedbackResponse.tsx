import { useState } from 'react';
import { MessageSquare, Send, Check, Edit2, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface FeedbackData {
    id: string;
    feedback: string;
    student_reply?: string | null;
    student_reply_at?: string | null;
    created_at?: string;
}

interface StudentFeedbackResponseProps {
    feedbackData: FeedbackData;
    onUpdate: () => void;
}

export function StudentFeedbackResponse({ feedbackData, onUpdate }: StudentFeedbackResponseProps) {
    const { toast } = useToast();
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState(feedbackData.student_reply || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveReply = async () => {
        if (!replyText.trim()) return;

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('teacher_feedback')
                .update({
                    student_reply: replyText.trim(),
                    student_reply_at: new Date().toISOString()
                })
                .eq('id', feedbackData.id);

            if (error) throw error;

            toast({
                title: "Balasan terkirim",
                description: "Balasan Anda untuk guru telah tersimpan.",
            });

            setIsReplying(false);
            onUpdate();
        } catch (error) {
            console.error('Error saving reply:', error);
            toast({
                title: "Gagal mengirim",
                description: "Terjadi kesalahan saat menyimpan balasan.",
                variant: "destructive"
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="mt-4 space-y-3">
            {/* Teacher Feedback Section */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-400">
                    <MessageSquare className="h-4 w-4" />
                    <span className="font-semibold text-sm">Feedback Guru</span>
                    {feedbackData.created_at && (
                        <span className="text-xs text-muted-foreground ml-auto">
                            {format(new Date(feedbackData.created_at), 'd MMM yyyy HH:mm', { locale: id })}
                        </span>
                    )}
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                    {feedbackData.feedback}
                </p>
            </div>

            {/* Student Reply Section */}
            <div className="pl-4 border-l-2 border-muted ml-2">
                {isReplying ? (
                    <div className="space-y-2">
                        <Textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Tulis balasan untuk guru..."
                            className="text-sm min-h-[80px]"
                        />
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                onClick={handleSaveReply}
                                disabled={isSaving || !replyText.trim()}
                                className="gap-2"
                            >
                                {isSaving ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Send className="h-3 w-3" />}
                                Kirim Balasan
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setIsReplying(false);
                                    setReplyText(feedbackData.student_reply || '');
                                }}
                            >
                                Batal
                            </Button>
                        </div>
                    </div>
                ) : feedbackData.student_reply ? (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Reply className="h-3 w-3 rotate-180" />
                                Balasan Kamu
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => setIsReplying(true)}
                            >
                                <Edit2 className="h-3 w-3" />
                            </Button>
                        </div>
                        <p className="text-sm bg-muted/30 p-3 rounded-lg">
                            {feedbackData.student_reply}
                        </p>
                        {feedbackData.student_reply_at && (
                            <p className="text-[10px] text-muted-foreground text-right border-t border-dashed pt-1 mt-1">
                                Dikirim: {format(new Date(feedbackData.student_reply_at), 'd MMM yyyy HH:mm', { locale: id })}
                            </p>
                        )}
                    </div>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary gap-2"
                        onClick={() => setIsReplying(true)}
                    >
                        <Reply className="h-4 w-4" />
                        Balas Feedback
                    </Button>
                )}
            </div>
        </div>
    );
}
