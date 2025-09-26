-- Create brands table
CREATE TABLE public.brands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#FFFFFF', 
  description TEXT,
  theme_config JSONB DEFAULT '{}',
  domain TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on brands table
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Create policy for brands (publicly viewable)
CREATE POLICY "Brands are viewable by everyone" 
ON public.brands 
FOR SELECT 
USING (is_active = true);

-- Add brand_id to existing tables
ALTER TABLE public.products ADD COLUMN brand_id UUID REFERENCES public.brands(id);
ALTER TABLE public.categories ADD COLUMN brand_id UUID REFERENCES public.brands(id);
ALTER TABLE public.banners ADD COLUMN brand_id UUID REFERENCES public.brands(id);

-- Update existing RLS policies to be brand-aware
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.brands WHERE brands.id = products.brand_id AND brands.is_active = true));

DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.brands WHERE brands.id = categories.brand_id AND brands.is_active = true));

DROP POLICY IF EXISTS "Banners are viewable by everyone" ON public.banners;
CREATE POLICY "Banners are viewable by everyone" 
ON public.banners 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.brands WHERE brands.id = banners.brand_id AND brands.is_active = true));

-- Create trigger for brands updated_at
CREATE TRIGGER update_brands_updated_at
BEFORE UPDATE ON public.brands
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default H&M brand for existing data
INSERT INTO public.brands (name, slug, logo_url, primary_color, secondary_color, description)
VALUES (
  'H&M',
  'hm',
  '/images/hm.png',
  '#000000',
  '#FFFFFF',
  'Fashion and quality at the best price in a sustainable way'
);

-- Update existing products, categories, and banners to use H&M brand
UPDATE public.products SET brand_id = (SELECT id FROM public.brands WHERE slug = 'hm');
UPDATE public.categories SET brand_id = (SELECT id FROM public.brands WHERE slug = 'hm');
UPDATE public.banners SET brand_id = (SELECT id FROM public.brands WHERE slug = 'hm');