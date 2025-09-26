import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  name: string;
  image_url: string;
  icon_url: string;
}

export const useCategories = (brandId?: string) => {
  return useQuery({
    queryKey: ["categories", brandId],
    queryFn: async () => {
      let query = supabase
        .from("categories")
        .select("*");

      if (brandId) {
        query = query.eq("brand_id", brandId);
      }

      const { data, error } = await query.order("name");

      if (error) throw error;
      return data as Category[];
    },
  });
};