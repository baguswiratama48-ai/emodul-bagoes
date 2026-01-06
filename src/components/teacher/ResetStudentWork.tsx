import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { RefreshCw, Trash2, MessageCircle, ClipboardList, CheckCircle2, Lightbulb, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  const handleReset = async () => {
    if (!selectedStudent) {
      toast({ title: 'Error', description: 'Pilih siswa terlebih dahulu', variant: 'destructive' });
      return;
    }

    setIsResetting(true);

    try {
      if (resetType === 'pemantik' || resetType === 'all') {
        await supabase
          .from('trigger_answers')
          .delete()
          .eq('user_id', selectedStudent)
          .eq('module_id', moduleId);
      }

      if (resetType === 'refleksi' || resetType === 'all') {
        await supabase
          .from('trigger_answers')
          .delete()
          .eq('user_id', selectedStudent)
          .eq('module_id', `${moduleId}-refleksi`);
      }

      if (resetType === 'lkpd' || resetType === 'all') {
        await supabase
          .from('lkpd_answers')
          .delete()
          .eq('user_id', selectedStudent)
          .eq('module_id', moduleId);
      }

      if (resetType === 'kuis' || resetType === 'all') {
        await supabase
          .from('quiz_answers')
          .delete()
          .eq('user_id', selectedStudent)
          .eq('module_id', moduleId);
      }

      const selectedStudentName = students.find(s => s.id === selectedStudent)?.full_name || 'Siswa';
      
      toast({
        title: 'Berhasil',
        description: `Pengerjaan ${resetType === 'all' ? 'semua tugas' : resetType} ${selectedStudentName} telah direset.`,
      });

      setSelectedStudent('');
      onReset();
    } catch (error) {
      toast({
        title: 'Gagal',
        description: 'Terjadi kesalahan saat mereset pengerjaan.',
        variant: 'destructive'
      });
    } finally {
      setIsResetting(false);
    }
  };

  const getResetTypeLabel = (type: ResetType) => {
    switch (type) {
      case 'pemantik': return 'Pemantik';
      case 'refleksi': return 'Refleksi';
      case 'lkpd': return 'LKPD';
      case 'kuis': return 'Kuis';
      case 'all': return 'Semua Tugas';
    }
  };

  const getResetTypeIcon = (type: ResetType) => {
    switch (type) {
      case 'pemantik': return <MessageCircle className="h-4 w-4" />;
      case 'refleksi': return <Lightbulb className="h-4 w-4" />;
      case 'lkpd': return <ClipboardList className="h-4 w-4" />;
      case 'kuis': return <CheckCircle2 className="h-4 w-4" />;
      case 'all': return <RefreshCw className="h-4 w-4" />;
    }
  };

  return (
    <Card className="border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-900/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
          <RefreshCw className="h-5 w-5" />
          Reset Pengerjaan Siswa
        </CardTitle>
        <CardDescription>
          Reset pengerjaan agar siswa bisa mengerjakan ulang
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama siswa atau NIS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Pilih Siswa ({filteredStudents.length} siswa)</label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih siswa..." />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {filteredStudents.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    Tidak ada siswa ditemukan
                  </div>
                ) : (
                  filteredStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      <div className="flex items-center gap-2">
                        <span>{student.full_name}</span>
                        {student.kelas && (
                          <Badge variant="outline" className="text-xs">
                            {student.kelas}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Jenis Reset</label>
            <Select value={resetType} onValueChange={(v) => setResetType(v as ResetType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Semua Tugas
                  </div>
                </SelectItem>
                <SelectItem value="pemantik">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Pemantik
                  </div>
                </SelectItem>
                <SelectItem value="lkpd">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    LKPD
                  </div>
                </SelectItem>
                <SelectItem value="kuis">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Kuis
                  </div>
                </SelectItem>
                <SelectItem value="refleksi">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Refleksi
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              className="w-full gap-2"
              disabled={!selectedStudent || isResetting}
            >
              <Trash2 className="h-4 w-4" />
              {isResetting ? 'Mereset...' : 'Reset Pengerjaan'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Reset</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin mereset pengerjaan{' '}
                <strong>{getResetTypeLabel(resetType)}</strong> untuk siswa{' '}
                <strong>{students.find(s => s.id === selectedStudent)?.full_name}</strong>?
                <br /><br />
                Data yang sudah dikerjakan akan dihapus dan siswa dapat mengerjakan ulang.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground">
                Ya, Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
