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
      const { data, error } = await supabase
        .from('products')
        .select('*')
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

      return {
        ...data,
        colors: Array.isArray(data.colors) ? data.colors as { name: string; value: string; bgClass: string }[] : []
      } as Product;
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