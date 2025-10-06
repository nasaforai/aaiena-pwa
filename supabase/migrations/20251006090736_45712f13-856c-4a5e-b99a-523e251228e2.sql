-- Fix product data by populating image_url and price from variants
-- For "Mens Basic Sweatpants" and any other products with missing data

-- Update products with missing image_url from their first variant's image
UPDATE products p
SET image_url = COALESCE(
  (SELECT COALESCE(pv.image1, pv.image2, pv.image3, pv.image4, pv.image_url_1, pv.image_url_2, pv.image_url_3, pv.image_url_4)
   FROM product_variants pv
   WHERE pv.product_id = p.product_id
   AND (pv.image1 IS NOT NULL OR pv.image2 IS NOT NULL OR pv.image3 IS NOT NULL OR pv.image4 IS NOT NULL 
        OR pv.image_url_1 IS NOT NULL OR pv.image_url_2 IS NOT NULL OR pv.image_url_3 IS NOT NULL OR pv.image_url_4 IS NOT NULL)
   ORDER BY pv.id
   LIMIT 1
  ),
  p.base_image
),
updated_at = now()
WHERE p.image_url IS NULL OR p.image_url = '';

-- Update products with missing or zero price from their minimum variant price
UPDATE products p
SET price = (
  SELECT MIN(pv.price)
  FROM product_variants pv
  WHERE pv.product_id = p.product_id
  AND pv.price > 0
),
updated_at = now()
WHERE (p.price IS NULL OR p.price = 0)
AND EXISTS (
  SELECT 1 FROM product_variants pv 
  WHERE pv.product_id = p.product_id AND pv.price > 0
);