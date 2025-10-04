import React, { useState } from "react";
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
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import { useProductSizeChart } from "@/hooks/useProductSizeChart";
import { useSizeRecommendation } from "@/hooks/useSizeRecommendation";
import { SizeChartDialog } from "@/components/SizeChartDialog";
import { useProductVariants } from "@/hooks/useProductVariants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const hasMeasurements = localStorage.getItem("hasMeasurements") === "true";
  const isMobile = useIsMobile();
  const fromKiosk = localStorage.getItem("fromKiosk") === "true";

  // Fetch product data
  const { data: product, isLoading } = useProduct(productId || "");
  const { data: allProducts = [] } = useProducts();
  const { data: sizeChart, isLoading: sizeChartLoading } = useProductSizeChart(productId);
  const sizeRecommendation = useSizeRecommendation(sizeChart || null);
  const { data: productVariants, isLoading: variantsLoading } = useProductVariants(productId || "");
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
    // Check authentication first
    if (!isLoggedIn) {
      if (isMobile) {
        navigate(`/sign-up?${createSearchParams({ back: "product-details" })}`);
      } else {
        navigate("/qr-code?back=product-details");
      }
      return;
    }

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
        originalPrice: product.original_price || product.price,
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
        originalPrice: product.original_price || product.price,
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
    if (isLoggedIn) {
      handleBuyNowAndAddToCart();
    } else {
      if (isMobile) {
        navigate(`/sign-up?${createSearchParams({ back: "product-details" })}`);
      } else {
        navigate("/qr-code?back=product-details");
      }
    }
  };

  const handleTryVirtually = () => {
    if (isLoggedIn) {
      if (hasMeasurements) {
        navigate("/try-virtually");
      } else {
        navigate("/measurement-profile");
      }
    } else {
      if (isMobile) {
        navigate(`/sign-up?${createSearchParams({ back: "product-details" })}`);
      } else {
        navigate("/qr-code?back=sign-in");
      }
    }
  };

  const handleJoinRoom = () => {
    navigate("/waiting-room");
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    
    const wishlistItems = JSON.parse(
      localStorage.getItem("wishlistItems") || "[]"
    );
    const newItem = {
      id: product.product_id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price || product.price,
      image: product.image_url,
    };

    const exists = wishlistItems.some((item: any) => item.id === newItem.id);
    if (!exists) {
      wishlistItems.push(newItem);
      localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
    }
  };

  const colors = product?.colors || [];
  const sizes = productVariants?.map(v => v.size).filter(Boolean) || [];

  return (
    <div className="bg-white flex lg:lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen">
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
          className="absolute top-4 right-4 p-2 bg-white bg-opacity-80 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
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
                  {product.original_price && (
                    <span className="text-gray-400 line-through">₹{product.original_price}</span>
                  )}
                  <span className="text-lg"> ₹{product.price}</span>
                  {product.discount_percentage && (
                    <span className="text-gray-400">{product.discount_percentage}% off</span>
                  )}
                </div>
                <button
                  className="bg-[#12002C] hover:bg-black/80 rounded-md text-white text-sm px-5 py-1"
                  onClick={handleBuyNowAndAddToCart}
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
          {product?.name || "Loading..."}
        </h1>
        <div className="flex items-center space-x-2 mb-4">
          {product?.original_price && (
            <span className="text-md text-gray-500 line-through">₹{product.original_price}</span>
          )}
          {product && <span className="text-3xl font-semibold text-gray-900">₹{product.price}</span>}
          {product?.discount_percentage && (
            <span className="text-sm text-green-600 font-medium">{product.discount_percentage}% OFF</span>
          )}
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
        </div>

        {/* Color Selection */}
        <div className="px-4 mb-4">
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

      {/* Recommendation Section */}
      {isLoggedIn && hasMeasurements && (
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

              {/* Best Fit */}
              {sizeRecommendation.bestFit && (
                <div className="bg-purple-200 rounded-xl p-4 mb-4 mt-10">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">
                      <span className="font-medium">Best Fit:</span>
                      <span className="bg-orange-200 px-2 py-1 ml-1 rounded-md font-light text-sm">
                        {sizeRecommendation.bestFit.size}
                      </span>
                      <span className="ml-2 text-xs text-gray-600">
                        ({sizeRecommendation.bestFit.matchPercentage}% match)
                      </span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {sizeRecommendation.bestFit.reason}
                  </p>
                </div>
              )}

              {sizeRecommendation.alternateFit && (
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">
                      <span className="font-medium">Other Fit:</span>
                      <span className="bg-purple-200 px-2 py-1 ml-1 rounded-md font-light text-sm">
                        {sizeRecommendation.alternateFit.size}
                      </span>
                      <span className="ml-2 text-xs text-gray-600">
                        ({sizeRecommendation.alternateFit.matchPercentage}% match)
                      </span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {sizeRecommendation.alternateFit.reason}
                  </p>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-4 ml-2">
                *95% users said true to size
              </p>

              <Button
                onClick={handleTryVirtually}
                className="w-full bg-gray-900 text-white py-6 rounded-xl font-medium mt-6 mb-4"
              >
                Try Now
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="bg-gray-100 w-full h-2 my-4"></div>

      {/* Product Information */}
      <p className="text-md text-gray-800 mb-6 px-4">Product Information</p>
      <Accordion type="single" collapsible className="px-4 mb-6">
        <AccordionItem value="product-details">
          <AccordionTrigger className="text-sm text-gray-800">PRODUCT DETAILS</AccordionTrigger>
          <AccordionContent className="text-sm text-gray-600">
            {product?.description || "No description available"}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="know-product">
          <AccordionTrigger className="text-sm text-gray-800">KNOW YOUR PRODUCT</AccordionTrigger>
          <AccordionContent className="text-sm text-gray-600">
            Additional product information coming soon
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Try Another Button */}
      {isLoggedIn && (
        <div className="px-4 mb-6">
          <Button
            variant="outline"
            className="w-full py-6 rounded-xl font-medium border-gray-500"
            onClick={() => {
              navigate("/try-virtually");
            }}
          >
            Try Another
          </Button>
        </div>
      )}

      <div className="bg-gray-100 w-full h-2 my-4"></div>

      <div className="mb-48"></div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 w-full lg:lg:max-w-sm lg:left-1/2 lg:-translate-x-1/2">
        <div className="shadow-xl">

          <div className="px-4 py-2 bg-white shadow-md flex gap-2">
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

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
