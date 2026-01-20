-- Migrasi untuk memperbaiki tabel quiz_settings dan policy RLS
-- File: supabase/migrations/20260120000000_fix_quiz_settings.sql

-- 1. Pastikan Enum app_role ada (untuk berjaga-jaga)
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('siswa', 'guru');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Pastikan fungsi has_role ada dan aman
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- 3. Perbaiki struktur tabel quiz_settings
CREATE TABLE IF NOT EXISTS public.quiz_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_module_id UNIQUE (module_id)
);

-- 4. Reset Policy untuk quiz_settings agar bersih
ALTER TABLE public.quiz_settings ENABLE ROW LEVEL SECURITY;

-- Hapus policy lama jika ada (untuk menghindari konflik)
DROP POLICY IF EXISTS "Public read quiz settings" ON public.quiz_settings;
DROP POLICY IF EXISTS "Teachers can update quiz settings" ON public.quiz_settings;
DROP POLICY IF EXISTS "Teachers can insert quiz settings" ON public.quiz_settings;
DROP POLICY IF EXISTS "Public read settings" ON public.quiz_settings;
DROP POLICY IF EXISTS "Teachers update settings" ON public.quiz_settings;

-- Buat Policy Baru yang Konsisten
-- Semua orang (termasuk public/anon jika diperlukan, tapi web kita pake auth) bisa BACA status kuis
CREATE POLICY "Public read quiz settings" ON public.quiz_settings
    FOR SELECT USING (true);

-- Hanya GURU yang bisa INSERT/UPDATE/DELETE
CREATE POLICY "Teachers full access quiz settings" ON public.quiz_settings
    FOR ALL USING (
        public.has_role(auth.uid(), 'guru')
    );

-- 5. Pastikan User Roles bisa dibaca oleh user sendiri (penting untuk has_role check di client)
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Selesai
