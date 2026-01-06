-- Create table for trigger question answers (pertanyaan pemantik)
CREATE TABLE public.trigger_answers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id text NOT NULL,
  question_id integer NOT NULL,
  answer text NOT NULL,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT trigger_answers_unique UNIQUE (user_id, module_id, question_id)
);

-- Enable Row Level Security
ALTER TABLE public.trigger_answers ENABLE ROW LEVEL SECURITY;

-- Create policies for trigger_answers
CREATE POLICY "Students can insert their own trigger answers"
ON public.trigger_answers
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update their own trigger answers"
ON public.trigger_answers
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Students can view their own trigger answers"
ON public.trigger_answers
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view all trigger answers"
ON public.trigger_answers
FOR SELECT
USING (has_role(auth.uid(), 'guru'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_trigger_answers_updated_at
BEFORE UPDATE ON public.trigger_answers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();