-- Add body_type column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN body_type TEXT;