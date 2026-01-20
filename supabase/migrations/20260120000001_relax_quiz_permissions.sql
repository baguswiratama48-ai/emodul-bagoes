-- Migrasi Darurat: Relax Permissions & Pre-fill Data
-- File: supabase/migrations/20260120000001_relax_quiz_permissions.sql

-- 1. Pre-fill data untuk memastikan barisnya ada
-- Ini mencegah error saat 'UPDATE' jika baris belum ada, meskipun upsert harusnya menangani ini.
INSERT INTO public.quiz_settings (module_id, is_active)
VALUES 
  ('permintaan', false),
  ('kerajinan-limbah', false)
ON CONFLICT (module_id) DO NOTHING;

-- 2. Relax RLS Policy (Sementara)
-- Izinkan SEMUA user yang login (authenticated) untuk update
-- Ini untuk memastikan tidak ada masalah dengan pengecekan Role "guru" yang kompleks
DROP POLICY IF EXISTS "Teachers full access quiz settings" ON public.quiz_settings;

CREATE POLICY "Allow authenticated update quiz settings" ON public.quiz_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Pastikan policy read tetap ada
DROP POLICY IF EXISTS "Public read quiz settings" ON public.quiz_settings;
CREATE POLICY "Public read quiz settings" ON public.quiz_settings
    FOR SELECT USING (true);
