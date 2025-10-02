import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  sku: string | null;
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

export const useProductVariants = (productId: string) => {
  return useQuery({
    queryKey: ["product-variants", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", productId)
        .order("size");

      if (error) throw error;
      return data as ProductVariant[];
    },
    enabled: !!productId,
  });
};
