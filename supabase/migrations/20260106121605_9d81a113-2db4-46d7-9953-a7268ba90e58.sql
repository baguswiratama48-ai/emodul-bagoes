-- Add NIS and kelas columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN nis TEXT,
ADD COLUMN kelas TEXT;

-- Create feedback table for teacher responses
CREATE TABLE public.teacher_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answer_type TEXT NOT NULL, -- 'trigger', 'lkpd', 'reflection'
  answer_id UUID NOT NULL,
  feedback TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.teacher_feedback ENABLE ROW LEVEL SECURITY;

-- Teachers can insert feedback
CREATE POLICY "Teachers can insert feedback"
ON public.teacher_feedback
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'guru'::app_role));

-- Teachers can update their own feedback
CREATE POLICY "Teachers can update their own feedback"
ON public.teacher_feedback
FOR UPDATE
USING (auth.uid() = teacher_id);

-- Teachers can view all feedback
CREATE POLICY "Teachers can view all feedback"
ON public.teacher_feedback
FOR SELECT
USING (has_role(auth.uid(), 'guru'::app_role));

-- Students can view feedback on their answers
CREATE POLICY "Students can view their own feedback"
ON public.teacher_feedback
FOR SELECT
USING (auth.uid() = student_id);

-- Trigger for updated_at
CREATE TRIGGER update_teacher_feedback_updated_at
BEFORE UPDATE ON public.teacher_feedback
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();