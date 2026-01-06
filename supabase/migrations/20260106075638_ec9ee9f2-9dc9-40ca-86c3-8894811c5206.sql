-- Add foreign key constraint from trigger_answers to profiles for proper join
ALTER TABLE public.trigger_answers 
ADD CONSTRAINT trigger_answers_user_id_profiles_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key constraint from lkpd_answers to profiles
ALTER TABLE public.lkpd_answers 
ADD CONSTRAINT lkpd_answers_user_id_profiles_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key constraint from quiz_answers to profiles
ALTER TABLE public.quiz_answers 
ADD CONSTRAINT quiz_answers_user_id_profiles_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;