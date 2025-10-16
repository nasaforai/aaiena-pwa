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
  RefreshCw,
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
  
  // Debug - force size recommendation to show for testing
  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log("Forcing size recommendation");
  //     handleCompareSizeClick();
  //   }, 2000);
  // }, []);
  const [isSavingMeasurements, setIsSavingMeasurements] = useState(false);

  // Fetch product data
  const { data: product, isLoading } = useProduct(productId || "");
  const { data: allProducts = [] } = useProducts();
  const { data: sizeChart, isLoading: sizeChartLoading } = useProductSizeChart(productId);
  const sizeRecommendation = useSizeRecommendation(sizeChart || null);
  const { data: productVariants, isLoading: variantsLoading } = useProductVariants(productId || "");
  const { profile, updateProfile, refetch: refetchProfile } = useProfile();
  
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
      
      // If API doesn't return a recommendation, calculate our own
      const processedResult = { ...result };
      
      if (!processedResult.recommended_size && processedResult.measurements && apiSizeChart) {
        console.log("API didn't return a recommendation, calculating based on measurements");
        
        // Get user measurements
        const userChest = processedResult.measurements.chest || 0;
        const userWaist = processedResult.measurements.waist || 0;
        const userShoulder = processedResult.measurements.shoulder || 0;
        
        console.log("User measurements:", { userChest, userWaist, userShoulder });
        console.log("Size chart:", apiSizeChart);
        
        // Find the best matching size
        let bestSize = "M"; // Default fallback
        let bestScore = 0;
        const alternativeSizes = {};
        
        // Calculate fit score for each size in the size chart
        apiSizeChart.forEach(size => {
          // Calculate how well the size fits (lower difference = better fit)
          // For chest: ideal is when garment is 1-2 inches larger than body
          const idealChestDiff = 1.5; // Ideal extra room for chest
          const chestDiff = Math.abs(((size.chest_inches || 0) - userChest) - idealChestDiff);
          
          // For waist: ideal is when garment is 1-2 inches larger than body
          const idealWaistDiff = 1.5; // Ideal extra room for waist
          const waistDiff = Math.abs(((size.waist_inches || 0) - userWaist) - idealWaistDiff);
          
          // For shoulder: ideal is when garment matches body closely
          const idealShoulderDiff = 0.5; // Shoulder should be close to body measurement
          const shoulderDiff = Math.abs(((size.shoulder_inches || 0) - userShoulder) - idealShoulderDiff);
          
          // Weight the differences (chest and shoulders are more important than waist for tops)
          const weightedDiff = (chestDiff * 0.4) + (waistDiff * 0.3) + (shoulderDiff * 0.3);
          
          // Convert to a 0-10 scale (lower diff = higher score)
          const score = Math.max(0, 10 - (weightedDiff * 2));
          
          console.log(`Size ${size.size_label}: score ${score.toFixed(2)} (chest diff: ${chestDiff.toFixed(2)}, waist diff: ${waistDiff.toFixed(2)}, shoulder diff: ${shoulderDiff.toFixed(2)})`);
          
          // Track all sizes
          alternativeSizes[size.size_label] = parseFloat(score.toFixed(2));
          
          // Update best size if this one has a better score
          if (score > bestScore) {
            bestScore = score;
            bestSize = size.size_label;
          }
        });
        
        // Update the result with our calculated recommendation
        processedResult.recommended_size = bestSize;
        processedResult.fit_score = parseFloat(bestScore.toFixed(2));
        
        // Create alternative sizes object without the best size
        const altSizes = { ...alternativeSizes };
        delete altSizes[bestSize]; // Remove best size from alternatives
        processedResult.alternative_sizes = altSizes;
        
        console.log("Calculated recommendation:", processedResult.recommended_size, "with score:", processedResult.fit_score);
        console.log("Alternative sizes:", processedResult.alternative_sizes);
      }
      
      // Store the processed result object
      setMySizeRecs(processedResult);

      // If we have recommendations, pre-select the best size
      if (result.recommended_size) {
        setSelectedSize(result.recommended_size);
        console.log("Setting selected size to:", result.recommended_size);
      }

      // Show success message
      toast({
        title: "Size Recommendation Ready",
        description: `Your recommended size is ${result.recommended_size || 'M'}`,
      });

      // Scroll to the recommendation section
      const recommendationSection = document.getElementById("recommendation-section");
      if (recommendationSection) {
        recommendationSection.scrollIntoView({ behavior: "smooth" });
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
      const shoulder = Number(measurements.shoulder);
      const neck = Number(measurements.neck);
      const inseam = Number(measurements.inseam);
      const bodyLength = Number(measurements.body_length);
      const height = Number(measurements.height);
      
      // Create update object with proper validation
      const updateData = {
        // Save to both the standard fields and the _inches fields for compatibility
        chest: !isNaN(chest) ? chest : null,
        chest_inches: !isNaN(chest) ? chest : null,
        waist: !isNaN(waist) ? waist : null,
        waist_inches: !isNaN(waist) ? waist : null,
        hip_inches: !isNaN(butt) ? butt : null,
        shoulder_inches: !isNaN(shoulder) ? shoulder : null,
        neck_inches: !isNaN(neck) ? neck : null,
        inseam_inches: !isNaN(inseam) ? inseam : null,
        body_length_inches: !isNaN(bodyLength) ? bodyLength : null,
        height: !isNaN(height) ? height : null,
      };
      
      // Log the exact data being sent to updateProfile
      console.log("Sending to updateProfile:", updateData);
      
      // Update profile with measurements from API response
      const { data, error } = await updateProfile(updateData);
      
      // Log the response from updateProfile
      console.log("updateProfile response:", { data, error });
      
      if (error) {
        throw new Error(error);
      }
      
      // Explicitly refetch profile data to ensure UI is updated
      await refetchProfile();
      
      toast({
        title: "Success!",
        description: "Your measurements have been saved to your profile.",
      });
      
      // No modal to close anymore
      
      // Ask user if they want to view their profile
      const viewProfile = window.confirm("Measurements saved successfully! Would you like to view your profile now?");
      if (viewProfile) {
        navigate("/profile");
      }
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
        <div id="recommendation-section" className="px-4 mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <span className="font-medium text-gray-900">Recommendation</span>
            <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-600">i</span>
            </div>
          </div>

          <div className="bg-[#F8F5FF] rounded-2xl p-6 mb-4">
            <h3 className="font-semibold text-[#2D0C57] mb-1 text-2xl flex justify-between">
              <span>My Size</span>
              <UserPen className="text-gray-700" />
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
                  <div className="w-full h-64 relative mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="30%"
                        outerRadius="90%"
                        data={[
                          { 
                            name: 'Large', 
                            value: 100, 
                            fill: '#9BC7FD'
                          },
                          { 
                            name: 'Medium', 
                            value: 75, 
                            fill: '#FF98D4'
                          },
                          { 
                            name: 'Small', 
                            value: 50, 
                            fill: '#FFD188'
                          },
                        ]}
                        startAngle={180}
                        endAngle={-180}
                      >
                        <RadialBar 
                          dataKey="value" 
                          cornerRadius={10}
                          background
                        />
                        <text
                          x="50%"
                          y="50%"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-lg font-medium"
                          fill="#333"
                        >
                          Sizes
                        </text>
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Size Categories */}
                <div className="flex justify-between text-left mb-6">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-md mb-1 bg-[#9BC7FD] mx-auto"></div>
                    <div className="text-sm text-gray-700">Large size</div>
                    <div className="text-gray-800 text-sm">(X,XL,XXL)</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-md mb-1 bg-[#FF98D4] mx-auto"></div>
                    <div className="text-sm text-gray-700">Medium size</div>
                    <div className="text-gray-800 text-sm">(M)</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-md mb-1 bg-[#FFD188] mx-auto"></div>
                    <div className="text-sm text-gray-700">Small size</div>
                    <div className="text-gray-800 text-sm">(S)</div>
                  </div>
                </div>

                {/* Best Fit */}
                <div className="bg-[#F3EFFF] rounded-xl p-4 mb-4">
                  <div className="font-medium text-[#2D0C57] mb-1">Best Fit: {
                    mySizeRecs?.recommended_size === "XL" || mySizeRecs?.recommended_size === "XXL" || mySizeRecs?.recommended_size === "L" ? "Large Size" : 
                    mySizeRecs?.recommended_size === "M" ? "Medium Size" : "Small Size"
                  }</div>
                  <p className="text-sm text-[#2D0C57]">
                    We recommend {
                      mySizeRecs?.recommended_size === "XL" || mySizeRecs?.recommended_size === "XXL" || mySizeRecs?.recommended_size === "L" ? 
                        `Large "${mySizeRecs?.recommended_size}"` : 
                      mySizeRecs?.recommended_size === "M" ? 'Medium "M"' : 'Small "S"'
                    } as the best fit for you—it offers a comfortable and well-balanced look.
                  </p>
                </div>

                {/* Alternative Sizes */}
                {mySizeRecs?.alternative_sizes && Object.keys(mySizeRecs.alternative_sizes).length > 0 && (
                  <div className="space-y-3 mb-4">
                    {Object.entries(mySizeRecs.alternative_sizes).map(([size, score], index) => {
                      // Size labels for categorization and comparison
                      const sizeLabels = ["XS", "S", "M", "L", "XL", "XXL", "EL", "KL"]; // Common size progression
                      const sizeIndex = sizeLabels.indexOf(size);
                      
                      // Properly categorize sizes
                      let sizeCategory;
                      if (sizeIndex <= 1) { // XS, S
                        sizeCategory = "Small Size";
                      } else if (sizeIndex === 2) { // M
                        sizeCategory = "Medium Size";
                      } else { // L, XL, XXL, EL, KL and any others
                        sizeCategory = "Large Size";
                      }
                      
                      const scoreNum = typeof score === 'number' ? score : Number(score);
                      
                      // Determine if the size is larger or smaller than recommended
                      const recommendedSizeLabel = mySizeRecs?.recommended_size || "M";
                      
                      // Find indices to determine if this size is larger or smaller
                      const recIndex = sizeLabels.indexOf(recommendedSizeLabel);
                      const thisIndex = sizeLabels.indexOf(size);
                      
                      let fitType = "similar";
                      if (recIndex !== -1 && thisIndex !== -1) {
                        fitType = thisIndex > recIndex ? "looser" : (thisIndex < recIndex ? "tighter" : "similar");
                      }
                      
                      let fitDescription = "";
                      
                      // Calculate how much larger/smaller this size is compared to recommended
                      const sizeDifference = Math.abs(thisIndex - recIndex);
                      
                      if (fitType === "similar" || sizeDifference === 0) {
                        fitDescription = "Provides a very similar fit to the recommended size";
                      } else if (fitType === "tighter") {
                        if (sizeDifference === 1) {
                          fitDescription = "Slightly tighter fit. Good if you prefer a more fitted look";
                        } else if (sizeDifference === 2) {
                          fitDescription = "Noticeably tighter fit. Best for those who prefer slim-fitting clothes";
                        } else {
                          fitDescription = "Significantly tighter fit. May be too constrictive for comfort";
                        }
                      } else if (fitType === "looser") {
                        if (sizeDifference === 1) {
                          fitDescription = "Slightly looser fit. Good if you prefer a more relaxed look";
                        } else if (sizeDifference === 2) {
                          fitDescription = "Noticeably looser fit. Best for those who prefer relaxed-fitting clothes";
                        } else {
                          fitDescription = "Significantly looser fit. May appear oversized on your frame";
                        }
                      } else {
                        // Fallback based on score if we can't determine relative size
                        if (scoreNum >= 8) {
                          fitDescription = "Also an excellent fit for your body shape";
                        } else if (scoreNum >= 6) {
                          fitDescription = "Good alternative—provides a comfortable fit";
                        } else if (scoreNum >= 4) {
                          fitDescription = "Average fit for your measurements";
                        } else if (scoreNum >= 2) {
                          fitDescription = "Not ideal for your body shape";
                        } else {
                          fitDescription = "Not recommended for your body shape";
                        }
                      }
                      
                      return (
                        <div key={size} className="bg-white border border-gray-200 rounded-xl p-4">
                          <div className="font-medium text-[#2D0C57] mb-1">Other Fit: <span className="text-[#6A3CA5]">{sizeCategory}</span></div>
                          <p className="text-sm text-[#2D0C57]">
                            {size} {fitType === "tighter" ? "will be tighter" : fitType === "looser" ? "will be looser" : "provides a similar fit"} than recommended—{fitDescription}.
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-4 ml-2">
                  *95% users said true to size
                </p>

                <Button
                  onClick={handleCompareSizeClick}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 rounded-xl font-medium mt-6 mb-4"
                >
                  {mySizeRecs ? "Recalculate My Size" : "Compare My Size"}
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
                className="flex-1 bg-[#18002A] text-white py-3 rounded-lg font-medium hover:bg-[#2D0C57]"
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
    </div>
  );
}
