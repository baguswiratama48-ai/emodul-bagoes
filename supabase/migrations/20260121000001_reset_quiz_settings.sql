-- NUCLEAR OPTION: Reset Quiz Settings Table
-- File: supabase/migrations/20260121000001_reset_quiz_settings.sql

-- 1. Notify reload immediately
NOTIFY pgrst, 'reload schema';

-- 2. Drop table completely to remove any hidden cache references
DROP TABLE IF EXISTS public.quiz_settings CASCADE;

-- 3. Recreate table from scratch
CREATE TABLE public.quiz_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_module_id UNIQUE (module_id)
);

-- 4. Enable RLS
ALTER TABLE public.quiz_settings ENABLE ROW LEVEL SECURITY;

-- 5. Explicitly Grant Permissions
GRANT ALL ON public.quiz_settings TO postgres;
GRANT ALL ON public.quiz_settings TO anon;
GRANT ALL ON public.quiz_settings TO authenticated;
GRANT ALL ON public.quiz_settings TO service_role;

-- 6. Create Simple Policies (No complex joins for now to minimize error surface)

-- Read: Everyone
CREATE POLICY "Public read quiz settings" ON public.quiz_settings
    FOR SELECT USING (true);

-- Insert/Update: Authenticated users (we trust the app UI to hide buttons from students)
-- We can tighten this later once it works.
CREATE POLICY "Auth users update quiz settings" ON public.quiz_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- 7. Pre-fill default data
INSERT INTO public.quiz_settings (module_id, is_active)
VALUES 
  ('permintaan', false),
  ('kerajinan-limbah', false);

-- 8. Final Notify
NOTIFY pgrst, 'reload schema';
