-- RENAME TABLE OPTION
-- File: supabase/migrations/20260121000002_rename_quiz_table.sql

-- 1. Create New Table
CREATE TABLE IF NOT EXISTS public.quiz_access_control (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_quiz_module_id UNIQUE (module_id)
);

-- 2. Enable RLS
ALTER TABLE public.quiz_access_control ENABLE ROW LEVEL SECURITY;

-- 3. Grant Permissions
GRAnt ALL ON public.quiz_access_control TO postgres;
GRANT ALL ON public.quiz_access_control TO anon;
GRANT ALL ON public.quiz_access_control TO authenticated;
GRANT ALL ON public.quiz_access_control TO service_role;

-- 4. Policies
-- Read: Everyone
CREATE POLICY "Public read quiz access" ON public.quiz_access_control
    FOR SELECT USING (true);

-- Update: Authenticated users
CREATE POLICY "Auth users update quiz access" ON public.quiz_access_control
    FOR ALL USING (auth.role() = 'authenticated');

-- 5. Pre-fill Data
INSERT INTO public.quiz_access_control (module_id, is_active)
VALUES 
  ('permintaan', false),
  ('kerajinan-limbah', false)
ON CONFLICT (module_id) DO NOTHING;

-- 6. Clean up old table
DROP TABLE IF EXISTS public.quiz_settings CASCADE;

-- 7. Notify
NOTIFY pgrst, 'reload schema';
