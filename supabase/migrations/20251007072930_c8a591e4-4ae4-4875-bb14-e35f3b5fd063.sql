-- Update the image for Mens - Polo Shirt product
UPDATE products 
SET image_url = '/images/ucb-mens-polo-shirt.jpeg',
    updated_at = now()
WHERE name = 'Mens - Polo Shirt';