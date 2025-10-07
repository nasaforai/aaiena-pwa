-- Update the image for Mens - T-shirt product
UPDATE products 
SET image_url = '/images/ucb-mens-tshirt.jpeg',
    updated_at = now()
WHERE name = 'Mens - T-shirt';