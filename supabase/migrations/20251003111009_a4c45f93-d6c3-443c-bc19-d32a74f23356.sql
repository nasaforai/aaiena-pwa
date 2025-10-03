-- Add category_id column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.categories(id);

-- Add missing boolean columns for product features
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_trending boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_new boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_on_offer boolean DEFAULT false;

-- Add image_url column (using base_image as fallback)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS image_url text;

-- Copy base_image to image_url for all products
UPDATE public.products 
SET image_url = base_image 
WHERE image_url IS NULL AND base_image IS NOT NULL;

-- Add additional product fields expected by app
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS original_price numeric,
ADD COLUMN IF NOT EXISTS discount_percentage numeric,
ADD COLUMN IF NOT EXISTS colors jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS sizes text[] DEFAULT ARRAY[]::text[],
ADD COLUMN IF NOT EXISTS additional_images text[] DEFAULT ARRAY[]::text[];

-- Map text categories to category_id by matching name with sub_category
-- This attempts to match products to subcategories (level 2) by name
UPDATE public.products p
SET category_id = c.id
FROM public.categories c
WHERE c.name ILIKE p.sub_category 
  AND c.brand_id = p.brand_id
  AND c.category_level = 2
  AND p.category_id IS NULL;

-- Fallback: If no subcategory match, try matching with main category (level 1)
UPDATE public.products p
SET category_id = c.id
FROM public.categories c
WHERE c.name ILIKE p.category 
  AND c.brand_id = p.brand_id
  AND c.category_level = 1
  AND p.category_id IS NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products(brand_id);

-- Add RLS policies for products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.brands 
    WHERE brands.id = products.brand_id 
    AND brands.is_active = true
  )
);