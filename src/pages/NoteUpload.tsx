import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, FileText, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface Note {
    id: string;
    title: string;
    file_path: string;
    created_at: string;
    score: number | null;
    feedback: string | null;
}

export default function NoteUpload() {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [notes, setNotes] = useState<Note[]>([]);

    const fetchNotes = useCallback(async () => {
        if (!user) return;
        const { data } = await supabase
            .from('student_notes')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (data) setNotes(data);
    }, [user]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            if (selectedFile.type !== 'application/pdf') {
                toast.error('Hanya file PDF yang diperbolehkan');
                return;
            }

            if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('Ukuran file maksimal 5MB');
                return;
            }

            setFile(selectedFile);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !user || !title) return;

        setIsUploading(true);
        try {
            // 1. Upload to Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}_${title.replace(/\s+/g, '_')}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('notes')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // 2. Save metadata to Database
            const { error: dbError } = await supabase
                .from('student_notes')
                .insert({
                    user_id: user.id,
                    title: title,
                    file_path: fileName,
                    file_size: file.size
                });

            if (dbError) throw dbError;

            setUploadSuccess(true);
            setUploadSuccess(true);
            toast.success('Catatan berhasil diupload!');
            fetchNotes();

            // Reset form on success (optional)
            // setFile(null);
            // setTitle('');
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(`Gagal upload: ${error.message || 'Terjadi kesalahan'}`);
        } finally {
            setIsUploading(false);
        }
    };

    if (uploadSuccess) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center">
                    <CardHeader>
                        <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <CardTitle>Berhasil Diupload!</CardTitle>
                        <CardDescription>Catatan kamu sudah tersimpan di sistem.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Link to="/">
                            <Button className="w-full">Kembali ke Beranda</Button>
                        </Link>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                setUploadSuccess(false);
                                setFile(null);
                                setTitle('');
                            }}
                        >
                            Upload Lagi
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link to="/">
                        <Button variant="ghost" className="gap-2 pl-0 hover:pl-2 transition-all">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="h-6 w-6 text-primary" />
                                Upload Catatan
                            </CardTitle>
                            <CardDescription>
                                Scan catatan tulisan tanganmu dan upload dalam format PDF (Max 5MB).
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpload} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Judul Catatan</Label>
                                    <Input
                                        id="title"
                                        placeholder="Contoh: Rangkuman Bab Permintaan"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="file">File PDF</Label>
                                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                                        <input
                                            type="file"
                                            id="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            required
                                        />
                                        {file ? (
                                            <div className="flex flex-col items-center gap-2 text-primary">
                                                <FileText className="h-10 w-10" />
                                                <span className="font-medium">{file.name}</span>
                                                <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                <Button type="button" variant="link" size="sm" className="text-destructive h-auto p-0 z-10" onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFile(null);
                                                }}>
                                                    Hapus
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                <Upload className="h-10 w-10" />
                                                <span>Klik atau geser file PDF ke sini</span>
                                                <span className="text-xs">Hanya file PDF</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-primary"
                                    disabled={!file || !title || isUploading}
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Mengupload...
                                        </>
                                    ) : (
                                        'Upload Catatan'
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* History Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Riwayat Catatan</CardTitle>
                            <CardDescription>
                                Daftar catatan yang sudah kamu upload dan penilaian guru.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {notes.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">Belum ada catatan.</div>
                            ) : (
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tanggal</TableHead>
                                                <TableHead>Judul</TableHead>
                                                <TableHead>Nilai</TableHead>
                                                <TableHead>Feedback</TableHead>
                                                <TableHead></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {notes.map((note) => (
                                                <TableRow key={note.id}>
                                                    <TableCell className="text-xs text-muted-foreground">
                                                        {new Date(note.created_at).toLocaleDateString('id-ID')}
                                                    </TableCell>
                                                    <TableCell className="font-medium">{note.title}</TableCell>
                                                    <TableCell>
                                                        {note.score !== null ? (
                                                            <Badge variant={note.score >= 75 ? 'default' : 'secondary'} className={note.score >= 75 ? 'bg-green-600' : ''}>
                                                                {note.score}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">Dinilai</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-sm max-w-[200px] truncate" title={note.feedback || ''}>
                                                        {note.feedback || '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <a
                                                                href={`https://tqmycasowqhgfsgcucvy.supabase.co/storage/v1/object/public/notes/${note.file_path}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                            >
                                                                <ExternalLink className="h-4 w-4" />
                                                            </a>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
