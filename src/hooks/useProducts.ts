import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export interface Product {
  id: string;
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
  stock_quantity: number | null;
  brand: string | null;
  material: string | null;
  care_instructions: string | null;
}

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data.map(item => ({
        ...item,
        colors: Array.isArray(item.colors) ? item.colors as { name: string; value: string; bgClass: string }[] : []
      })) as Product[];
    },
  });
};

export const useProductsByCategory = (category: "trending" | "new" | "offer") => {
  return useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      let query = supabase.from("products").select("*");

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

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return {
        ...data,
        colors: Array.isArray(data.colors) ? data.colors as { name: string; value: string; bgClass: string }[] : []
      } as Product;
    },
    enabled: !!id,
  });
};