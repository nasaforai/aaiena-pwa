-- Add barcode field to products table
ALTER TABLE public.products 
ADD COLUMN barcode text;

-- Add some sample barcodes for testing
UPDATE public.products 
SET barcode = CASE 
  WHEN id IN (SELECT id FROM public.products LIMIT 1) THEN '1234567890123'
  WHEN id IN (SELECT id FROM public.products OFFSET 1 LIMIT 1) THEN '9876543210987'
  WHEN id IN (SELECT id FROM public.products OFFSET 2 LIMIT 1) THEN '5555666677778'
  ELSE CONCAT('BC', LPAD(FLOOR(RANDOM() * 1000000000)::text, 9, '0'))
END;