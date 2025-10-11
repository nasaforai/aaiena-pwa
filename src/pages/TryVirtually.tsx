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
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { useProducts, useProduct } from "@/hooks/useProducts";
import { useProfile } from "@/hooks/useProfile";
import { useProductSizeChart } from "@/hooks/useProductSizeChart";
import { getSizeRecommendations, SizeRecommendation as ApiSizeRecommendation, checkApiHealth, tryVirtually } from "@/lib/sizingApi";
import { useToast } from "@/hooks/use-toast";

export default function TryVirtually() {
  const navigate = useNavigate();
  const { navigateBack } = useNavigation();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("white");
  const [quantity, setQuantity] = useState(1);
  const [apiRecommendations, setApiRecommendations] = useState<ApiSizeRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(false);
  
  // Use actual Supabase auth state instead of localStorage
  const { data: allProducts = [] } = useProducts();
  const { data: product, isLoading: productLoading } = useProduct(productId || "");
  const { profile } = useProfile();
  const { data: sizeChart, isLoading: sizeChartLoading } = useProductSizeChart(productId);
  
  // Check real authentication state
  const isLoggedIn = !!profile; // User is logged in if profile exists
  const hasMeasurements = !!(profile && (
    profile.chest_inches || 
    profile.waist_inches || 
    profile.shoulder_inches || 
    profile.hip_inches ||
    profile.height
  )); // User has measurements if any measurement field exists
  
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Get size recommendations from API when component loads
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!profile || !isLoggedIn || !hasMeasurements) {
        return;
      }

      setLoading(true);
      
      // Check if API is available
      const isApiHealthy = await checkApiHealth();
      setApiAvailable(isApiHealthy);
      
      if (!isApiHealthy) {
        setLoading(false);
        return;
      }

      try {
        const response = await tryVirtually(
          profile,
          'T-shirt' // Default category - could be dynamic based on product
        );
        
        setApiRecommendations(response.recommendations);
        
        // Set the best recommended size as selected
        if (response.recommendations.length > 0) {
          const bestRecommendation = response.recommendations.reduce((best, current) => 
            current.score > best.score ? current : best
          );
          setSelectedSize(bestRecommendation.size);
        }
      } catch (error) {
        console.error('Failed to get size recommendations:', error);
        toast({
          title: "Recommendation Error",
          description: "Failed to get size recommendations. Using default sizes.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [profile, sizeChart, isLoggedIn, hasMeasurements, toast]);

  // Chart data for size visualization - updated with API data if available
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

  const handleAddToCart = () => {
    if (!product) {
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      });
      return;
    }

    // Add to cart logic
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const newItem = {
      id: product.product_id,
      name: product.name,
      price: product.price,
      originalPrice: product.is_on_offer ? Math.round(product.price * 1.4) : undefined,
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
    navigate(`/cart?back=try-virtually&id=${productId}`);
  };

  const handleBuyNow = () => {
    if (isLoggedIn) {
      handleAddToCart();
    } else {
      // Device-aware navigation - mobile users go to sign-up, kiosk users go to signup-options
      navigate(isMobile ? "/sign-up" : "/signup-options");
    }
  };

  const handleJoinRoom = () => {
    navigate("/waiting-room");
  };

  const handleAddToWishlist = () => {
    if (!product) {
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      });
      return;
    }

    const wishlistItems = JSON.parse(
      localStorage.getItem("wishlistItems") || "[]"
    );
    const newItem = {
      id: product.product_id,
      name: product.name,
      price: product.price,
      originalPrice: product.is_on_offer ? Math.round(product.price * 1.4) : undefined,
      image: product.image_url,
    };

    const exists = wishlistItems.some((item: any) => item.id === newItem.id);
    if (!exists) {
      wishlistItems.push(newItem);
      localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
      toast({
        title: "Added to Wishlist",
        description: "Item added to your wishlist successfully!",
      });
    } else {
      toast({
        title: "Already in Wishlist",
        description: "This item is already in your wishlist.",
      });
    }
  };

  const colors = [
    { name: "white", bg: "bg-white border-2 border-gray-300" },
    { name: "green", bg: "bg-green-300" },
    { name: "yellow", bg: "bg-yellow-300" },
    { name: "pink", bg: "bg-pink-300" },
  ];

  const sizes = ["XS", "S", "M", "L", "XL"];

  return (
    <div className="bg-white flex lg:lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen">
      {/* Header */}
      <Topbar handleBack={handleBack} />

      {/* Product Image */}
      <div className="relative bg-gradient-to-b from-pink-100 to-white min-h-[10vh] mx-4 mb-4 overflow-hidden">
        <img
          alt="Product"
          className="w-full h-full object-cover rounded-br-lg rounded-bl-lg py-4"
          src={product?.image_url || "/images/3d.png"}
        />
        <button
          onClick={handleAddToWishlist}
          className="absolute top-4 right-4 p-2 bg-white bg-opacity-80 rounded-full"
        >
          <Heart className="w-5 h-5 text-gray-600" />
        </button>

        {isLoggedIn && product && (
          <div className="absolute left-0 bottom-0 w-full p-3">
            <div className="bg-white/80 flex items-center justify-between p-4 rounded-xl">
              <div>
                <p className="text-sm max-w-40">
                  {product.name}
                </p>
              </div>
              <div className="flex flex-col justify-center">
                <div className="text-xs flex flex-nowrap gap-1 items-center">
                  {/* Show original price if on offer */}
                  {product.is_on_offer && (
                    <span className="text-gray-400 line-through">₹{Math.round(product.price * 1.4)}</span>
                  )}
                  <span className="text-lg">₹{product.price}</span>
                  <span className="text-gray-400">50% off</span>
                </div>
                <button
                  className="bg-[#12002C] hover:bg-black/80 rounded-md text-white text-sm px-5 py-1"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-4">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          {product?.name || "Drop-Shoulder Cotton Tee | Relaxed Fit, All-Day Comfort."}
        </h1>
        <div className="flex items-center space-x-2 mb-4">
          {product?.is_on_offer && (
            <span className="text-md text-gray-500 line-through">₹{Math.round((product.price || 700) * 1.4)}</span>
          )}
          <span className="text-3xl font-semibold text-gray-900">₹{product?.price || 700}</span>
          {product?.is_on_offer && (
            <span className="text-sm text-green-600 font-medium">30% OFF</span>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        {/* Size Selection */}
        <div className="px-4 mb-4">
          <span className="font-medium text-gray-900 mb-3 block">Sizes:</span>
          <div className="flex space-x-3">
            {(product?.sizes || sizes).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`text-sm w-8 h-8 rounded-md border border-gray-300 ${
                  selectedSize === size ? "ring-2 ring-purple-500" : ""
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="px-4 mb-4">
          <span className="font-medium text-gray-900 mb-3 block">Color:</span>
          <div className="flex space-x-3">
            {(product?.colors || colors).map((color) => (
              <button
                key={typeof color === 'string' ? color : color.name}
                onClick={() => setSelectedColor(typeof color === 'string' ? color : color.name)}
                className={`w-8 h-8 rounded ${
                  typeof color === 'string' 
                    ? color === 'white' 
                      ? 'bg-white border-2 border-gray-300' 
                      : `bg-${color}-300`
                    : color.bgClass
                } ${
                  selectedColor === (typeof color === 'string' ? color : color.name) ? "ring-2 ring-purple-500" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recommendation Section */}
      {isLoggedIn && (
        <div className="px-4 mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <span className="font-medium text-gray-900">Recommendation</span>
            <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-600">i</span>
            </div>
          </div>

          {/* Size Chart */}
          {isLoggedIn && (
            <div className="bg-gradient-to-t from-[#F1E8FF] to-[#EBE1FD] rounded-2xl p-6 mb-4">
              <h3 className="font-semibold text-gray-900 mb-1 text-2xl flex justify-between">
                <span> My Size</span>
                <UserPen />
              </h3>
              <p className="text-sm text-gray-600">
                Tailored to match your exact measurements
              </p>

              {/* API Status Notice */}
              {!apiAvailable && isLoggedIn && hasMeasurements && (
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mt-3 mb-3">
                  <p className="text-xs text-yellow-800">
                    📡 Advanced sizing API not available. Using standard size recommendations.
                  </p>
                </div>
              )}
              
              {apiAvailable && isLoggedIn && hasMeasurements && (
                <div className="bg-green-100 border border-green-300 rounded-lg p-3 mt-3 mb-3">
                  <p className="text-xs text-green-800">
                    ✅ AI-powered size recommendations active
                  </p>
                </div>
              )}

              {/* Radial Chart */}
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

              {/* Loading State */}
              {loading && (
                <div className="bg-purple-100 rounded-xl p-4 mb-4 mt-10">
                  <div className="flex items-center justify-center">
                    <span className="text-gray-600">Getting your size recommendations...</span>
                  </div>
                </div>
              )}

              {/* Best Fit - API Results */}
              {!loading && apiRecommendations.length > 0 && (
                <>
                  <div className="bg-purple-200 rounded-xl p-4 mb-4 mt-10">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">
                        <span className="font-medium">Best Fit:</span>
                        <span className="bg-orange-200 px-2 py-1 ml-1 rounded-md font-light text-sm">
                          {apiRecommendations[0]?.size || 'Large'} Size
                        </span>
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {apiRecommendations[0]?.rating === 'Perfect' 
                        ? `We recommend ${apiRecommendations[0]?.size} as the perfect fit for you—it offers optimal comfort and style.`
                        : `We recommend ${apiRecommendations[0]?.size} as the best fit for you—it offers a comfortable and well-balanced look.`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Confidence Score: {Math.round((apiRecommendations[0]?.score || 0) * 10)}%
                    </p>
                  </div>

                  {apiRecommendations.length > 1 && (
                    <div className="bg-white rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900">
                          <span className="font-medium">Alternative Fit:</span>
                          <span className="bg-purple-200 px-2 py-1 ml-1 rounded-md font-light text-sm">
                            {apiRecommendations[1]?.size} Size
                          </span>
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        {apiRecommendations[1]?.rating === 'Tight' 
                          ? `${apiRecommendations[1]?.size} could feel a bit snug. Great if you like tighter-fitting clothes.`
                          : `${apiRecommendations[1]?.size} as an alternative fit option for you.`}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Confidence Score: {Math.round((apiRecommendations[1]?.score || 0) * 10)}%
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Fallback for no API data */}
              {!loading && apiRecommendations.length === 0 && (
                <>
                  <div className="bg-purple-200 rounded-xl p-4 mb-4 mt-10">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">
                        <span className="font-medium">Best Fit:</span>
                        <span className="bg-orange-200 px-2 py-1 ml-1 rounded-md font-light text-sm">
                          Large Size
                        </span>
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      We recommend Large "L" as the best fit for you—it offers a
                      comfortable and well-balanced look.
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">
                        <span className="font-medium">Other Fit:</span>
                        <span className="bg-purple-200 px-2 py-1 ml-1 rounded-md font-light text-sm">
                          Medium Size
                        </span>
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Medium as the right fit for you—it could feel a bit snug.
                      Great if you like tighter-fitting clothes.
                    </p>
                  </div>
                </>
              )}

              <p className="text-xs text-gray-500 mt-4 ml-2">
                *95% users said true to size
              </p>

              <Button 
                onClick={() => {
                  toast({
                    title: "Virtual Try-On",
                    description: `Virtually trying on size ${selectedSize}. This feature uses your measurements for the best fit!`,
                  });
                }}
                className="w-full bg-gray-900 text-white py-6 rounded-xl font-medium mt-6 mb-4"
              >
                Try Size {selectedSize} Now
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="bg-gray-100 w-full h-2 my-4"></div>

      {/* Product Information */}
      <p className="text-md text-gray-800 mb-6 px-4">Product Information</p>
      <div className="px-4 space-y-4 mb-6">
        <div className="border-b border-gray-200 pb-3">
          <button className="flex justify-between items-center w-full">
            <span className="text-sm text-gray-800">PRODUCT DETAILS</span>
            <ChevronDown className="text-gray-400 h-5" />
          </button>
        </div>
        <div className="border-b border-gray-200 pb-3">
          <button className="flex justify-between items-center w-full">
            <span className="text-sm text-gray-800">KNOW YOUR PRODUCT</span>
            <ChevronDown className="text-gray-400 h-5" />
          </button>
        </div>
      </div>

      {/* Try Another Button */}
      {isLoggedIn && (
        <div className="px-4 mb-6">
          <Button
            variant="outline"
            className="w-full py-6 rounded-xl font-medium border-gray-500"
          >
            Try Another
          </Button>
        </div>
      )}

      <div className="bg-gray-100 w-full h-2 my-4"></div>

      {/* Find Similar */}
      <div className="mb-6 px-4">
        <h3 className="font-semibold text-lg mb-3">Find Similar</h3>
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {allProducts.slice(0, 4).map((product) => (
              <CarouselItem key={product.product_id} className="pl-2 md:pl-4 basis-1/2">
                <ProductCard
                  product={product}
                  handleProductClick={handleProductClick}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselDots />
        </Carousel>
      </div>

      {!hasMeasurements && (
        <div className="py-10 mb-6 flex flex-col items-center justify-center bg-yellow-300">
          <img
            src="/icons/tShirt.svg"
            alt="dress icon"
            height={24}
            width={24}
            className="mb-1"
          />
          <p className="text-xl">Struggling to spot your fit?</p>
          <button className="flex shadow-sm bg-white items-center rounded-md pl-10 pr-8 py-2 mt-4">
            <span>Set your profile</span>
            <ArrowRight className="h-4 ml-1" />
          </button>
        </div>
      )}

      {/* You might also like */}
      <div className="mb-48 px-4">
        <h3 className="font-semibold text-lg mb-3">You might also like</h3>
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {allProducts.slice(4, 8).map((product) => (
              <CarouselItem key={product.product_id} className="pl-2 md:pl-4 basis-1/2">
                <ProductCard
                  product={product}
                  handleProductClick={handleProductClick}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselDots />
        </Carousel>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 w-full lg:lg:max-w-sm lg:left-1/2 lg:-translate-x-1/2">
        <div className="shadow-xl">
          {!isMobile && (
            <div className="bg-purple-200 rounded-tr-2xl rounded-tl-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <UsersRound className="w-5" />
                    <span className="text-md font-semibold text-gray-700">
                      Moderate
                    </span>
                  </div>
                  <button
                    className="text-xs text-white bg-purple-400 font-medium px-4 py-2 rounded-md"
                    onClick={handleJoinRoom}
                  >
                    JOIN ROOM
                  </button>
                </div>
                <div className="flex flex-col space-y-2">
                  <p>JOIN EMPTY ROOMS:</p>
                  <div className="flex space-x-2">
                    <span className="bg-purple-50 shadow-md py-2 px-4 rounded text-md">
                      2A
                    </span>
                    <span className="bg-purple-50 shadow-md py-2 px-4 rounded text-md">
                      3C
                    </span>
                    <span className="bg-purple-50 shadow-md py-2 px-4 rounded text-md">
                      2B
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="px-4 py-2 bg-white shadow-md flex gap-4">
            <Button
              onClick={handleBuyNow}
              className="px-6 flex-1  bg-gray-900 text-white py-3 rounded-lg font-medium"
            >
              Buy Now
            </Button>

            {/* <Button
              onClick={handleBuyNow}
              className="flex-1 px-6 bg-gray-900 text-white py-3 rounded-lg font-medium"
            >
              Try Virtually
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
