import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  ArrowDown,
  ChevronDown,
  ArrowRight,
  Shirt,
  UsersRound,
  UserPen,
  Ruler,
  Camera,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useNavigation } from "@/hooks/useNavigation";
import { Button } from "@/components/ui/button";
import Topbar from "@/components/ui/topbar";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import ProductCard from "@/components/ProductCard";
import { RadialBarChart, RadialBar, ResponsiveContainer, Cell } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import { useToast } from "@/hooks/use-toast";
import { useProductSizeChart } from "@/hooks/useProductSizeChart";
import { useSizeRecommendation } from "@/hooks/useSizeRecommendation";
import { SizeChartDialog } from "@/components/SizeChartDialog";
import { useProductVariants } from "@/hooks/useProductVariants";
import {
  getMySizeRecommendation,
  getSizeRecommendations,
  SizeRecommendation as ApiSizeRecommendation,
  RecommendationResponse,
  SizeChartMeasurement,
} from "@/lib/sizingApi";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RoomJoinDialog } from "@/components/RoomJoinDialog";
import BottomNavigation from "@/components/BottomNavigation";
import { useProfile } from "@/hooks/useProfile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MeasurementResultsDialog } from "@/components/MeasurementResultsDialog";

export default function ProductDetails() {
  const navigate = useNavigate();
  const { navigateBack } = useNavigation();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const { toast } = useToast();
  
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("white");
  const [quantity, setQuantity] = useState(1);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [photoCheckDialogOpen, setPhotoCheckDialogOpen] = useState(false);
  const { isAuthenticated, hasMeasurements, fromKiosk } = useAuth();
  const isMobile = useIsMobile();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [isVirtualDialogOpen, setIsVirtualDialogOpen] = useState(false);
  const [showComingSoonDialog, setShowComingSoonDialog] = useState(false);
  const [missingPhotos, setMissingPhotos] = useState({ front: false, side: false });
  const [mySizeRecs, setMySizeRecs] = useState<RecommendationResponse | null>(null);
  const [mySizeLoading, setMySizeLoading] = useState(false);
  const [measurementResultsOpen, setMeasurementResultsOpen] = useState(false);
  
  // Debug - force modal open for testing
  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log("Forcing modal open");
  //     setMeasurementResultsOpen(true);
  //   }, 2000);
  // }, []);
  const [isSavingMeasurements, setIsSavingMeasurements] = useState(false);

  // Fetch product data
  const { data: product, isLoading } = useProduct(productId || "");
  const { data: allProducts = [] } = useProducts();
  const { data: sizeChart, isLoading: sizeChartLoading } = useProductSizeChart(productId);
  const sizeRecommendation = useSizeRecommendation(sizeChart || null);
  const { data: productVariants, isLoading: variantsLoading } = useProductVariants(productId || "");
  const { profile, updateProfile } = useProfile();
  
  // Check if product is in wishlist on mount and when product changes
  useEffect(() => {
    if (product) {
      const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems") || "[]");
      const exists = wishlistItems.some((item: any) => item.id === product.product_id);
      setIsInWishlist(exists);
    }
  }, [product]);

  const convertSizeChartToApiFormat = (sizeChart: any): SizeChartMeasurement[] | undefined => {
    if (!sizeChart?.measurements) return undefined;
    
    return sizeChart.measurements.map((measurement: any) => ({
      size_label: measurement.size_label,
      chest_inches: measurement.chest_inches,
      waist_inches: measurement.waist_inches,
      shoulder_inches: measurement.shoulder_inches,
      hips_inches: measurement.hips_inches,
      length_inches: measurement.length_inches,
      inseam_inches: measurement.inseam_inches,
    }));
  };

  // Chart data for size visualization
  const sizeChartData = [
    { name: "Small", value: 25, fill: "#FFD188" },
    { name: "Medium", value: 50, fill: "#FF98D4" },
    { name: "Large", value: 75, fill: "#9BC7FD" },
  ];

  const handleBack = () => {
    navigateBack("/store");
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product-details?id=${productId}`);
  };

  // Loading handled inline to keep actions visible

  // If product not found, show placeholders; actions remain visible

  const handleAddToCart = () => {
    console.log('Add to cart clicked', { product, selectedSize, selectedColor, quantity });
    
    if (!product) {
      console.error('Product not found');
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      });
      return;
    }

    if (!selectedSize || !selectedColor) {
      toast({
        title: "Missing Selection",
        description: "Please select size and color",
        variant: "destructive",
      });
      return;
    }

    try {
      // Add to cart logic without navigation
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
      const newItem = {
        id: product.product_id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        color: selectedColor,
        quantity: quantity,
        image: product.image_url,
      };

      const existingItemIndex = cartItems.findIndex(
        (item: any) =>
          item.id === newItem.id &&
          item.size === selectedSize &&
          item.color === selectedColor
      );

      if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += quantity;
        toast({
          title: "Cart Updated",
          description: "Item quantity updated in cart!",
        });
      } else {
        cartItems.push(newItem);
        toast({
          title: "Added to Cart",
          description: "Item added to cart successfully!",
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      console.log('Cart updated successfully', cartItems);
      navigate("/cart");
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const handleBuyNowAndAddToCart = () => {
    console.log('Buy now clicked', { product, selectedSize, selectedColor, quantity });
    
    if (!product) {
      console.error('Product not found');
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      });
      return;
    }

    if (!selectedSize || !selectedColor) {
      toast({
        title: "Missing Selection",
        description: "Please select size and color",
        variant: "destructive",
      });
      return;
    }

    try {
      // Add to cart and navigate to cart
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
      const newItem = {
        id: product.product_id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        color: selectedColor,
        quantity: quantity,
        image: product.image_url,
      };

      const existingItemIndex = cartItems.findIndex(
        (item: any) =>
          item.id === newItem.id &&
          item.size === selectedSize &&
          item.color === selectedColor
      );

      if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        cartItems.push(newItem);
      }

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      console.log('Cart updated, navigating to cart', cartItems);
      navigate("/cart?back=product-details");
    } catch (error) {
      console.error('Error in buy now:', error);
      toast({
        title: "Error",
        description: "Failed to process purchase",
        variant: "destructive",
      });
    }
  };

  const handleBuyNow = () => {
    if (isAuthenticated) {
      handleBuyNowAndAddToCart();
    } else {
      if (isMobile) {
        navigate(`/sign-up?${createSearchParams({ back: "product-details" })}`);
      } else {
        navigate("/signup-options");
      }
    }
  };

  const handleTryVirtually = () => {
    setShowComingSoonDialog(true);
  };

  const handleJoinRoom = () => {
    navigate("/waiting-room");
  };

  const handleAddToWishlist = () => {
    // Check authentication first
    if (!isAuthenticated) {
      if (isMobile) {
        navigate(`/sign-up?${createSearchParams({ back: "product-details" })}`);
      } else {
        navigate("/signup-options");
      }
      return;
    }

    if (!product) return;
    
    const wishlistItems = JSON.parse(
      localStorage.getItem("wishlistItems") || "[]"
    );

    const existingIndex = wishlistItems.findIndex((item: any) => item.id === product.product_id);

    if (existingIndex > -1) {
      // Remove from wishlist
      wishlistItems.splice(existingIndex, 1);
      localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
      setIsInWishlist(false);
      toast({
        title: "Removed from Wishlist",
        description: "Item removed from your wishlist",
      });
    } else {
      // Add to wishlist
      const newItem = {
        id: product.product_id,
        name: product.name,
        price: product.price,
        image: product.image_url,
      };
      wishlistItems.push(newItem);
      localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
      setIsInWishlist(true);
      toast({
        title: "Added to Wishlist",
        description: "Item added to your wishlist successfully!",
      });
    }
  };

  const handleCompareSizeClick = async () => {
    // Check if user is logged in
    if (!isAuthenticated) {
      navigate(isMobile ? `/sign-up?${createSearchParams({ back: "product-details" })}` : "/signup-options");
      return;
    }

    // Check if profile exists
    if (!profile) {
      toast({
        title: "Profile not found",
        description: "Please complete your profile to use this feature.",
        variant: "destructive",
      });
      return;
    }

    // Check for saved measurements
    const hasSavedMeasurements = profile.chest_inches && profile.waist_inches;

    if (!hasSavedMeasurements) {
      // If no measurements, check for photos to offer calculation
      const hasPhotos = profile.photos && profile.photos.length >= 2;
      setMissingPhotos({ front: !profile.photos?.[0], side: !profile.photos?.[1] });
      setPhotoCheckDialogOpen(true); // This dialog now serves to prompt user to complete profile
      return;
    }

    // Show loading state
    setMySizeLoading(true);
    setMySizeRecs(null);

    try {
      const apiSizeChart = convertSizeChartToApiFormat(sizeChart);
      const category = product?.category?.name || "T-shirt";
      
      // Use the faster getSizeRecommendations API with saved measurements
      const result = await getSizeRecommendations(profile, apiSizeChart, category);
      
      // Debug log the API response
      console.log("API Response:", JSON.stringify(result, null, 2));
      
      // IMPORTANT: Create a direct reference to measurements to avoid null issues
      // First log the raw measurements from API
      console.log("Raw API measurements:", result.measurements);
      
      // Create a new object with explicitly converted number values
      const measurementsData = {
        height: Number(result.measurements.height),
        chest: Number(result.measurements.chest),
        waist: Number(result.measurements.waist),
        Butt: Number(result.measurements.Butt),
        shoulder_width: Number(result.measurements.shoulder_width),
        neck: Number(result.measurements.neck),
        inseam: Number(result.measurements.inseam),
        body_length: Number(result.measurements.body_length)
      };
      
      // Log the extracted and converted measurements
      console.log("Extracted measurements (after Number conversion):", measurementsData);
      
      // Store the results with guaranteed measurements
      setMySizeRecs({
        ...result,
        measurements: measurementsData
      });

      // Open the measurement results dialog - only showing measurements, not recommendations
      console.log("Opening measurement results dialog with measurements only");
      setMeasurementResultsOpen(true);

      // If we have recommendations, pre-select the best size
      if (result.recommendations && result.recommendations.length > 0) {
        const bestSize = result.recommended_size;
        if (bestSize) {
          setSelectedSize(bestSize);
          console.log("Setting selected size to:", bestSize);
        }
      }
    } catch (error) {
      console.error("Error getting 'My Size' recommendation:", error);
      toast({
        title: "Error",
        description: "Failed to get size recommendation.",
        variant: "destructive",
      });
    } finally {
      setMySizeLoading(false);
    }
  };
  
  // Handle saving measurements from the modal
  const handleSaveMeasurements = async () => {
    if (!profile || !mySizeRecs || !mySizeRecs.measurements) {
      console.error("Missing profile or measurements data");
      toast({
        title: "Error",
        description: "No measurements data available to save.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSavingMeasurements(true);
    
    try {
      const measurements = mySizeRecs.measurements;
      
      // Log the measurements being saved
      console.log("Saving measurements to profile:", measurements);
      
      // Convert all values to numbers to ensure they're valid
      const chest = Number(measurements.chest);
      const waist = Number(measurements.waist);
      const butt = Number(measurements.Butt);
      const shoulder = Number(measurements.shoulder_width);
      const neck = Number(measurements.neck);
      const inseam = Number(measurements.inseam);
      const bodyLength = Number(measurements.body_length);
      const height = Number(measurements.height);
      
      // Update profile with measurements from API response - use isNaN check to avoid invalid values
      const { error } = await updateProfile({
        chest_inches: !isNaN(chest) ? chest : null,
        waist_inches: !isNaN(waist) ? waist : null,
        hip_inches: !isNaN(butt) ? butt : null,
        shoulder_inches: !isNaN(shoulder) ? shoulder : null,
        neck_inches: !isNaN(neck) ? neck : null,
        inseam_inches: !isNaN(inseam) ? inseam : null,
        body_length_inches: !isNaN(bodyLength) ? bodyLength : null,
        height: !isNaN(height) ? height : null,
      });
      
      if (error) {
        throw new Error(error);
      }
      
      toast({
        title: "Success!",
        description: "Your measurements have been saved to your profile.",
      });
      
      // Close the modal
      setMeasurementResultsOpen(false);
    } catch (error) {
      console.error("Error saving measurements:", error);
      toast({
        title: "Error",
        description: "Failed to save measurements to your profile.",
        variant: "destructive",
      });
    } finally {
      setIsSavingMeasurements(false);
    }
  };

  const colors = product?.colors || [];
  const sizes = productVariants?.map(v => v.size).filter(Boolean) || [];

  return (
    <div className="bg-white flex lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen">
      {/* Header */}
      <Topbar handleBack={handleBack} />

      {/* Product Image */}
      <div className="relative bg-gradient-to-b from-pink-100 to-white h-[60vh] mx-4 mb-4 overflow-hidden">
        <img
          alt="Product"
          className="w-full h-full object-cover rounded-br-lg rounded-bl-lg"
          src={product?.image_url || "/placeholder.svg"}
        />
        <button
          onClick={handleAddToWishlist}
          disabled={!product}
          className="absolute top-4 right-4 p-2 bg-white bg-opacity-80 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-all"
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${
              isInWishlist 
                ? "fill-red-500 text-red-500" 
                : "text-gray-600"
            }`} 
          />
        </button>

      </div>

      {/* Product Info */}
      <div className="px-4">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          {product?.name || "Loading..."}
        </h1>
        <div className="flex items-center space-x-2 mb-4">
          {product && <span className="text-3xl font-semibold text-gray-900">${product.price}</span>}
        </div>
      </div>

      <div className="flex justify-between">
        {/* Size Selection */}
        <div className="px-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-medium text-gray-900">Sizes:</span>
            {sizeChart && (
              <button
                onClick={() => setSizeChartOpen(true)}
                className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
              >
                <Ruler className="w-4 h-4" />
                <span>Size Guide</span>
              </button>
            )}
            <Button
              onClick={handleCompareSizeClick}
              variant="outline"
              size="sm"
              className="ml-auto py-1 px-3 rounded-lg border-purple-300 text-purple-600 hover:bg-purple-50 hover:text-purple-700 font-medium text-sm"
            >
              <UserPen className="w-3 h-3 mr-1" />
              Compare Your Size
            </Button>
          </div>
          <div className="flex space-x-3">
            {variantsLoading ? (
              <div className="text-sm text-gray-500">Loading sizes...</div>
            ) : sizes.length === 0 ? (
              <div className="text-sm text-gray-500">No sizes available</div>
            ) : (
              sizes.map((size) => {
                const variant = productVariants?.find(v => v.size === size);
                const inStock = variant && variant.stock_quantity > 0;
                const lowStock = variant && variant.stock_quantity > 0 && variant.stock_quantity <= 5;
                
                return (
                  <button
                    key={size}
                    onClick={() => inStock && setSelectedSize(size)}
                    disabled={!inStock}
                    className={`text-sm w-8 h-8 rounded-md border border-gray-300 relative ${
                      selectedSize === size ? "ring-2 ring-purple-500" : 
                      sizeRecommendation.bestFit?.size === size ? "ring-2 ring-orange-400" : ""
                    } ${
                      !inStock ? "opacity-40 cursor-not-allowed line-through" : ""
                    }`}
                    title={!inStock ? "Out of stock" : lowStock ? `Only ${variant.stock_quantity} left` : `${variant?.stock_quantity} in stock`}
                  >
                    {size}
                  </button>
                );
              })
            )}
          </div>

          {/* Color Selection */}
          <div className="mt-4">
            <span className="font-medium text-gray-900 mb-3 block">Color:</span>
            <div className="flex space-x-3">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-8 h-8 rounded ${color.bgClass} ${
                    selectedColor === color.name ? "ring-2 ring-purple-500" : ""
                  }`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Profile Completion Dialog */}
      <Dialog open={photoCheckDialogOpen} onOpenChange={setPhotoCheckDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-purple-600" />
              Complete Your Profile for Size Recommendation
            </DialogTitle>
            <DialogDescription>
              To get your recommended size, first calculate your measurements from your profile page using your photos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Profile Status:</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  {missingPhotos.front ? (
                    <X className="w-4 h-4 text-red-500" />
                  ) : (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                  <span className={missingPhotos.front ? "text-red-600 font-medium" : "text-green-600"}>
                    Front view photo {missingPhotos.front ? "(Missing)" : "(Uploaded)"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  {missingPhotos.side ? (
                    <X className="w-4 h-4 text-red-500" />
                  ) : (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                  <span className={missingPhotos.side ? "text-red-600 font-medium" : "text-green-600"}>
                    Side view photo {missingPhotos.side ? "(Missing)" : "(Uploaded)"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  {profile?.chest_inches ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                  <span className={profile?.chest_inches ? "text-green-600" : "text-red-600 font-medium"}>
                    AI Measurements {profile?.chest_inches ? "(Calculated)" : "(Not Calculated)"}
                  </span>
                </li>
              </ul>
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              Please go to your profile, upload your photos, and use the "Calculate My Size with AI" feature.
            </p>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPhotoCheckDialogOpen(false)}
                className="flex-1"
              >
                Maybe Later
              </Button>
              <Button
                onClick={() => {
                  setPhotoCheckDialogOpen(false);
                  navigate('/update-profile');
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Complete Profile
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quantity Selection */}
      <div className="px-4 mb-4">
        <span className="font-medium text-gray-900 mb-3 block">Quantity:</span>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-lg font-medium min-w-[2rem] text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recommendation Section */}
      {isAuthenticated && (
        <div className="px-4 mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <span className="font-medium text-gray-900">Recommendation</span>
            <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-600">i</span>
            </div>
          </div>

          <div className="bg-gradient-to-t from-[#F1E8FF] to-[#EBE1FD] rounded-2xl p-6 mb-4">
            <h3 className="font-semibold text-gray-900 mb-1 text-2xl flex justify-between">
              <span>My Size</span>
              <UserPen />
            </h3>
            <p className="text-sm text-gray-600">
              Tailored to match your exact measurements
            </p>

            {mySizeLoading ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                <div className="text-center">
                  <p className="text-gray-700 font-medium">Finding your best fit...</p>
                  <p className="text-xs text-gray-500 mt-1">Analyzing your measurements with AI</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <div className="w-72 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="20%"
                        outerRadius="80%"
                        data={sizeChartData}
                      >
                        <RadialBar dataKey="value" cornerRadius={4} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Size Options */}
                <div className="flex justify-between text-left mb-4">
                  <div className="text-xs">
                    <div className="w-6 h-6 rounded-md mb-1 bg-[#9BC7FD]"></div>
                    <div className="text-sm">Large size</div>
                    <div className="text-gray-800 text-lg">(XL,XXL)</div>
                  </div>
                  <div className="text-xs">
                    <div className="w-6 h-6 rounded-md mb-1 bg-[#FF98D4]"></div>
                    <div className="text-sm">Medium size</div>
                    <div className="text-gray-800 text-lg">(M)</div>
                  </div>
                  <div className="text-xs">
                    <div className="w-6 h-6 rounded-md mb-1 bg-[#FFD188]"></div>
                    <div className="text-sm">Small size</div>
                    <div className="text-gray-800 text-lg">(S)</div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-4 ml-2">
                  *95% users said true to size
                </p>

                <Button
                  onClick={handleCompareSizeClick}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 rounded-xl font-medium mt-6 mb-4"
                >
                  Find My Size
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="bg-gray-100 w-full h-2 my-4"></div>

      {/* Product Information */}
      <Accordion type="single" collapsible className="px-4 mb-6">
        <AccordionItem value="know-product">
          <AccordionTrigger className="text-md font-bold text-gray-800">
            Know Your Product
          </AccordionTrigger>
          <AccordionContent className="text-sm text-gray-600">
            {product?.description || "No description available"}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mb-48"></div>

      {/* Bottom Action */}
      <div className="fixed bottom-[64px] left-0 w-full lg:max-w-sm lg:left-1/2 lg:-translate-x-1/2 z-[60]">
        <div className="px-4 py-3 bg-white border-t border-gray-100">
            <div className="flex gap-2 mb-2">
              <Button
                onClick={handleTryVirtually}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800"
              >
                Try Virtually
              </Button>
              <Button
                onClick={() => setIsRoomDialogOpen(true)}
                className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800"
              >
                Join Room
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleBuyNow}
                className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800"
              >
                Buy Now
              </Button>
              <Button
                onClick={handleAddToCart}
                variant="outline"
                size="icon"
                className="border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 h-auto w-12 py-3"
              >
                <ShoppingCart className="w-5 h-5" />
              </Button>
            </div>
          </div>
      </div>

      {/* Size Chart Dialog */}
      <SizeChartDialog
        open={sizeChartOpen}
        onOpenChange={setSizeChartOpen}
        sizeChart={sizeChart || null}
        isLoading={sizeChartLoading}
      />

      {/* Room Join Dialog */}
      <RoomJoinDialog
        isJoinDialogOpen={isRoomDialogOpen}
        isVirtualDialogOpen={isVirtualDialogOpen}
        onClose={() => setIsRoomDialogOpen(false)}
      />

      <AlertDialog open={showComingSoonDialog} onOpenChange={setShowComingSoonDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Coming Soon</AlertDialogTitle>
            <AlertDialogDescription>
              Virtual try-on feature will be available soon. Stay tuned!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowComingSoonDialog(false)}>
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNavigation />
      
      {/* Measurement Results Dialog - Only showing measurements */}
      <MeasurementResultsDialog
        isOpen={measurementResultsOpen}
        onClose={() => {
          console.log("Dialog closed by user");
          setMeasurementResultsOpen(false);
        }}
        onSave={handleSaveMeasurements}
        measurements={mySizeRecs || null}
        isSaving={isSavingMeasurements}
        recommendedSize={null}
        fitScore={null}
        alternativeSizes={null}
      />
    </div>
  );
}
