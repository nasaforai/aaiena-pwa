-- Update products with correct local image paths for UCB brand
UPDATE products 
SET image_url = '/images/ucb-tshirts.jpg' 
WHERE (name ILIKE '%T-shirt%' OR name ILIKE '%Tshirt%') 
  AND brand_id IN (SELECT id FROM brands WHERE slug = 'ucb');

UPDATE products 
SET image_url = '/images/ucb-polo-shirts.jpg' 
WHERE name ILIKE '%Polo%' 
  AND brand_id IN (SELECT id FROM brands WHERE slug = 'ucb');

UPDATE products 
SET image_url = '/images/ucb-tops.jpg' 
WHERE name ILIKE '%Top%' 
  AND brand_id IN (SELECT id FROM brands WHERE slug = 'ucb');

UPDATE products 
SET image_url = '/images/ucb-trousers.jpg' 
WHERE (name ILIKE '%Trouser%' OR name ILIKE '%Pants%') 
  AND brand_id IN (SELECT id FROM brands WHERE slug = 'ucb');

-- Set placeholder for any remaining products with missing or external URLs
UPDATE products 
SET image_url = '/placeholder.svg' 
WHERE image_url IS NULL OR image_url = '' OR image_url LIKE 'http%';