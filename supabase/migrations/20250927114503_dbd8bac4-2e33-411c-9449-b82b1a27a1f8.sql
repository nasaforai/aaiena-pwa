-- Create a default brand for the application
INSERT INTO brands (
  id,
  name,
  slug,
  primary_color,
  secondary_color,
  description,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'H&M',
  'hm',
  '#000000',
  '#ffffff', 
  'Fashion and clothing retailer',
  true,
  now(),
  now()
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  primary_color = EXCLUDED.primary_color,
  secondary_color = EXCLUDED.secondary_color,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  updated_at = now();