import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen,
  LogOut,
  Home,
  Save,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface StudentProfile {
  id: string;
  full_name: string;
  nis: string | null;
  kelas: string | null;
}

export default function ManageStudents() {
  const { signOut, isGuru } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ nis: '', kelas: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isGuru) {
      fetchStudents();
    }
  }, [isGuru]);

  const fetchStudents = async () => {
    setLoading(true);
    
    // Get all student user_ids (not guru)
    const { data: studentRoles } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'siswa');
    
    const studentIds = studentRoles?.map(r => r.user_id) || [];
    
    if (studentIds.length > 0) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, nis, kelas')
        .in('id', studentIds)
        .order('full_name');
      
      setStudents(profilesData || []);
    }
    
    setLoading(false);
  };

  const startEdit = (student: StudentProfile) => {
    setEditingId(student.id);
    setEditForm({
      nis: student.nis || '',
      kelas: student.kelas || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ nis: '', kelas: '' });
  };

  const saveEdit = async (studentId: string) => {
    setSaving(true);
    
    const { error } = await supabase
      .from('profiles')
      .update({
        nis: editForm.nis || null,
        kelas: editForm.kelas || null
      })
      .eq('id', studentId);
    
    if (error) {
      toast({
        title: "Gagal menyimpan",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Berhasil",
        description: "Data siswa berhasil diperbarui"
      });
      setStudents(prev => prev.map(s => 
        s.id === studentId 
          ? { ...s, nis: editForm.nis || null, kelas: editForm.kelas || null }
          : s
      ));
      setEditingId(null);
    }
    
    setSaving(false);
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-bold text-gradient">E-Modul Bagoes</span>
            </Link>
            <Badge variant="secondary">Guru</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/guru">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          {/* Page Header */}
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-display font-bold mb-2">Kelola Data Siswa</h1>
            <p className="text-muted-foreground">Edit NIS dan kelas siswa</p>
          </motion.div>

          {/* Students Table */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Daftar Siswa
                </CardTitle>
                <CardDescription>Klik tombol edit untuk mengubah data siswa</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : students.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Belum ada siswa terdaftar</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Siswa</TableHead>
                        <TableHead>NIS</TableHead>
                        <TableHead>Kelas</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student, index) => (
                        <TableRow key={student.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">{student.full_name}</TableCell>
                          <TableCell>
                            {editingId === student.id ? (
                              <Input
                                value={editForm.nis}
                                onChange={(e) => setEditForm(prev => ({ ...prev, nis: e.target.value }))}
                                placeholder="NIS"
                                className="w-32"
                              />
                            ) : (
                              <span className="font-mono">{student.nis || '-'}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingId === student.id ? (
                              <Input
                                value={editForm.kelas}
                                onChange={(e) => setEditForm(prev => ({ ...prev, kelas: e.target.value }))}
                                placeholder="Kelas"
                                className="w-24"
                              />
                            ) : (
                              student.kelas ? (
                                <Badge variant="outline">Kelas {student.kelas}</Badge>
                              ) : '-'
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {editingId === student.id ? (
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => saveEdit(student.id)}
                                  disabled={saving}
                                  className="gap-1"
                                >
                                  {saving ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                  ) : (
                                    <Check className="h-4 w-4" />
                                  )}
                                  Simpan
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={cancelEdit}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEdit(student)}
                                className="gap-1"
                              >
                                <Edit2 className="h-4 w-4" />
                                Edit
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
