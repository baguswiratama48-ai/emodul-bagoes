import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { RefreshCw, Trash2, MessageCircle, ClipboardList, CheckCircle2, Lightbulb, Search, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface StudentProfile {
  id: string;
  full_name: string;
  nis: string | null;
  kelas: string | null;
}

interface ResetStudentWorkProps {
  students: StudentProfile[];
  moduleId: string;
  onReset: () => void;
}

type ResetType = 'pemantik' | 'refleksi' | 'lkpd' | 'kuis' | 'all';

export function ResetStudentWork({ students, moduleId, onReset }: ResetStudentWorkProps) {
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [resetType, setResetType] = useState<ResetType>('all');
  const [isResetting, setIsResetting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter students by search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const query = searchQuery.toLowerCase();
    return students.filter(s =>
      s.full_name.toLowerCase().includes(query) ||
      s.nis?.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

  // Auto-select first student when searching
  useEffect(() => {
    if (searchQuery.trim() && filteredStudents.length > 0) {
      setSelectedStudent(filteredStudents[0].id);
    } else if (!searchQuery.trim()) {
      setSelectedStudent('');
    }
  }, [searchQuery, filteredStudents]);

  const handleReset = async () => {
    if (!selectedStudent) {
      toast({ title: 'Error', description: 'Pilih siswa terlebih dahulu', variant: 'destructive' });
      return;
    }

    setIsResetting(true);
    const studentName = students.find(s => s.id === selectedStudent)?.full_name || 'Siswa';

    try {
      console.log(`Starting reset for ${studentName} (${selectedStudent}) on module ${moduleId}`);

      // We perform delete operations sequentially to ensure stability
      // Kuis
      // Kuis
      // Kuis
      if (resetType === 'kuis' || resetType === 'all') {
        console.log('Executing specific module delete...');

        // 1. Try secure RPC function (handles specific module)
        await supabase.rpc('reset_quiz_for_student', {
          p_user_id: selectedStudent,
          p_module_id: moduleId
        });

        // 2. ALWAYS Trigger "Nuclear" cleanup using SECURITY DEFINER RPC
        // This bypasses RLS and deletes ALL quiz answers for the user to guarantee removal
        console.log('Executing server-side nuclear cleanup for user:', selectedStudent);
        const { error: nuclearError } = await supabase.rpc('reset_all_quiz_data_for_student', {
          p_user_id: selectedStudent
        });

        if (nuclearError) {
          console.error('Nuclear reset error:', nuclearError);
          throw nuclearError;
        }
      }

      // LKPD
      if (resetType === 'lkpd' || resetType === 'all') {
        await supabase.from('lkpd_answers')
          .delete().eq('user_id', selectedStudent).eq('module_id', moduleId);

        await supabase.from('lkpd_answers')
          .delete().eq('user_id', selectedStudent).is('module_id', null);
      }

      // Pemantik
      if (resetType === 'pemantik' || resetType === 'all') {
        await supabase.from('trigger_answers')
          .delete().eq('user_id', selectedStudent).eq('module_id', moduleId);

        await supabase.from('trigger_answers')
          .delete().eq('user_id', selectedStudent).is('module_id', null);
      }

      // Refleksi
      if (resetType === 'refleksi' || resetType === 'all') {
        await supabase.from('trigger_answers')
          .delete().eq('user_id', selectedStudent).eq('module_id', `${moduleId}-refleksi`);
      }

      toast({
        title: 'Reset Berhasil',
        description: `Data ${studentName} berhasil dihapus permanen.`,
        duration: 3000,
      });

      // Clear selection and refresh data
      setSearchQuery('');
      setSelectedStudent('');
      onReset();

    } catch (error: any) {
      console.error('Reset error:', error);
      toast({
        title: 'Gagal Reset',
        description: error.message || 'Terjadi kesalahan sistem',
        variant: 'destructive'
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Card className="border-destructive/20 bg-destructive/5 dark:bg-destructive/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Trash2 className="h-5 w-5" />
          Hapus Data Siswa (Reset)
        </CardTitle>
        <CardDescription>
          Gunakan fitur ini jika siswa mengalami kendala dan perlu mengerjakan ulang dari awal.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Peringatan</AlertTitle>
          <AlertDescription>
            Tindakan ini tidak dapat dibatalkan. Data jawaban dan nilai siswa akan dihapus permanen.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Cari Siswa</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ketik nama siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Jenis Reset</label>
            <Select value={resetType} onValueChange={(v) => setResetType(v as ResetType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Data (Kuis, LKPD, dll)</SelectItem>
                <SelectItem value="kuis">Hanya Kuis</SelectItem>
                <SelectItem value="lkpd">Hanya LKPD</SelectItem>
                <SelectItem value="pemantik">Hanya Pemantik</SelectItem>
                <SelectItem value="refleksi">Hanya Refleksi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedStudent && (
            <div className="p-3 bg-secondary/20 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Siswa Terpilih:</p>
                <p className="font-bold">{students.find(s => s.id === selectedStudent)?.full_name}</p>
              </div>
              <Badge variant="outline">{students.find(s => s.id === selectedStudent)?.kelas}</Badge>
            </div>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full font-bold"
                size="lg"
                disabled={!selectedStudent || isResetting}
              >
                {isResetting ? 'Sedang Menghapus...' : 'HAPUS DATA SISWA'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Data Permanen?</AlertDialogTitle>
                <AlertDialogDescription>
                  Anda akan menghapus data pengerjaan milik <strong>{students.find(s => s.id === selectedStudent)?.full_name}</strong>.
                  <br /><br />
                  Siswa harus mengerjakan ulang dari awal setelah ini.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground">
                  Ya, Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
