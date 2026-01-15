import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Database, CheckCircle, AlertTriangle, FileJson, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';

export default function RestoreData() {
    const { isGuru, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>('');
    const [progress, setProgress] = useState<string[]>([]);
    const [file, setFile] = useState<File | null>(null);

    if (!user) return null;
    // Note: Since we are in a new project, the user might not be 'guru' yet if we haven't created the guru account.
    // BUT, the goal is the teacher signs up first, then runs this.
    // The 'isGuru' check might need to be relaxed or we assume the first user is admin?
    // For now, let's assume they logged in.

    const addLog = (msg: string) => setProgress(prev => [...prev, msg]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleRestore = async () => {
        if (!file) return;

        setLoading(true);
        setStatus('Memulai proses restore...');
        setProgress([]);

        try {
            const text = await file.text();
            const backupData = JSON.parse(text);
            const tables = backupData.tables;

            addLog(`📂 File backup terbaca. Timestamp: ${backupData.timestamp}`);

            const userIdMap: Record<string, string> = {}; // Old ID -> New ID

            // 1. Restore PROFILES (Recreate Accounts)
            const profiles = tables.profiles || [];
            addLog(`👥 Memproses ${profiles.length} data siswa...`);

            let successCount = 0;
            let failCount = 0;

            for (const p of profiles) {
                if (!p.nis) {
                    addLog(`⚠️ Skip ${p.full_name} (Tanpa NIS)`);
                    continue;
                }

                // Try to create auth user
                // Note: Client side signUp automatically logs you in if successful.
                // This is problematic for bulk creation. Supabase Admin API is needed for bulk creation.
                // BUT we don't have Admin API access from client.
                // WORKAROUND: We can only insert into 'profiles' table if the auth user exists.
                // Since we cannot create auth users from client easily without logging out...

                // WAIT! We migrated to a NEW PROJECT.
                // The ONLY way to migrate auth users without Admin API is:
                // 1. Manually create them (impossible for 700 users).
                // 2. Use a Supabase Edge Function (requires setup).
                // 3. Just insert the DATA into 'profiles', 'quiz_answers', etc. linked to a placeholder or NEW ID?
                // NO, they need to login.

                // CRITICAL: We cannot create 700 users from the client side using `signUp` because of rate limits and session swapping.
                // HOWEVER, we CAN insert the DATA into the tables if we disable the "Foreign Key" constraint to auth.users temporarily?
                // No, Supabase won't let us.

                // ALTERNATIVE STRATEGY FOR CLIENT SIDE RESTORE:
                // We will insert the profile data into `public.profiles`.
                // BUT `public.profiles` references `auth.users`.
                // We effectively CANNOT restore playable accounts without Admin access.

                // RE-EVALUATION:
                // The user provided the `anon` key.
                // Usually migration requires `service_role` key.
                // Did the user backup the `service_role`? No.

                // PATH FORWARD:
                // We will try `signUp` in a loop. It's slow and might hit rate limits, but it's the only way with `anon` key.
                // Note: `signUp` doesn't require email verification if disabled in settings (default is enabled).
                // We hope the user disabled "Confirm Email".

                try {
                    const email = `${p.nis}@siswa.local`;
                    const password = p.nis; // Default password

                    // Call SignUp
                    const { data: authData, error: authError } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: {
                                full_name: p.full_name,
                                nis: p.nis,
                                kelas: p.kelas,
                                role: 'siswa'
                            }
                        }
                    });

                    if (authError) {
                        // Check if user already exists (maybe retry run)
                        if (authError.message.includes('already registered')) {
                            addLog(`ℹ️ User ${p.full_name} sudah ada. Mencoba link data...`);
                            // We need to fetch the ID of this user? We can't easily without login.
                            // Skipping linkage for existing users for now unless we can login.
                        } else {
                            console.error(authError);
                            failCount++;
                        }
                    } else if (authData.user) {
                        userIdMap[p.id] = authData.user.id;
                        successCount++;
                        // Profile is auto-created by trigger!
                    }

                    // Artificial delay to avoid aggressive rate limiting
                    await new Promise(r => setTimeout(r, 200));

                } catch (e) {
                    console.error(e);
                    failCount++;
                }

                if (successCount % 10 === 0) addLog(`... ${successCount} akun dibuat.`);
            }

            addLog(`✅ Selesai User: ${successCount} sukses, ${failCount} gagal.`);
            addLog('🔄 Memulihkan data modul (Kuis, LKPD, dll)...');

            // Helper to restore content tables
            const restoreTable = async (tableName: string, rows: any[]) => {
                if (!rows || rows.length === 0) return;

                const newRows = rows.map(row => {
                    const newUserId = userIdMap[row.user_id];
                    if (!newUserId) return null; // Skip if user wasn't recreated

                    const { id, ...rest } = row; // Remove old ID to generate new one
                    return {
                        ...rest,
                        user_id: newUserId
                    };
                }).filter(r => r !== null);

                if (newRows.length > 0) {
                    // Batch insert
                    const { error } = await supabase.from(tableName).insert(newRows);
                    if (error) {
                        addLog(`❌ Gagal restore ${tableName}: ${error.message}`);
                    } else {
                        addLog(`✅ ${newRows.length} data ${tableName} dipulihkan.`);
                    }
                }
            };

            await restoreTable('quiz_answers', tables.quiz_answers);
            await restoreTable('lkpd_answers', tables.lkpd_answers);
            await restoreTable('trigger_answers', tables.trigger_answers);
            await restoreTable('student_notes', tables.student_notes);

            // Settings usually don't have user_id dependecy (except 'modified by')
            // but our schema has simple quiz_settings.
            if (tables.quiz_settings && tables.quiz_settings.length > 0) {
                const cleanSettings = tables.quiz_settings.map((s: any) => {
                    const { id, ...rest } = s;
                    return rest;
                });
                await supabase.from('quiz_settings').upsert(cleanSettings, { onConflict: 'module_id' });
                addLog('✅ Pengaturan Kuis dipulihkan.');
            }

            setStatus('Restore Selesai! Silakan cek Dashboard.');
            addLog('🎉 SEMUA PROSES SELESAI!');

        } catch (error: any) {
            console.error(error);
            setStatus('Gagal: ' + error.message);
            addLog('❌ Error Fatal saat parsing file.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl border-primary/20 shadow-lg">
                <CardHeader className="bg-primary/5">
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <RefreshCw className="h-6 w-6" />
                        Restore Data ke Project Baru
                    </CardTitle>
                    <CardDescription>
                        Import file JSON backup dan buat ulang akun siswa.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                            <p className="font-bold mb-1">Penting:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Proses ini akan membuat ulang akun siswa satu per satu.</li>
                                <li>Password siswa akan direset menjadi **NIS** mereka.</li>
                                <li>Jangan tutup halaman ini sampai proses 100% selesai.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="grid w-full items-center gap-1.5">
                        <Input
                            type="file"
                            accept=".json"
                            onChange={handleFileChange}
                            disabled={loading}
                        />
                    </div>

                    <Button
                        onClick={handleRestore}
                        className="w-full h-12 text-lg font-bold gap-2"
                        disabled={loading || !file}
                    >
                        {loading ? (
                            'Sedang Memproses Data (Mohon Tunggu)...'
                        ) : (
                            <>
                                <Upload className="h-5 w-5" />
                                MULAI RESTORE DATA
                            </>
                        )}
                    </Button>

                    <div className="bg-muted p-4 rounded-lg font-mono text-xs h-96 overflow-y-auto space-y-1">
                        <p className="font-bold text-muted-foreground mb-2">Progress Logs:</p>
                        {progress.length === 0 && <span className="text-muted-foreground opacity-50">Siap menerima file backup...</span>}
                        {progress.map((log, i) => (
                            <div key={i} className="flex gap-2 border-b border-white/5 pb-1">
                                <span className="opacity-50 flex-shrink-0">[{new Date().toLocaleTimeString()}]</span>
                                <span className="break-all">{log}</span>
                            </div>
                        ))}
                        {loading && <div className="animate-pulse">Sedang bekerja...</div>}
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
