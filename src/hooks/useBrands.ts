import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from '@/integrations/supabase/types';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  description: string | null;
  theme_config: Json;
  domain: string | null;
  is_active: boolean;
}

export const useBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      return data as Brand[];
    },
  });
};

export const useBrand = (slug: string) => {
  return useQuery({
    queryKey: ["brand", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (error) throw error;
      return data as Brand;
    },
    enabled: !!slug,
  });
};