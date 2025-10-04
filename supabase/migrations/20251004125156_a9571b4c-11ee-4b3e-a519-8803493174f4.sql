-- Update UCB Trousers category with cover image
UPDATE categories 
SET image_url = '/images/ucb-trousers.jpg',
    updated_at = now()
WHERE id = '5e8fb2ba-1832-423f-931f-448279e088c8'
  AND name = 'Trousers'
  AND brand_id = 'bb68d5c7-e32c-4e99-a469-dd5318444276';