-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('siswa', 'guru');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check role (prevents recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Get user role function
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- User roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Create quiz_answers table to store student answers
CREATE TABLE public.quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, module_id, question_id)
);

-- Enable RLS on quiz_answers
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;

-- Quiz answers policies
CREATE POLICY "Students can insert their own answers"
  ON public.quiz_answers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can view their own answers"
  ON public.quiz_answers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view all answers"
  ON public.quiz_answers FOR SELECT
  USING (public.has_role(auth.uid(), 'guru'));

-- Create lkpd_answers table to store student LKPD answers
CREATE TABLE public.lkpd_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id TEXT NOT NULL,
  problem_id INTEGER NOT NULL,
  answer TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, module_id, problem_id)
);

-- Enable RLS on lkpd_answers
ALTER TABLE public.lkpd_answers ENABLE ROW LEVEL SECURITY;

-- LKPD answers policies
CREATE POLICY "Students can insert their own LKPD answers"
  ON public.lkpd_answers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update their own LKPD answers"
  ON public.lkpd_answers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Students can view their own LKPD answers"
  ON public.lkpd_answers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view all LKPD answers"
  ON public.lkpd_answers FOR SELECT
  USING (public.has_role(auth.uid(), 'guru'));

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _role app_role;
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  
  -- Get role from metadata (default to 'siswa')
  _role := COALESCE((new.raw_user_meta_data ->> 'role')::app_role, 'siswa');
  
  -- Assign role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, _role);
  
  RETURN new;
END;
$$;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lkpd_answers_updated_at
  BEFORE UPDATE ON public.lkpd_answers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();