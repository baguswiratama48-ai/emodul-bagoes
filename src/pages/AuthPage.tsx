import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, GraduationCap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { z } from 'zod';
import logo from '@/assets/logo.png';

// Define available classes
const kelasOptions = [
  { value: 'X.9', label: 'Kelas X.9 (Ekonomi)' },
  { value: 'X.10', label: 'Kelas X.10 (Ekonomi)' },
  { value: 'X.11', label: 'Kelas X.11 (Ekonomi)' },
  { value: 'XI.3', label: 'Kelas XI.3 (PKWU)' },
  { value: 'XI.5', label: 'Kelas XI.5 (PKWU)' },
  { value: 'XI.6', label: 'Kelas XI.6 (PKWU)' },
  { value: 'XI.7', label: 'Kelas XI.7 (PKWU)' },
  { value: 'XI.8', label: 'Kelas XI.8 (PKWU)' },
  { value: 'XI.9', label: 'Kelas XI.9 (PKWU)' },
  { value: 'XI.10', label: 'Kelas XI.10 (PKWU)' },
  { value: 'XI.11', label: 'Kelas XI.11 (PKWU)' },
];

const emailSchema = z.string().email('Email tidak valid');
const passwordSchema = z.string().min(5, 'Password minimal 5 karakter');
const nisnSchema = z.string().regex(/^\d+$/, 'NISN harus berupa angka');

export default function AuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading, signIn } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Siswa login form
  const [siswaId, setSiswaId] = useState('');
  const [siswaNis, setSiswaNis] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('');
  
  // Guru login form
  const [guruEmail, setGuruEmail] = useState('');
  const [guruPassword, setGuruPassword] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

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

    // Validate class selection
    if (!selectedKelas) {
      toast({ title: 'Error', description: 'Pilih kelas terlebih dahulu', variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    
    // Convert NISN to email format
    const emailToUse = `${siswaId.trim()}@siswa.local`;
    
    const { error } = await signIn(emailToUse, siswaNis);
    
    if (error) {
      toast({ title: 'Login Gagal', description: 'NISN atau NIS salah', variant: 'destructive' });
    } else {
      toast({ title: 'Berhasil', description: 'Selamat datang!' });
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
                    <Label htmlFor="siswa-kelas">Kelas</Label>
                    <Select value={selectedKelas} onValueChange={setSelectedKelas}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        {kelasOptions.map((kelas) => (
                          <SelectItem key={kelas.value} value={kelas.value}>
                            {kelas.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                        type="password"
                        placeholder="Masukkan NIS"
                        className="pl-10"
                        value={siswaNis}
                        onChange={(e) => setSiswaNis(e.target.value)}
                        required
                      />
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
                        type="password"
                        placeholder="Masukkan password"
                        className="pl-10"
                        value={guruPassword}
                        onChange={(e) => setGuruPassword(e.target.value)}
                        required
                      />
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