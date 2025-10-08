-- Remove product 14 from trending
UPDATE products 
SET is_trending = false 
WHERE product_id = 14;

-- Add women's product 3 to trending
UPDATE products 
SET is_trending = true 
WHERE product_id = 3;