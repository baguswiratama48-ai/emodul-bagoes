-- Create RPC function to safely reset student quiz data
-- Handles RLS bypass and multiple module_id variations

CREATE OR REPLACE FUNCTION public.reset_quiz_for_student(p_user_id UUID, p_module_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with privileges of the creator (postgres/admin), bypassing RLS for the user
SET search_path = public
AS $$
BEGIN
  -- 1. Delete by specific module_id
  DELETE FROM public.quiz_answers 
  WHERE user_id = p_user_id AND module_id = p_module_id;

  -- 2. Delete legacy data (null, default, or empty string)
  -- Only if it's considered a general reset or cleanup is desired
  DELETE FROM public.quiz_answers 
  WHERE user_id = p_user_id AND (module_id IS NULL OR module_id = 'default' OR module_id = '');

  -- 3. Also reset score in module_progress if exists (optional, depending on architecture)
  -- Assuming module_progress table exists and stores scores
  -- DELETE FROM public.module_progress WHERE user_id = p_user_id AND module_id = p_module_id;
  
END;
$$;

-- Grant execute permission to authenticated users (teachers need to call this)
GRANT EXECUTE ON FUNCTION public.reset_quiz_for_student(UUID, TEXT) TO authenticated;
