-- Update UCB Tops category with cover image
UPDATE categories
SET image_url = '/images/ucb-tops.jpg',
    updated_at = now()
WHERE id = 'd30dd533-72bc-4ea9-8ac3-dbf9889ab46c';