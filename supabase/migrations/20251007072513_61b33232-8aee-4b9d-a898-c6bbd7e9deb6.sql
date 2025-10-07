-- Update the image for Ladies Striped Tricot Dress product
UPDATE products 
SET image_url = '/images/ucb-ladies-striped-dress.jpeg',
    updated_at = now()
WHERE name = 'Ladies Striped Tricot Dress';