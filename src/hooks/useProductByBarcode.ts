import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Product } from "./useProducts";

export const useProductByBarcode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductByBarcode = async (barcode: string): Promise<Product | null> => {
    setLoading(true);
    setError(null);

    try {
      // @ts-expect-error - Supabase type inference issue with complex schemas
      const result = await supabase
        .from('products')
        .select('*')
        .eq('barcode', barcode)
        .maybeSingle();
      
      const { data, error } = result as { data: any; error: any };

      if (error) {
        console.error('Error fetching product by barcode:', error);
        setError('Failed to fetch product information');
        return null;
      }

      if (!data) {
        setError('Product not found for this barcode');
        return null;
      }

      // Explicitly map database fields to Product interface
      const product: Product = {
        product_id: data.product_id,
        name: data.name,
        description: data.description,
        price: data.price,
        category_id: data.category_id,
        image_url: data.image_url || data.base_image || '',
        additional_images: data.additional_images,
        sizes: data.sizes,
        colors: Array.isArray(data.colors) ? data.colors as { name: string; value: string; bgClass: string }[] : [],
        is_trending: data.is_trending,
        is_new: data.is_new,
        is_on_offer: data.is_on_offer,
        brand_id: data.brand_id,
        gender: data.gender,
        style_number: data.style_number,
        sku: data.sku,
      };

      return product;
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchProductByBarcode,
    loading,
    error,
    clearError: () => setError(null)
  };
};