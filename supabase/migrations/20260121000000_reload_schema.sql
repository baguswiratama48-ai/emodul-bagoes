-- Reload Supabase Schema Cache
-- Utiles untuk memaksa Supabase refresh cache API (PostgREST)
-- Gunakan ini jika tabel baru tidak terdeteksi oleh API

NOTIFY pgrst, 'reload schema';

-- Pastikan tabel quiz_settings benar-benar ada (Idempotent check)
CREATE TABLE IF NOT EXISTS public.quiz_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_module_id UNIQUE (module_id)
);

-- Pastikan RLS aktif (jaga-jaga)
ALTER TABLE public.quiz_settings ENABLE ROW LEVEL SECURITY;
