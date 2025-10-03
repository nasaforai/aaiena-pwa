-- Add inch measurement columns to profiles table for size chart matching
ALTER TABLE public.profiles 
ADD COLUMN chest_inches numeric,
ADD COLUMN waist_inches numeric,
ADD COLUMN shoulder_inches numeric,
ADD COLUMN hip_inches numeric;

-- Add comment for clarity
COMMENT ON COLUMN public.profiles.chest_inches IS 'Chest measurement in inches for size chart matching';
COMMENT ON COLUMN public.profiles.waist_inches IS 'Waist measurement in inches for size chart matching';
COMMENT ON COLUMN public.profiles.shoulder_inches IS 'Shoulder measurement in inches for size chart matching';
COMMENT ON COLUMN public.profiles.hip_inches IS 'Hip measurement in inches for size chart matching';