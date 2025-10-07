import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductVariant {
  id: number;
  product_id: number;
  size: string;
  color: string | null;
  sku: string | null;
  image1: string | null;
  image2: string | null;
  image3: string | null;
  image4: string | null;
  length_inches: number | null;
  waist_inches: number | null;
  chest_inches: number | null;
  inseam_length_inches: number | null;
  shoulder_inches: number | null;
  hip_inches: number | null;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export const useProductVariants = (productId: number | string) => {
  return useQuery({
    queryKey: ["product-variants", productId],
    queryFn: async () => {
      const numericId = typeof productId === 'string' ? parseInt(productId) : productId;
      const { data, error } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", numericId)
        .order("size");

      if (error) throw error;
      return data as ProductVariant[];
    },
    enabled: !!productId,
  });
};
