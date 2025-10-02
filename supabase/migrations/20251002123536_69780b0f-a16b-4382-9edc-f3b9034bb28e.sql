-- Create brand_size_charts table
CREATE TABLE IF NOT EXISTS public.brand_size_charts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES public.brands(id) ON DELETE CASCADE NOT NULL,
  garment_type text NOT NULL,
  size_system text NOT NULL CHECK (size_system IN ('alpha', 'numeric')),
  category_ids uuid[] NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (brand_id, garment_type)
);

-- Create size_chart_measurements table
CREATE TABLE IF NOT EXISTS public.size_chart_measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  size_chart_id uuid REFERENCES public.brand_size_charts(id) ON DELETE CASCADE NOT NULL,
  size_label text NOT NULL,
  display_order integer NOT NULL,
  shoulder_inches numeric,
  chest_inches numeric,
  waist_inches numeric,
  hips_inches numeric,
  inseam_inches numeric,
  length_inches numeric,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (size_chart_id, size_label)
);

-- Update product_variants table to add size_chart_measurement_id
ALTER TABLE public.product_variants 
ADD COLUMN IF NOT EXISTS size_chart_measurement_id uuid REFERENCES public.size_chart_measurements(id) ON DELETE SET NULL;

-- Enable RLS on new tables
ALTER TABLE public.brand_size_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.size_chart_measurements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for brand_size_charts (viewable by everyone for active brands)
CREATE POLICY "Size charts are viewable by everyone" 
ON public.brand_size_charts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.brands 
    WHERE brands.id = brand_size_charts.brand_id 
    AND brands.is_active = true
  )
);

-- Create RLS policies for size_chart_measurements (viewable by everyone)
CREATE POLICY "Size chart measurements are viewable by everyone" 
ON public.size_chart_measurements 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.brand_size_charts 
    JOIN public.brands ON brands.id = brand_size_charts.brand_id
    WHERE brand_size_charts.id = size_chart_measurements.size_chart_id 
    AND brands.is_active = true
  )
);

-- Create trigger for brand_size_charts updated_at
CREATE TRIGGER update_brand_size_charts_updated_at
BEFORE UPDATE ON public.brand_size_charts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for size_chart_measurements updated_at
CREATE TRIGGER update_size_chart_measurements_updated_at
BEFORE UPDATE ON public.size_chart_measurements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert UCB size charts
-- 1. Female Upper Wear Chart
INSERT INTO public.brand_size_charts (brand_id, garment_type, size_system, category_ids)
VALUES (
  'bb68d5c7-e32c-4e99-a469-dd5318444276',
  'Female Upper Wear',
  'alpha',
  ARRAY['d30dd533-72bc-4ea9-8ac3-dbf9889ab46c']::uuid[]
) ON CONFLICT (brand_id, garment_type) DO NOTHING;

-- Insert Female Upper Wear measurements
WITH chart AS (
  SELECT id FROM public.brand_size_charts 
  WHERE brand_id = 'bb68d5c7-e32c-4e99-a469-dd5318444276' 
  AND garment_type = 'Female Upper Wear'
)
INSERT INTO public.size_chart_measurements (size_chart_id, size_label, display_order, shoulder_inches, chest_inches, waist_inches)
SELECT chart.id, size_data.* FROM chart, (VALUES
  ('XS', 1, 14.88, 39.76, 25.19),
  ('S', 2, 15.39, 41.73, 27.55),
  ('M', 3, 15.79, 43.7, 29.92),
  ('L', 4, 16.3, 45.67, 32.48),
  ('XL', 5, 16.81, 47.64, 35.03),
  ('EL', 6, 17.32, 49.61, 37.59)
) AS size_data(size_label, display_order, shoulder_inches, chest_inches, waist_inches)
ON CONFLICT (size_chart_id, size_label) DO NOTHING;

-- 2. Female Full Wear Chart
INSERT INTO public.brand_size_charts (brand_id, garment_type, size_system, category_ids)
VALUES (
  'bb68d5c7-e32c-4e99-a469-dd5318444276',
  'Female Full Wear',
  'alpha',
  ARRAY['dec611f1-268b-4970-8ce5-df199ad949db']::uuid[]
) ON CONFLICT (brand_id, garment_type) DO NOTHING;

-- Insert Female Full Wear measurements
WITH chart AS (
  SELECT id FROM public.brand_size_charts 
  WHERE brand_id = 'bb68d5c7-e32c-4e99-a469-dd5318444276' 
  AND garment_type = 'Female Full Wear'
)
INSERT INTO public.size_chart_measurements (size_chart_id, size_label, display_order, shoulder_inches, chest_inches, waist_inches, hips_inches)
SELECT chart.id, size_data.* FROM chart, (VALUES
  ('XS', 1, 16.5, 32.28, 24.8, 29.8),
  ('S', 2, 17.28, 33.86, 27, 32),
  ('M', 3, 17.72, 36.22, 29.1, 34.1),
  ('L', 4, 18.5, 38.58, 31.3, 36.3),
  ('XL', 5, 18.9, 40.94, 33.5, 38.5),
  ('EL', 6, 19.69, 43.31, 35.6, 40.6)
) AS size_data(size_label, display_order, shoulder_inches, chest_inches, waist_inches, hips_inches)
ON CONFLICT (size_chart_id, size_label) DO NOTHING;

-- 3. Male Lower Wear Chart
INSERT INTO public.brand_size_charts (brand_id, garment_type, size_system, category_ids)
VALUES (
  'bb68d5c7-e32c-4e99-a469-dd5318444276',
  'Male Lower Wear',
  'numeric',
  ARRAY['5e8fb2ba-1832-423f-931f-448279e088c8']::uuid[]
) ON CONFLICT (brand_id, garment_type) DO NOTHING;

-- Insert Male Lower Wear measurements
WITH chart AS (
  SELECT id FROM public.brand_size_charts 
  WHERE brand_id = 'bb68d5c7-e32c-4e99-a469-dd5318444276' 
  AND garment_type = 'Male Lower Wear'
)
INSERT INTO public.size_chart_measurements (size_chart_id, size_label, display_order, waist_inches, hips_inches)
SELECT chart.id, size_data.* FROM chart, (VALUES
  ('28', 1, 26.77, 34.1),
  ('30', 2, 28.74, 36.5),
  ('32', 3, 30.7, 38.5),
  ('34', 4, 32.67, 40.4),
  ('36', 5, 34.64, 42.4),
  ('38', 6, 37, 44.4),
  ('40', 7, 38.97, 46.7),
  ('42', 8, 40.94, 49)
) AS size_data(size_label, display_order, waist_inches, hips_inches)
ON CONFLICT (size_chart_id, size_label) DO NOTHING;

-- 4. Male Upper Wear Chart
INSERT INTO public.brand_size_charts (brand_id, garment_type, size_system, category_ids)
VALUES (
  'bb68d5c7-e32c-4e99-a469-dd5318444276',
  'Male Upper Wear',
  'alpha',
  ARRAY['1618a3d7-697b-4923-a452-6e108b4f19e1', '730562ff-30f3-452a-80d1-721362f23c46']::uuid[]
) ON CONFLICT (brand_id, garment_type) DO NOTHING;

-- Insert Male Upper Wear measurements
WITH chart AS (
  SELECT id FROM public.brand_size_charts 
  WHERE brand_id = 'bb68d5c7-e32c-4e99-a469-dd5318444276' 
  AND garment_type = 'Male Upper Wear'
)
INSERT INTO public.size_chart_measurements (size_chart_id, size_label, display_order, shoulder_inches, chest_inches, waist_inches)
SELECT chart.id, size_data.* FROM chart, (VALUES
  ('S', 1, 16.9, 36.22, 30.7),
  ('M', 2, 17.7, 38.58, 33.06),
  ('L', 3, 18.1, 40.94, 35.42),
  ('XL', 4, 18.9, 43.31, 37.79),
  ('EL', 5, 19.7, 45.67, 40.15),
  ('KL', 6, 20.5, 48.03, 42.51)
) AS size_data(size_label, display_order, shoulder_inches, chest_inches, waist_inches)
ON CONFLICT (size_chart_id, size_label) DO NOTHING;