import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2, Check, ShoppingBag, Ruler, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SizeRecommendationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recommendedSize: string | null;
  fitScore: number | null;
  alternativeSizes: Record<string, number> | null;
  isLoading: boolean;
  category?: string;
  productName?: string;
}

interface FitPreference {
  id: string;
  label: string;
  description: string;
}

const fitPreferences: FitPreference[] = [
  { id: "tight", label: "Tight", description: "Close-fitting, shows body shape" },
  { id: "regular", label: "Regular", description: "Standard fit, comfortable" },
  { id: "loose", label: "Loose", description: "Relaxed, roomier fit" },
];

export function SizeRecommendationDialog({
  isOpen,
  onClose,
  recommendedSize,
  fitScore,
  alternativeSizes,
  isLoading,
  category = "Clothing",
  productName = "Product",
}: SizeRecommendationDialogProps) {
  const [selectedFitPreference, setSelectedFitPreference] = useState<string>("regular");
  const [selectedSize, setSelectedSize] = useState<string | null>(recommendedSize);
  
  // Debug logging
  React.useEffect(() => {
    if (isOpen) {
      console.log("SizeRecommendationDialog props:", {
        recommendedSize,
        fitScore,
        alternativeSizes,
        category,
        productName
      });
    }
  }, [isOpen, recommendedSize, fitScore, alternativeSizes, category, productName]);

  // Update selected size when recommended size changes
  React.useEffect(() => {
    if (recommendedSize) {
      setSelectedSize(recommendedSize);
    }
  }, [recommendedSize]);

  // Function to get color based on fit score
  const getFitColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-green-400";
    if (score >= 4) return "bg-yellow-400";
    if (score >= 2) return "bg-orange-400";
    return "bg-red-500";
  };

  // Function to get fit description based on score
  const getFitDescription = (score: number) => {
    if (score >= 8) return "Perfect Fit";
    if (score >= 6) return "Good Fit";
    if (score >= 4) return "Average Fit";
    if (score >= 2) return "Poor Fit";
    return "Very Poor Fit";
  };

  // Convert alternativeSizes object to sorted array
  const sortedSizes = React.useMemo(() => {
    if (!alternativeSizes) return [];
    
    return Object.entries(alternativeSizes)
      .map(([size, score]) => ({ size, score: typeof score === 'number' ? score : parseFloat(score as any) }))
      .sort((a, b) => b.score - a.score);
  }, [alternativeSizes]);

  // Add the recommended size if it's not in alternativeSizes
  const allSizes = React.useMemo(() => {
    if (!recommendedSize || fitScore === null) return sortedSizes;
    
    const parsedFitScore = typeof fitScore === 'number' ? fitScore : parseFloat(fitScore as any);
    const hasRecommendedSize = sortedSizes.some(item => item.size === recommendedSize);
    
    if (!hasRecommendedSize && !isNaN(parsedFitScore)) {
      return [{ size: recommendedSize, score: parsedFitScore }, ...sortedSizes];
    }
    
    return sortedSizes;
  }, [recommendedSize, fitScore, sortedSizes]);

  // Scroll control for size slider
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <span>Size Recommendation</span>
            {recommendedSize && (
              <Badge className="bg-purple-100 text-purple-800 ml-2">
                {category}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {productName && `Size recommendation for ${productName}`}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
            <p className="text-gray-500">Finding your perfect size...</p>
          </div>
        ) : (
          <div className="py-4">
            {true ? (
              <>
                {/* Recommended Size Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl p-6 border border-gray-200 text-center"
                >
                  <h3 className="font-medium text-gray-500 mb-2">Recommended Size</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {recommendedSize || (allSizes.length > 0 ? allSizes[0].size : "M")}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="text-sm text-gray-600">
                      {getFitDescription(fitScore !== null ? fitScore : (allSizes.length > 0 ? allSizes[0].score : 7))}
                    </div>
                    <div className="w-16 h-2 rounded-full overflow-hidden bg-gray-200">
                      <div 
                        className={`h-full ${getFitColor(fitScore !== null ? fitScore : (allSizes.length > 0 ? allSizes[0].score : 7))}`} 
                        style={{ width: `${Math.min(100, (fitScore !== null ? fitScore : (allSizes.length > 0 ? allSizes[0].score : 7)) * 10)}%` }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Fit Preference Section */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-3">Fit Preference</h4>
                  <div className="flex gap-2">
                    {fitPreferences.map((pref) => (
                      <button
                        key={pref.id}
                        onClick={() => setSelectedFitPreference(pref.id)}
                        className={cn(
                          "flex-1 py-2 px-3 rounded-lg border text-sm transition-all",
                          selectedFitPreference === pref.id
                            ? "border-purple-500 bg-purple-50 text-purple-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                        )}
                      >
                        <div className="font-medium">{pref.label}</div>
                        <div className="text-xs text-gray-500">{pref.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* All Sizes Section */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-700">All Available Sizes</h4>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={scrollLeft}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={scrollRight}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <div 
                      ref={scrollContainerRef}
                      className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
                      style={{ scrollbarWidth: 'none' }}
                    >
                      {allSizes.length > 0 ? (
                        allSizes.map(({ size, score }) => (
                          <motion.div
                            key={size}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                              "flex-shrink-0 w-20 border rounded-lg p-3 text-center cursor-pointer transition-all",
                              selectedSize === size
                                ? "border-purple-500 bg-purple-50"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                            onClick={() => setSelectedSize(size)}
                          >
                            <div className="text-lg font-bold mb-1">{size}</div>
                            <div className="w-full h-1.5 rounded-full overflow-hidden bg-gray-200 mb-1">
                              <div 
                                className={getFitColor(score)} 
                                style={{ width: `${Math.min(100, score * 10)}%`, height: '100%' }}
                              />
                            </div>
                            <div className="text-xs text-gray-500">{score.toFixed(1)}</div>
                          </motion.div>
                        ))
                      ) : (
                        // Default sizes when no recommendations are available
                        ["S", "M", "L", "XL"].map((size) => {
                          const defaultScore = size === "M" ? 7 : size === "L" ? 6 : size === "S" ? 5 : 4;
                          return (
                            <motion.div
                              key={size}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={cn(
                                "flex-shrink-0 w-20 border rounded-lg p-3 text-center cursor-pointer transition-all",
                                selectedSize === size
                                  ? "border-purple-500 bg-purple-50"
                                  : "border-gray-200 hover:border-gray-300"
                              )}
                              onClick={() => setSelectedSize(size)}
                            >
                              <div className="text-lg font-bold mb-1">{size}</div>
                              <div className="w-full h-1.5 rounded-full overflow-hidden bg-gray-200 mb-1">
                                <div 
                                  className={getFitColor(defaultScore)} 
                                  style={{ width: `${Math.min(100, defaultScore * 10)}%`, height: '100%' }}
                                />
                              </div>
                              <div className="text-xs text-gray-500">{defaultScore.toFixed(1)}</div>
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Try On Button */}
                <motion.div 
                  className="mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
                  >
                    <Ruler className="w-4 h-4" />
                    <span>Try On {selectedSize}</span>
                  </Button>
                </motion.div>
              </>
            ) : (
              <div className="py-8 text-center">
                <div className="text-red-500 mb-3">
                  Unable to generate size recommendation
                </div>
                <p className="text-gray-500 mb-4">
                  We couldn't determine your size based on the available information. 
                  This could be because:
                </p>
                <ul className="text-left text-gray-500 mb-4 pl-4 list-disc">
                  <li className="mb-2">Your measurements don't match any available sizes</li>
                  <li className="mb-2">The product doesn't have a size chart</li>
                  <li className="mb-2">Your profile information needs to be updated</li>
                </ul>
                <p className="text-gray-500 mb-4">
                  We recommend trying a Medium size or updating your profile with accurate measurements.
                </p>
                <Button
                  variant="outline"
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {recommendedSize && (
            <Button 
              className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add Size {selectedSize}</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
