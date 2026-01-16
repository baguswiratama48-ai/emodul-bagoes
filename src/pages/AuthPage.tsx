import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, GraduationCap, Users, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import logo from '@/assets/logo.png';

const emailSchema = z.string().email('Email tidak valid');
const passwordSchema = z.string().min(5, 'Password minimal 5 karakter');
const nisnSchema = z.string().regex(/^\d+$/, 'NISN harus berupa angka');

export default function AuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading, signIn } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Visibility states
  const [showSiswaPassword, setShowSiswaPassword] = useState(false);
  const [showGuruPassword, setShowGuruPassword] = useState(false);

  // Siswa login form
  const [siswaId, setSiswaId] = useState('');
  const [siswaNis, setSiswaNis] = useState('');

  // Auto-detected student info
  const [detectedStudent, setDetectedStudent] = useState<{ full_name: string; kelas: string } | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  // Guru login form
  const [guruEmail, setGuruEmail] = useState('');
  const [guruPassword, setGuruPassword] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Auto-detect student class when NIS changes
  useEffect(() => {
    const detectStudent = async () => {
      if (siswaNis.length >= 5) {
        setIsDetecting(true);
        try {
          const { data, error } = await supabase
            .rpc('get_student_info_by_nis', { p_nis: siswaNis.trim() });

          if (data && data.length > 0 && !error) {
            setDetectedStudent({ full_name: data[0].full_name, kelas: data[0].kelas });
          } else {
            setDetectedStudent(null);
          }
        } catch {
          setDetectedStudent(null);
        }
        setIsDetecting(false);
      } else {
        setDetectedStudent(null);
      }
    };

    const debounce = setTimeout(detectStudent, 500);
    return () => clearTimeout(debounce);
  }, [siswaNis]);

  const handleSiswaLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate NISN
    const nisnResult = nisnSchema.safeParse(siswaId.trim());
    if (!nisnResult.success) {
      toast({ title: 'Error', description: 'NISN harus berupa angka', variant: 'destructive' });
      return;
    }

    // Validate NIS (password)
    const passwordResult = passwordSchema.safeParse(siswaNis);
    if (!passwordResult.success) {
      toast({ title: 'Error', description: passwordResult.error.errors[0].message, variant: 'destructive' });
      return;
    }

    // Check if student is detected
    if (!detectedStudent) {
      toast({ title: 'Error', description: 'Data siswa tidak ditemukan. Pastikan NIS benar.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    // Convert NISN to email format
    const emailToUse = `${siswaId.trim()}@siswa.local`;

    const { error } = await signIn(emailToUse, siswaNis);

    if (error) {
      toast({ title: 'Login Gagal', description: 'NISN atau NIS salah', variant: 'destructive' });
    } else {
      toast({ title: 'Berhasil', description: `Selamat datang, ${detectedStudent.full_name}!` });
      navigate('/');
    }

    setIsSubmitting(false);
  };

  const handleGuruLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const emailResult = emailSchema.safeParse(guruEmail.trim());
    if (!emailResult.success) {
      toast({ title: 'Error', description: 'Email tidak valid', variant: 'destructive' });
      return;
    }

    // Validate password
    const passwordResult = passwordSchema.safeParse(guruPassword);
    if (!passwordResult.success) {
      toast({ title: 'Error', description: passwordResult.error.errors[0].message, variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    const { error } = await signIn(guruEmail.trim(), guruPassword);

    if (error) {
      toast({ title: 'Login Gagal', description: 'Email atau password salah', variant: 'destructive' });
    } else {
      toast({ title: 'Berhasil', description: 'Selamat datang, Bapak/Ibu Guru!' });
      navigate('/');
    }

    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <img src={logo} alt="E-Modul Bagoes" className="h-24 w-auto" />
          </div>
          <p className="text-muted-foreground mt-2">Masuk untuk melanjutkan pembelajaran</p>
        </div>

        <Tabs defaultValue="siswa" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="siswa" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Login Siswa
            </TabsTrigger>
            <TabsTrigger value="guru" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Login Guru
            </TabsTrigger>
          </TabsList>

          {/* Siswa Login Tab */}
          <TabsContent value="siswa">
            <Card>
              <CardHeader>
                <CardTitle>Masuk sebagai Siswa</CardTitle>
                <CardDescription>
                  Masukkan NISN dan NIS untuk login
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSiswaLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siswa-nisn">NISN</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="siswa-nisn"
                        type="text"
                        placeholder="Masukkan NISN"
                        className="pl-10"
                        value={siswaId}
                        onChange={(e) => setSiswaId(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siswa-nis">NIS</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="siswa-nis"
                        type={showSiswaPassword ? "text" : "password"}
                        placeholder="Masukkan NIS"
                        className="pl-10 pr-10"
                        value={siswaNis}
                        onChange={(e) => setSiswaNis(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSiswaPassword(!showSiswaPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground focus:outline-none"
                      >
                        {showSiswaPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Auto-detected student info */}
                  {isDetecting && (
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Mencari data siswa...</span>
                    </div>
                  )}

                  {detectedStudent && !isDetecting && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">Data Siswa Ditemukan</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Nama:</span>
                          <p className="font-medium">{detectedStudent.full_name}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Kelas:</span>
                          <p className="font-medium">{detectedStudent.kelas}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {siswaNis.length >= 5 && !detectedStudent && !isDetecting && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Data siswa tidak ditemukan. Pastikan NIS benar.
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary"
                    disabled={isSubmitting || !detectedStudent}
                  >
                    {isSubmitting ? 'Memproses...' : 'Masuk'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guru Login Tab */}
          <TabsContent value="guru">
            <Card>
              <CardHeader>
                <CardTitle>Masuk sebagai Guru</CardTitle>
                <CardDescription>
                  Masukkan email dan password untuk login
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGuruLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="guru-email">Email</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="guru-email"
                        type="email"
                        placeholder="Masukkan email"
                        className="pl-10"
                        value={guruEmail}
                        onChange={(e) => setGuruEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guru-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="guru-password"
                        type={showGuruPassword ? "text" : "password"}
                        placeholder="Masukkan password"
                        className="pl-10 pr-10"
                        value={guruPassword}
                        onChange={(e) => setGuruPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowGuruPassword(!showGuruPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground focus:outline-none"
                      >
                        {showGuruPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Memproses...' : 'Masuk'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
