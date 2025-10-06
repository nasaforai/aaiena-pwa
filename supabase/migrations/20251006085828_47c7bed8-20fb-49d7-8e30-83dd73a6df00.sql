-- Update T-Shirts category with new cover photo
UPDATE categories 
SET image_url = '/images/category-tshirts-cover.jpg',
    updated_at = now()
WHERE id = '1618a3d7-697b-4923-a452-6e108b4f19e1';