-- Allow teachers to update student profiles (for NIS and kelas)
CREATE POLICY "Teachers can update all profiles"
ON public.profiles
FOR UPDATE
USING (has_role(auth.uid(), 'guru'::app_role))
WITH CHECK (has_role(auth.uid(), 'guru'::app_role));

-- Allow teachers to view all user_roles for filtering students
CREATE POLICY "Teachers can view all user roles"
ON public.user_roles
FOR SELECT
USING (has_role(auth.uid(), 'guru'::app_role));