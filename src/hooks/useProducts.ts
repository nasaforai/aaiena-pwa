import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export interface Product {
  product_id: number;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  discount_percentage: number | null;
  category_id: string | null;
  image_url: string;
  additional_images: string[] | null;
  sizes: string[] | null;
  colors: { name: string; value: string; bgClass: string }[];
  is_trending: boolean | null;
  is_new: boolean | null;
  is_on_offer: boolean | null;
  brand_id: string | null;
  brand?: string | null;
  gender: string | null;
  style_number: string;
  sku: string;
}

export const useProducts = (brandId?: string) => {
  return useQuery({
    queryKey: ["products", brandId],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*");

      if (brandId) {
        query = query.eq("brand_id", brandId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data.map(item => ({
        ...item,
        colors: Array.isArray(item.colors) ? item.colors as { name: string; value: string; bgClass: string }[] : []
      })) as Product[];
    },
  });
};

export const useProductsByCategory = (category: "trending" | "new" | "offer", brandId?: string) => {
  return useQuery({
    queryKey: ["products", category, brandId],
    queryFn: async () => {
      let query = supabase.from("products").select("*");

      if (brandId) {
        query = query.eq("brand_id", brandId);
      }

      switch (category) {
        case "trending":
          query = query.eq("is_trending", true);
          break;
        case "new":
          query = query.eq("is_new", true);
          break;
        case "offer":
          query = query.eq("is_on_offer", true);
          break;
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data.map(item => ({
        ...item,
        colors: Array.isArray(item.colors) ? item.colors as { name: string; value: string; bgClass: string }[] : []
      })) as Product[];
    },
  });
};

export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("product_id", parseInt(productId))
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      
      return {
        ...data,
        colors: Array.isArray(data.colors) ? data.colors as { name: string; value: string; bgClass: string }[] : []
      } as Product;
    },
    enabled: !!productId,
  });
};