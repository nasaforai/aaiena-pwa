-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount_percentage INTEGER,
  category_id UUID REFERENCES public.categories(id),
  image_url TEXT NOT NULL,
  additional_images TEXT[], -- Array of image URLs
  sizes TEXT[] DEFAULT ARRAY['XS', 'S', 'M', 'L', 'XL'],
  colors JSONB DEFAULT '[]', -- Array of color objects {name, value, bgClass}
  is_trending BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_on_offer BOOLEAN DEFAULT false,
  stock_quantity INTEGER DEFAULT 0,
  brand TEXT,
  material TEXT,
  care_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create banners table for promotional content
CREATE TABLE public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  button_text TEXT,
  background_color TEXT DEFAULT '#8B5CF6',
  text_color TEXT DEFAULT '#FFFFFF',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  banner_type TEXT DEFAULT 'promotion', -- promotion, discount, designer_picks
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no auth needed for shopping)
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Banners are viewable by everyone" 
ON public.banners 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_banners_updated_at
BEFORE UPDATE ON public.banners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.categories (name, image_url, icon_url) VALUES
('Dress', '/images/dress.jpg', '/icons/dress.svg'),
('Jeans', '/images/dress.jpg', '/icons/jeans.svg'),
('Trousers', '/images/dress.jpg', '/icons/trousers.svg'),
('Tops', '/images/dress.jpg', '/icons/tops.svg'),
('Bags', '/images/dress.jpg', '/icons/bags.svg');

INSERT INTO public.banners (title, subtitle, description, image_url, button_text, banner_type) VALUES
('DESIGNER PICKS', NULL, 'Exclusive styles handpicked by top designers. Discover unique, limited-edition fashion today!', '/images/dress.jpg', 'Explore Now', 'designer_picks'),
('Discount', 'New Users Only', 'Special offers for first-time shoppers', '/images/dress.jpg', 'Shop Now', 'discount'),
('WHAT''S NEW!', 'SEE ALL LATEST', 'Discover the latest fashion trends and styles', '/images/dress.jpg', 'See All', 'promotion');

INSERT INTO public.products (name, description, price, original_price, discount_percentage, image_url, colors, is_trending, is_new, is_on_offer, stock_quantity, brand) VALUES
('Miss Chase Women''s V-Neck Maxi Dress', 'Elegant and comfortable maxi dress perfect for any occasion', 500, 1000, 50, '/images/dress.jpg', '[{"name": "white", "value": "#ffffff", "bgClass": "bg-white border-2 border-gray-300"}, {"name": "green", "value": "#10b981", "bgClass": "bg-green-300"}, {"name": "yellow", "value": "#fbbf24", "bgClass": "bg-yellow-300"}, {"name": "pink", "value": "#ec4899", "bgClass": "bg-pink-300"}]', true, false, true, 50, 'Miss Chase'),
('Drop-Shoulder Cotton Tee', 'Relaxed Fit, All-Day Comfort cotton t-shirt', 700, 1400, 50, '/lovable-uploads/df938429-9c2a-4054-b1fe-5c1aa483a885.png', '[{"name": "white", "value": "#ffffff", "bgClass": "bg-white border-2 border-gray-300"}, {"name": "black", "value": "#000000", "bgClass": "bg-black"}, {"name": "blue", "value": "#3b82f6", "bgClass": "bg-blue-300"}]', true, true, false, 30, 'Cotton Co'),
('Classic Denim Jacket', 'Timeless denim jacket for casual styling', 1200, 2000, 40, '/images/dress.jpg', '[{"name": "blue", "value": "#3b82f6", "bgClass": "bg-blue-300"}, {"name": "black", "value": "#000000", "bgClass": "bg-black"}]', false, true, true, 25, 'Denim Co'),
('Elegant Evening Dress', 'Perfect for special occasions and events', 2500, 4000, 38, '/images/dress.jpg', '[{"name": "black", "value": "#000000", "bgClass": "bg-black"}, {"name": "red", "value": "#ef4444", "bgClass": "bg-red-400"}]', true, false, false, 15, 'Elegance');