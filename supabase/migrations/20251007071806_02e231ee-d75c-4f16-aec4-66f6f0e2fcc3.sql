-- Update the image for Mens Basic Sweatpants product
UPDATE products 
SET image_url = '/images/ucb-mens-sweatpants.jpeg',
    updated_at = now()
WHERE product_id = 6;