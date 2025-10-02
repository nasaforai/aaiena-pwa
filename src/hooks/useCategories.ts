import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  name: string;
  image_url: string;
  icon_url: string;
  parent_category_id?: string | null;
  category_level?: number;
  display_order?: number;
  subcategories?: Category[];
}

export const useCategories = (brandId?: string, options?: {
  parentId?: string | null;
  level?: number;
  includeSubcategories?: boolean;
}) => {
  return useQuery({
    queryKey: ["categories", brandId, options?.parentId, options?.level, options?.includeSubcategories],
    queryFn: async () => {
      let query = supabase
        .from("categories")
        .select("*");

      if (brandId) {
        query = query.eq("brand_id", brandId);
      }

      if (options?.parentId !== undefined) {
        query = query.eq("parent_category_id", options.parentId);
      }

      if (options?.level !== undefined) {
        query = query.eq("category_level", options.level);
      }

      const { data, error } = await query.order("display_order").order("name");

      if (error) throw error;

      let categories = data as Category[];

      // If includeSubcategories is true, fetch subcategories for each parent
      if (options?.includeSubcategories) {
        const categoriesWithSubs = await Promise.all(
          categories.map(async (category) => {
            const { data: subcats } = await supabase
              .from("categories")
              .select("*")
              .eq("parent_category_id", category.id)
              .order("display_order")
              .order("name");
            
            return {
              ...category,
              subcategories: subcats || []
            };
          })
        );
        categories = categoriesWithSubs;
      }

      return categories;
    },
  });
};

export const useParentCategories = (brandId?: string) => {
  return useCategories(brandId, { level: 1, includeSubcategories: true });
};

export const useSubcategories = (parentId: string) => {
  return useCategories(undefined, { parentId, level: 2 });
};