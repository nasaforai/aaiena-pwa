import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductSizeChart } from "@/hooks/useProductSizeChart";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SizeChartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sizeChart: ProductSizeChart | null;
  isLoading?: boolean;
}

export const SizeChartDialog: React.FC<SizeChartDialogProps> = ({
  open,
  onOpenChange,
  sizeChart,
  isLoading,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {sizeChart?.garment_type || "Size Chart"}
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="py-8 text-center text-muted-foreground">
            Loading size chart...
          </div>
        )}

        {!isLoading && !sizeChart && (
          <div className="py-8 text-center text-muted-foreground">
            No size chart available for this product.
          </div>
        )}

        {!isLoading && sizeChart && (
          <ScrollArea className="w-full">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-4 py-2 text-left font-medium">
                      Size
                    </th>
                    {sizeChart.measurements[0]?.shoulder_inches !== null && (
                      <th className="border border-border px-4 py-2 text-left font-medium">
                        Shoulder (in)
                      </th>
                    )}
                    {sizeChart.measurements[0]?.chest_inches !== null && (
                      <th className="border border-border px-4 py-2 text-left font-medium">
                        Chest (in)
                      </th>
                    )}
                    {sizeChart.measurements[0]?.waist_inches !== null && (
                      <th className="border border-border px-4 py-2 text-left font-medium">
                        Waist (in)
                      </th>
                    )}
                    {sizeChart.measurements[0]?.hips_inches !== null && (
                      <th className="border border-border px-4 py-2 text-left font-medium">
                        Hips (in)
                      </th>
                    )}
                    {sizeChart.measurements[0]?.length_inches !== null && (
                      <th className="border border-border px-4 py-2 text-left font-medium">
                        Length (in)
                      </th>
                    )}
                    {sizeChart.measurements[0]?.inseam_inches !== null && (
                      <th className="border border-border px-4 py-2 text-left font-medium">
                        Inseam (in)
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sizeChart.measurements.map((measurement) => (
                    <tr key={measurement.id} className="hover:bg-muted/50">
                      <td className="border border-border px-4 py-2 font-medium">
                        {measurement.size_label}
                      </td>
                      {measurement.shoulder_inches !== null && (
                        <td className="border border-border px-4 py-2">
                          {measurement.shoulder_inches}
                        </td>
                      )}
                      {measurement.chest_inches !== null && (
                        <td className="border border-border px-4 py-2">
                          {measurement.chest_inches}
                        </td>
                      )}
                      {measurement.waist_inches !== null && (
                        <td className="border border-border px-4 py-2">
                          {measurement.waist_inches}
                        </td>
                      )}
                      {measurement.hips_inches !== null && (
                        <td className="border border-border px-4 py-2">
                          {measurement.hips_inches}
                        </td>
                      )}
                      {measurement.length_inches !== null && (
                        <td className="border border-border px-4 py-2">
                          {measurement.length_inches}
                        </td>
                      )}
                      {measurement.inseam_inches !== null && (
                        <td className="border border-border px-4 py-2">
                          {measurement.inseam_inches}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        )}

        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            💡 Tip: Compare these measurements with your profile measurements
            for the best fit.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
