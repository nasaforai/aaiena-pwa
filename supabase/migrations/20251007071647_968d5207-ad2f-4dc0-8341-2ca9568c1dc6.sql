-- Update the image for Ladies Top - Striped Pattern product
UPDATE products 
SET image_url = '/images/ucb-ladies-striped-top.jpeg',
    updated_at = now()
WHERE product_id = 3;