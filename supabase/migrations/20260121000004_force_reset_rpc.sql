-- Function to COMPLETELY wipe all quiz answers for a specific student
-- This is a "Nuclear Option" that ignores module_id and bypasses RLS
create or replace function public.reset_all_quiz_data_for_student(
  p_user_id uuid
)
returns void
language plpgsql
security definer -- Runs with privileges of the creator (postgres), bypassing RLS
as $$
begin
  -- Delete ALL quiz answers for this user, regardless of module, status, or version
  delete from public.quiz_answers
  where user_id = p_user_id;
end;
$$;

-- Grant execution permission to authenticated users (teachers)
grant execute on function public.reset_all_quiz_data_for_student(uuid) to authenticated;
