-- Add student_reply and student_reply_at columns to teacher_feedback table
ALTER TABLE teacher_feedback
ADD COLUMN student_reply TEXT,
ADD COLUMN student_reply_at TIMESTAMP WITH TIME ZONE;
