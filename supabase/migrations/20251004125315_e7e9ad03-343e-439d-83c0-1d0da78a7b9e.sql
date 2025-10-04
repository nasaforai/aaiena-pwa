-- Update UCB Polo Shirts category with cover image
UPDATE categories 
SET image_url = '/images/ucb-polo-shirts.jpg',
    updated_at = now()
WHERE id = '730562ff-30f3-452a-80d1-721362f23c46'
  AND name = 'Polo Shirts'
  AND brand_id = 'bb68d5c7-e32c-4e99-a469-dd5318444276';