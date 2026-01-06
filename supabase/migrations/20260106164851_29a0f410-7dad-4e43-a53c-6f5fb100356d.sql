-- Create a function to lookup student class by NIS (security definer to bypass RLS)
CREATE OR REPLACE FUNCTION public.get_student_info_by_nis(p_nis text)
RETURNS TABLE(full_name text, kelas text) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT profiles.full_name, profiles.kelas
  FROM profiles
  WHERE profiles.nis = p_nis
  LIMIT 1;
END;
$$;