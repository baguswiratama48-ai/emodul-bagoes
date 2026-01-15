-- Allow teachers to delete quiz answers
CREATE POLICY "Teachers can delete quiz answers"
ON public.quiz_answers
FOR DELETE
USING (public.has_role(auth.uid(), 'guru'));

-- Allow teachers to delete lkpd answers
CREATE POLICY "Teachers can delete lkpd answers"
ON public.lkpd_answers
FOR DELETE
USING (public.has_role(auth.uid(), 'guru'));

-- Allow teachers to delete trigger answers
CREATE POLICY "Teachers can delete trigger answers"
ON public.trigger_answers
FOR DELETE
USING (public.has_role(auth.uid(), 'guru'));

-- Allow teachers to delete student notes
CREATE POLICY "Teachers can delete student notes"
ON public.student_notes
FOR DELETE
USING (auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'guru'
));
