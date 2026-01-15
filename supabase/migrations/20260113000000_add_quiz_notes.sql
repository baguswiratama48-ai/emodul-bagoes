-- 1. Table untuk status kuis
CREATE TABLE IF NOT EXISTS public.quiz_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_module_id UNIQUE (module_id)
);

-- 2. Kebijakan Keamanan (RLS) untuk quiz_settings
ALTER TABLE public.quiz_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read quiz settings" ON public.quiz_settings
    FOR SELECT USING (true);

CREATE POLICY "Teachers can update quiz settings" ON public.quiz_settings
    FOR ALL USING (auth.uid() IN (
        SELECT user_id FROM user_roles WHERE role = 'guru'
    ));
    
CREATE POLICY "Teachers can insert quiz settings" ON public.quiz_settings
    FOR INSERT WITH CHECK (auth.uid() IN (
        SELECT user_id FROM user_roles WHERE role = 'guru'
    ));

-- 3. Table untuk upload catatan
CREATE TABLE IF NOT EXISTS public.student_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Kebijakan Keamanan (RLS) untuk student_notes
ALTER TABLE public.student_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can see their own notes" ON public.student_notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students can upload their own notes" ON public.student_notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Teachers can see all notes" ON public.student_notes
    FOR SELECT USING (auth.uid() IN (
        SELECT user_id FROM user_roles WHERE role = 'guru'
    ));

-- 5. Bucket Storage untuk PDF
-- Note: Bucket creation is usually done via API/Dashboard, but this is for reference
INSERT INTO storage.buckets (id, name, public) 
VALUES ('notes', 'notes', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access Notes" ON storage.objects FOR SELECT USING (bucket_id = 'notes');
CREATE POLICY "Authenticated Upload Notes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'notes' AND auth.role() = 'authenticated');
