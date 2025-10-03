import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SizeChartMeasurement {
  id: string;
  size_chart_id: string;
  size_label: string;
  chest_inches: number | null;
  waist_inches: number | null;
  shoulder_inches: number | null;
  hips_inches: number | null;
  length_inches: number | null;
  inseam_inches: number | null;
  display_order: number;
}

export interface ProductSizeChart {
  id: string;
  brand_id: string;
  garment_type: string;
  size_system: string;
  category_ids: string[];
  measurements: SizeChartMeasurement[];
}

export const useProductSizeChart = (productId: string | null) => {
  return useQuery({
    queryKey: ["product-size-chart", productId],
    queryFn: async () => {
      if (!productId) return null;

      // First, get the product to find its brand_id and category_id
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("brand_id, category_id")
        .eq("id", productId)
        .single();

      if (productError) throw productError;
      if (!product?.brand_id || !product?.category_id) return null;

      // Get the size chart for this brand and category
      const { data: sizeCharts, error: chartError } = await supabase
        .from("brand_size_charts")
        .select("*")
        .eq("brand_id", product.brand_id)
        .contains("category_ids", [product.category_id]);

      if (chartError) throw chartError;
      if (!sizeCharts || sizeCharts.length === 0) return null;

      // Get the first matching size chart
      const sizeChart = sizeCharts[0];

      // Get all measurements for this size chart
      const { data: measurements, error: measurementsError } = await supabase
        .from("size_chart_measurements")
        .select("*")
        .eq("size_chart_id", sizeChart.id)
        .order("display_order");

      if (measurementsError) throw measurementsError;

      return {
        ...sizeChart,
        measurements: measurements || [],
      } as ProductSizeChart;
    },
    enabled: !!productId,
  });
};
