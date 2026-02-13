-- Create video_answers table
CREATE TABLE public.video_answers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id TEXT NOT NULL,
    video_id TEXT NOT NULL,
    answer TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, module_id, video_id)
);

-- Enable RLS
ALTER TABLE public.video_answers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own video answers" 
ON public.video_answers FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update their own video answers" 
ON public.video_answers FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video answers" 
ON public.video_answers FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view all video answers" 
ON public.video_answers FOR SELECT 
USING (public.has_role(auth.uid(), 'guru'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_video_answers_updated_at 
BEFORE UPDATE ON public.video_answers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
