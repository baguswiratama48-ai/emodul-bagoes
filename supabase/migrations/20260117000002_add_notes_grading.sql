-- Add score and feedback columns to student_notes
ALTER TABLE public.student_notes
ADD COLUMN IF NOT EXISTS score INTEGER,
ADD COLUMN IF NOT EXISTS feedback TEXT;

-- Allow teachers to update notes (to add score/feedback)
CREATE POLICY "Teachers update notes" ON public.student_notes
FOR UPDATE
USING (public.has_role(auth.uid(), 'guru'))
WITH CHECK (public.has_role(auth.uid(), 'guru'));
