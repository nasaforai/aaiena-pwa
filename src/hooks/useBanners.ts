import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  link_url: string;
  button_text: string;
  background_color: string;
  text_color: string;
  is_active: boolean;
  display_order: number;
  banner_type: string;
}

export const useBanners = (type?: string) => {
  return useQuery({
    queryKey: ["banners", type],
    queryFn: async () => {
      let query = supabase
        .from("banners")
        .select("*")
        .eq("is_active", true);

      if (type) {
        query = query.eq("banner_type", type);
      }

      const { data, error } = await query.order("display_order");

      if (error) throw error;
      return data as Banner[];
    },
  });
};