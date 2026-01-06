-- Allow teachers (guru) to view student profiles for dashboards
CREATE POLICY "Teachers can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'guru'::app_role));