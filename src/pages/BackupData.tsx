import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Download, Database, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function BackupData() {
    const { isGuru, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>('');
    const [progress, setProgress] = useState<string[]>([]);

    if (!user) return null;
    if (!isGuru) return <Navigate to="/" />;

    const addLog = (msg: string) => setProgress(prev => [...prev, msg]);

    const handleBackup = async () => {
        setLoading(true);
        setStatus('Memulai proses backup...');
        setProgress([]);

        try {
            const backupData: any = {
                timestamp: new Date().toISOString(),
                tables: {}
            };

            // 1. Profiles (Data Siswa)
            addLog('Mengambil data Profil Siswa...');
            const { data: profiles, error: errProfiles } = await supabase.from('profiles').select('*');
            if (errProfiles) throw errProfiles;
            backupData.tables.profiles = profiles;
            addLog(`✅ ${profiles?.length || 0} profil berhasil diambil.`);

            // 2. Quiz Answers
            addLog('Mengambil data Jawaban Kuis...');
            const { data: quizAnswers, error: errQuiz } = await supabase.from('quiz_answers').select('*');
            if (errQuiz) throw errQuiz;
            backupData.tables.quiz_answers = quizAnswers;
            addLog(`✅ ${quizAnswers?.length || 0} jawaban kuis berhasil diambil.`);

            // 3. LKPD Answers
            addLog('Mengambil data Jawaban LKPD...');
            const { data: lkpdAnswers, error: errLkpd } = await supabase.from('lkpd_answers').select('*');
            if (errLkpd) throw errLkpd;
            backupData.tables.lkpd_answers = lkpdAnswers;
            addLog(`✅ ${lkpdAnswers?.length || 0} jawaban LKPD berhasil diambil.`);

            // 4. Trigger Answers
            addLog('Mengambil data Pemantik & Refleksi...');
            const { data: triggerAnswers, error: errTrigger } = await supabase.from('trigger_answers').select('*');
            if (errTrigger) throw errTrigger;
            backupData.tables.trigger_answers = triggerAnswers;
            addLog(`✅ ${triggerAnswers?.length || 0} jawaban pemantik/refleksi berhasil diambil.`);

            // 5. Student Notes
            addLog('Mengambil metadata Catatan Siswa...');
            const { data: notes, error: errNotes } = await supabase.from('student_notes').select('*');
            // Don't throw if table doesn't exist yet (in case migration failed previously)
            if (!errNotes) {
                backupData.tables.student_notes = notes;
                addLog(`✅ ${notes?.length || 0} catatan siswa berhasil diambil.`);
            } else {
                addLog('⚠️ Tabel student_notes tidak ditemukan atau gagal diakses. Melewati...');
            }

            // 6. Quiz Settings
            addLog('Mengambil pengaturan Kuis...');
            const { data: settings, error: errSettings } = await supabase.from('quiz_settings').select('*');
            if (!errSettings) {
                backupData.tables.quiz_settings = settings;
                addLog(`✅ ${settings?.length || 0} pengaturan kuis berhasil diambil.`);
            }

            // 7. Teacher Feedback
            addLog('Mengambil Feedback Guru...');
            const { data: feedback, error: errFeedback } = await supabase.from('teacher_feedback').select('*');
            if (!errFeedback) {
                backupData.tables.teacher_feedback = feedback;
                addLog(`✅ ${feedback?.length || 0} feedback guru berhasil diambil.`);
            }

            // Create JSON file
            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `BACKUP_EMODUL_BAGOES_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setStatus('Backup Selesai! File JSON telah didownload.');
            addLog('🚀 SIAP HIGRASI!');

        } catch (error: any) {
            console.error(error);
            setStatus('Gagal melakukan backup: ' + error.message);
            addLog('❌ Terjadi Error Fatal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-lg border-primary/20 shadow-lg">
                <CardHeader className="bg-primary/5">
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <Database className="h-6 w-6" />
                        Backup Data Database
                    </CardTitle>
                    <CardDescription>
                        Selamatkan data sebelum pindah ke Project Baru.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">

                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                        <div className="text-sm text-yellow-700 dark:text-yellow-300">
                            <p className="font-bold">Penting!</p>
                            <p>Pastikan Anda login sebagai **Bagoes87** agar bisa mengakses semua data siswa.</p>
                        </div>
                    </div>

                    <Button
                        onClick={handleBackup}
                        className="w-full h-12 text-lg font-bold gap-2"
                        disabled={loading}
                    >
                        {loading ? (
                            'Sedang Mengambil Data...'
                        ) : (
                            <>
                                <Download className="h-5 w-5" />
                                DOWNLOAD DATA SEKARANG
                            </>
                        )}
                    </Button>

                    <div className="bg-muted p-4 rounded-lg font-mono text-xs h-64 overflow-y-auto space-y-1">
                        <p className="font-bold text-muted-foreground mb-2">Logs:</p>
                        {progress.length === 0 && <span className="text-muted-foreground opacity-50">Menunggu perintah...</span>}
                        {progress.map((log, i) => (
                            <div key={i} className="flex gap-2">
                                <span className="opacity-50">[{new Date().toLocaleTimeString()}]</span>
                                <span>{log}</span>
                            </div>
                        ))}
                        {loading && <div className="animate-pulse">...</div>}
                    </div>

                    {status && (
                        <p className={`text-center font-medium ${status.includes('Gagal') ? 'text-destructive' : 'text-green-600'}`}>
                            {status}
                        </p>
                    )}

                </CardContent>
            </Card>
        </div>
    );
}
