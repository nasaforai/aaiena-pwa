-- Enable RLS on product_variants table
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for product_variants
CREATE POLICY "Product variants are viewable by everyone" 
ON public.product_variants 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.products 
    JOIN public.brands ON brands.id = products.brand_id
    WHERE products.product_id = product_variants.product_id 
    AND brands.is_active = true
  )
);