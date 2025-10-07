-- Remove product ID 14 from "Trending Now" section
UPDATE products SET is_trending = false WHERE product_id = 14;