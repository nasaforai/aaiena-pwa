-- Add UCB brand
INSERT INTO brands (name, slug, logo_url, primary_color, secondary_color, description, is_active)
VALUES (
  'United Colors of Benetton',
  'ucb',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Benetton_Group_logo.svg/320px-Benetton_Group_logo.svg.png',
  '#00A551',
  '#FFFFFF',
  'United Colors of Benetton - Italian fashion brand known for colorful, casual clothing',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Add new columns to products table for UCB product details
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS style_number text,
ADD COLUMN IF NOT EXISTS season text,
ADD COLUMN IF NOT EXISTS material_group text,
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS color_code text;

-- Create product_variants table for size-specific information
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  size text NOT NULL,
  sku text UNIQUE,
  length_inches numeric,
  waist_inches numeric,
  chest_inches numeric,
  inseam_length_inches numeric,
  shoulder_inches numeric,
  hip_inches numeric,
  stock_quantity integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(product_id, size)
);

-- Enable RLS on product_variants
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for product_variants (public read access)
CREATE POLICY "Product variants are viewable by everyone"
ON product_variants
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM products 
    JOIN brands ON brands.id = products.brand_id 
    WHERE products.id = product_variants.product_id 
    AND brands.is_active = true
  )
);

-- Create trigger for product_variants updated_at
CREATE TRIGGER update_product_variants_updated_at
BEFORE UPDATE ON product_variants
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add UCB categories
DO $$
DECLARE
  ucb_brand_id uuid;
BEGIN
  SELECT id INTO ucb_brand_id FROM brands WHERE slug = 'ucb';
  
  IF ucb_brand_id IS NOT NULL THEN
    INSERT INTO categories (name, brand_id, icon_url)
    VALUES 
      ('Women Tops', ucb_brand_id, '/icons/shirt.svg'),
      ('Women Dresses', ucb_brand_id, '/icons/shirt.svg'),
      ('Men Polo & T-Shirts', ucb_brand_id, '/icons/tShirt.svg'),
      ('Men Jeans & Joggers', ucb_brand_id, '/icons/shirt.svg')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;