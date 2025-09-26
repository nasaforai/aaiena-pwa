import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url: string;
  brand?: string;
  discount_percentage?: number;
  barcode?: string;
}

export const useProductByBarcode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductByBarcode = async (barcode: string): Promise<Product | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          original_price,
          image_url,
          brand,
          discount_percentage,
          barcode
        `)
        .eq('barcode', barcode)
        .maybeSingle();

      if (error) {
        console.error('Error fetching product by barcode:', error);
        setError('Failed to fetch product information');
        return null;
      }

      if (!data) {
        setError('Product not found for this barcode');
        return null;
      }

      return data;
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