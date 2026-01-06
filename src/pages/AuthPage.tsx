import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, GraduationCap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { z } from 'zod';
import logo from '@/assets/logo.png';

const emailSchema = z.string().email('Email tidak valid');
const passwordSchema = z.string().min(5, 'Password minimal 5 karakter');

export default function AuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading, signIn, signUp } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupRole, setSignupRole] = useState<'siswa' | 'guru'>('siswa');

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-format: if input looks like NISN (numbers only), append @siswa.local
    let emailToUse = loginEmail.trim();
    if (/^\d+$/.test(emailToUse)) {
      emailToUse = `${emailToUse}@siswa.local`;
    }
    
    // Validate
    const emailResult = emailSchema.safeParse(emailToUse);
    if (!emailResult.success) {
      toast({ title: 'Error', description: 'NISN atau email tidak valid', variant: 'destructive' });
      return;
    }
    
    const passwordResult = passwordSchema.safeParse(loginPassword);
    if (!passwordResult.success) {
      toast({ title: 'Error', description: passwordResult.error.errors[0].message, variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    
    const { error } = await signIn(emailToUse, loginPassword);
    
    if (error) {
      let message = 'Terjadi kesalahan saat login';
      if (error.message.includes('Invalid login credentials')) {
        message = 'NISN/Email atau password salah';
      }
      toast({ title: 'Login Gagal', description: message, variant: 'destructive' });
    } else {
      toast({ title: 'Berhasil', description: 'Selamat datang kembali!' });
      navigate('/');
    }
    
    setIsSubmitting(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!signupName.trim()) {
      toast({ title: 'Error', description: 'Nama lengkap wajib diisi', variant: 'destructive' });
      return;
    }
    
    const emailResult = emailSchema.safeParse(signupEmail);
    if (!emailResult.success) {
      toast({ title: 'Error', description: emailResult.error.errors[0].message, variant: 'destructive' });
      return;
    }
    
    const passwordResult = passwordSchema.safeParse(signupPassword);
    if (!passwordResult.success) {
      toast({ title: 'Error', description: passwordResult.error.errors[0].message, variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    
    const { error } = await signUp(signupEmail, signupPassword, signupName, signupRole);
    
    if (error) {
      let message = 'Terjadi kesalahan saat mendaftar';
      if (error.message.includes('already registered')) {
        message = 'Email sudah terdaftar. Silakan login.';
      }
      toast({ title: 'Pendaftaran Gagal', description: message, variant: 'destructive' });
    } else {
      toast({ title: 'Berhasil', description: `Akun ${signupRole} berhasil dibuat!` });
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

        <Card>
          <CardHeader>
            <CardTitle>Masuk ke Akun</CardTitle>
            <CardDescription>
              Siswa: masukkan NISN dan NIS sebagai password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">NISN / Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="text"
                    placeholder="Masukkan NISN atau email"
                    className="pl-10"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">NIS / Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Masukkan NIS atau password"
                    className="pl-10"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
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
      </motion.div>
    </div>
  );
}