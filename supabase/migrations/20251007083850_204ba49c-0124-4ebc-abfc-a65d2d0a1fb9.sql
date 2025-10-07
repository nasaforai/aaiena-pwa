-- Update product images for product_id 9 and 12
UPDATE products
SET 
  image_url = '/images/ucb-product-9.jpeg',
  base_image = '/images/ucb-product-9.jpeg',
  updated_at = now()
WHERE product_id = 9;

UPDATE products
SET 
  image_url = '/images/ucb-product-12.jpeg',
  base_image = '/images/ucb-product-12.jpeg',
  updated_at = now()
WHERE product_id = 12;