-- Mark 4 specific products as trending
UPDATE products 
SET is_trending = true 
WHERE product_id IN (14, 13, 12, 11);