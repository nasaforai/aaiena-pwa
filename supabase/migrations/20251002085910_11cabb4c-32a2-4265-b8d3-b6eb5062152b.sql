-- Add parent-child category support
ALTER TABLE categories 
  ADD COLUMN parent_category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  ADD COLUMN category_level INTEGER DEFAULT 2,
  ADD COLUMN display_order INTEGER DEFAULT 0;

-- Create index for parent-child queries
CREATE INDEX idx_categories_parent_id ON categories(parent_category_id);
CREATE INDEX idx_categories_brand_level ON categories(brand_id, category_level);

-- Get UCB brand ID for data migration
DO $$
DECLARE
  ucb_brand_id UUID;
  ladies_parent_id UUID;
  mens_parent_id UUID;
  tops_id UUID;
  dresses_id UUID;
  polo_tshirts_id UUID;
  jeans_joggers_id UUID;
BEGIN
  -- Get UCB brand ID
  SELECT id INTO ucb_brand_id FROM brands WHERE slug = 'ucb';
  
  IF ucb_brand_id IS NOT NULL THEN
    -- Insert parent categories
    INSERT INTO categories (name, brand_id, category_level, display_order, image_url, icon_url)
    VALUES 
      ('Ladies', ucb_brand_id, 1, 1, '/images/ladies-category.jpg', '/icons/user.svg')
    RETURNING id INTO ladies_parent_id;
    
    INSERT INTO categories (name, brand_id, category_level, display_order, image_url, icon_url)
    VALUES 
      ('Mens', ucb_brand_id, 1, 2, '/images/mens-category.jpg', '/icons/user.svg')
    RETURNING id INTO mens_parent_id;
    
    -- Get existing category IDs
    SELECT id INTO tops_id FROM categories WHERE name = 'Women Tops' AND brand_id = ucb_brand_id;
    SELECT id INTO dresses_id FROM categories WHERE name = 'Women Dresses' AND brand_id = ucb_brand_id;
    SELECT id INTO polo_tshirts_id FROM categories WHERE name = 'Men Polo & T-Shirts' AND brand_id = ucb_brand_id;
    SELECT id INTO jeans_joggers_id FROM categories WHERE name = 'Men Jeans & Joggers' AND brand_id = ucb_brand_id;
    
    -- Update existing categories to be children of Ladies
    IF tops_id IS NOT NULL THEN
      UPDATE categories 
      SET name = 'Tops', 
          parent_category_id = ladies_parent_id, 
          category_level = 2,
          display_order = 1
      WHERE id = tops_id;
    END IF;
    
    IF dresses_id IS NOT NULL THEN
      UPDATE categories 
      SET name = 'Dresses', 
          parent_category_id = ladies_parent_id, 
          category_level = 2,
          display_order = 2
      WHERE id = dresses_id;
    END IF;
    
    -- Split Men Polo & T-Shirts into separate categories
    IF polo_tshirts_id IS NOT NULL THEN
      -- Create new Polo Shirts category
      INSERT INTO categories (name, brand_id, parent_category_id, category_level, display_order, image_url, icon_url)
      VALUES ('Polo Shirts', ucb_brand_id, mens_parent_id, 2, 2, 
              (SELECT image_url FROM categories WHERE id = polo_tshirts_id),
              (SELECT icon_url FROM categories WHERE id = polo_tshirts_id));
      
      -- Create new T-Shirts category
      INSERT INTO categories (name, brand_id, parent_category_id, category_level, display_order, image_url, icon_url)
      VALUES ('T-Shirts', ucb_brand_id, mens_parent_id, 2, 3,
              (SELECT image_url FROM categories WHERE id = polo_tshirts_id),
              (SELECT icon_url FROM categories WHERE id = polo_tshirts_id));
      
      -- Update products: polo shirts (products with 'polo' in name/description go to Polo Shirts)
      UPDATE products 
      SET category_id = (SELECT id FROM categories WHERE name = 'Polo Shirts' AND brand_id = ucb_brand_id)
      WHERE category_id = polo_tshirts_id 
        AND (LOWER(name) LIKE '%polo%' OR LOWER(description) LIKE '%polo%');
      
      -- Update products: t-shirts (remaining products go to T-Shirts)
      UPDATE products 
      SET category_id = (SELECT id FROM categories WHERE name = 'T-Shirts' AND brand_id = ucb_brand_id)
      WHERE category_id = polo_tshirts_id;
      
      -- Delete old combined category
      DELETE FROM categories WHERE id = polo_tshirts_id;
    END IF;
    
    -- Update Jeans & Joggers to Trousers
    IF jeans_joggers_id IS NOT NULL THEN
      UPDATE categories 
      SET name = 'Trousers', 
          parent_category_id = mens_parent_id, 
          category_level = 2,
          display_order = 1
      WHERE id = jeans_joggers_id;
    END IF;
  END IF;
END $$;