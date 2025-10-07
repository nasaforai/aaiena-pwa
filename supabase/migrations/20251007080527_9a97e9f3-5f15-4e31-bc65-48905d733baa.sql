-- Remove product ID 14 from category 1618a3d7-697b-4923-a452-6e108b4f19e1
UPDATE products SET category_id = NULL WHERE product_id = 14;