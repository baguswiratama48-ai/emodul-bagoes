-- Allow students to update their own feedback rows (to add replies)
CREATE POLICY "Students can reply to feedback"
ON public.teacher_feedback
FOR UPDATE
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id);
