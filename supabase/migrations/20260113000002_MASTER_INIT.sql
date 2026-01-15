-- MASTER INIT SCRIPT FOR E-MODUL BAGOES
-- Menjalankan semua definisi tabel dan policy sekaligus + FIX Izin Delete

-- 1. Setup Enum & Roles
CREATE TYPE public.app_role AS ENUM ('siswa', 'guru');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Helper Functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- 2. Profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  nis TEXT, 
  kelas TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles access" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Quiz Answers
CREATE TABLE public.quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, module_id, question_id)
);

ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students insert answers" ON public.quiz_answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Students view own answers" ON public.quiz_answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Teachers view all answers" ON public.quiz_answers FOR SELECT USING (public.has_role(auth.uid(), 'guru'));
-- FIX: DELETE PERMISSION
CREATE POLICY "Teachers delete answers" ON public.quiz_answers FOR DELETE USING (public.has_role(auth.uid(), 'guru'));

-- 4. LKPD Answers
CREATE TABLE public.lkpd_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id TEXT NOT NULL,
  problem_id INTEGER NOT NULL,
  answer TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, module_id, problem_id)
);

ALTER TABLE public.lkpd_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students insert LKPD" ON public.lkpd_answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Students update LKPD" ON public.lkpd_answers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Students view LKPD" ON public.lkpd_answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Teachers view all LKPD" ON public.lkpd_answers FOR SELECT USING (public.has_role(auth.uid(), 'guru'));
-- FIX: DELETE PERMISSION
CREATE POLICY "Teachers delete LKPD" ON public.lkpd_answers FOR DELETE USING (public.has_role(auth.uid(), 'guru'));

-- 5. Trigger Answers
CREATE TABLE public.trigger_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  question_id INTEGER NOT NULL,
  answer TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, module_id, question_id)
);

ALTER TABLE public.trigger_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students insert trigger" ON public.trigger_answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Students update trigger" ON public.trigger_answers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Students view trigger" ON public.trigger_answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Teachers view trigger" ON public.trigger_answers FOR SELECT USING (has_role(auth.uid(), 'guru'));
-- FIX: DELETE PERMISSION
CREATE POLICY "Teachers delete trigger" ON public.trigger_answers FOR DELETE USING (has_role(auth.uid(), 'guru'));

-- 6. Quiz Settings (Control)
CREATE TABLE IF NOT EXISTS public.quiz_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.quiz_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON public.quiz_settings FOR SELECT USING (true);
CREATE POLICY "Teachers update settings" ON public.quiz_settings FOR ALL USING (public.has_role(auth.uid(), 'guru'));

-- 7. Student Notes
CREATE TABLE IF NOT EXISTS public.student_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.student_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students see own notes" ON public.student_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students upload notes" ON public.student_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Teachers view notes" ON public.student_notes FOR SELECT USING (public.has_role(auth.uid(), 'guru'));
-- FIX: DELETE PERMISSION
CREATE POLICY "Teachers delete notes" ON public.student_notes FOR DELETE USING (public.has_role(auth.uid(), 'guru'));


-- 8. Auto Updates Trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lkpd_modtime BEFORE UPDATE ON public.lkpd_answers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_trigger_modtime BEFORE UPDATE ON public.trigger_answers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Handle New User Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _role app_role;
BEGIN
  INSERT INTO public.profiles (id, full_name, nis, kelas)
  VALUES (
    new.id, 
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'nis',
    new.raw_user_meta_data ->> 'kelas'
  );
  
  _role := COALESCE((new.raw_user_meta_data ->> 'role')::app_role, 'siswa');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, _role);
  
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Storage Bucket (Reference only, usually auto-created or via UI)
INSERT INTO storage.buckets (id, name, public) VALUES ('notes', 'notes', true) ON CONFLICT DO NOTHING;
CREATE POLICY "Public Access Notes" ON storage.objects FOR SELECT USING (bucket_id = 'notes');
CREATE POLICY "Authenticated Upload Notes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'notes' AND auth.role() = 'authenticated');
CREATE POLICY "Teachers Delete Notes Storage" ON storage.objects FOR DELETE USING (bucket_id = 'notes' AND (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'guru')));
