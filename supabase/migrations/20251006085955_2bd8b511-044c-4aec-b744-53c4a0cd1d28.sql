-- Update Dresses category with new cover photo
UPDATE categories 
SET image_url = '/images/category-cover-2.jpg',
    updated_at = now()
WHERE id = 'dec611f1-268b-4970-8ce5-df199ad949db';