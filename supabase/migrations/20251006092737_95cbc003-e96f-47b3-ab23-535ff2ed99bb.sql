-- Change measurement columns from integer to numeric to support decimal values
ALTER TABLE profiles 
ALTER COLUMN height TYPE numeric USING height::numeric,
ALTER COLUMN weight TYPE numeric USING weight::numeric,
ALTER COLUMN chest TYPE numeric USING chest::numeric,
ALTER COLUMN waist TYPE numeric USING waist::numeric,
ALTER COLUMN pants_size TYPE numeric USING pants_size::numeric;