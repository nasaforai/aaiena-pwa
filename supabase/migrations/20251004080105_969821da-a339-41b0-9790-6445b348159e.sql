-- Link men's products to their correct subcategories

-- Link Trousers product
UPDATE products 
SET category_id = '5e8fb2ba-1832-423f-931f-448279e088c8'
WHERE product_id = 6;

-- Link Polo Shirts products
UPDATE products 
SET category_id = '730562ff-30f3-452a-80d1-721362f23c46'
WHERE product_id IN (9, 12);

-- Link T-Shirts products
UPDATE products 
SET category_id = '1618a3d7-697b-4923-a452-6e108b4f19e1'
WHERE product_id IN (10, 11, 13, 14);