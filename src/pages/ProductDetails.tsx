import React, { useState } from "react";
import { ArrowLeft, Heart, ShoppingCart, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Topbar from "@/components/ui/topbar";

export default function ProductDetails() {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("white");
  const [quantity, setQuantity] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleBack = () => {
    navigate("/store");
  };

  const handleAddToCart = () => {
    // Add to cart logic
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const newItem = {
      id: 1,
      name: "Drop-Shoulder Cotton Tee | Relaxed Fit, All-Day Comfort.",
      price: 700,
      originalPrice: 1400,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      image: "/lovable-uploads/df938429-9c2a-4054-b1fe-5c1aa483a885.png",
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
    navigate("/cart");
  };

  const handleBuyNow = () => {
    handleAddToCart();
  };

  const handleAddToWishlist = () => {
    const wishlistItems = JSON.parse(
      localStorage.getItem("wishlistItems") || "[]"
    );
    const newItem = {
      id: 1,
      name: "Drop-Shoulder Cotton Tee | Relaxed Fit, All-Day Comfort.",
      price: 700,
      originalPrice: 1400,
      image: "/lovable-uploads/df938429-9c2a-4054-b1fe-5c1aa483a885.png",
    };

    const exists = wishlistItems.some((item: any) => item.id === newItem.id);
    if (!exists) {
      wishlistItems.push(newItem);
      localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
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
    <div className="bg-white flex max-w-[480px] w-full flex-col overflow-hidden mx-auto min-h-screen">
      {/* Header */}
      <Topbar handleBack={handleBack} />

      {/* Product Image */}
      <div className="relative bg-gradient-to-b from-pink-100 to-white min-h-[10vh] mx-4 mb-4 overflow-hidden">
        <img
          alt="Product"
          className="w-full h-full object-cover rounded-br-lg rounded-bl-lg"
          src="/images/dress.jpg"
        />
        <button
          onClick={handleAddToWishlist}
          className="absolute top-4 right-4 p-2 bg-white bg-opacity-80 rounded-full"
        >
          <Heart className="w-5 h-5 text-gray-600" />
        </button>

        {isLoggedIn && (
          <div className="absolute left-0 bottom-0 w-full p-3">
            <div className="bg-white/80 flex items-center justify-between p-4 rounded-xl">
              <div>
                <p className="text-sm max-w-40">
                  Miss Chase Women's V-Neck Maxi Dress
                </p>
              </div>
              <div className="flex flex-col justify-center">
                <div className="text-xs flex flex-nowrap gap-1 items-center">
                  <span className="text-gray-400 line-through">₹1000</span>
                  <span className="text-lg"> ₹500</span>
                  <span className="text-gray-400">50% off</span>
                </div>
                <button className="bg-[#12002C] hover:bg-black/80 rounded-md text-white text-sm px-5 py-1">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-4 mb-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Drop-Shoulder Cotton Tee | Relaxed Fit, All-Day Comfort.
        </h1>
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-md text-gray-500 line-through">₹1400</span>
          <span className="text-3xl font-semibold text-gray-900">₹700</span>
          <span className="text-sm text-green-600 font-medium">50% OFF</span>
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
              className={`w-8 h-8 rounded ${color.bg} ${
                selectedColor === color.name ? "ring-2 ring-purple-500" : ""
              }`}
            />
          ))}
        </div>
      </div>

      {/* Recommendation Section */}
      <div className="px-4 mb-4">
        <div className="flex items-center space-x-2 mb-3">
          <span className="font-medium text-gray-900">Recommendation</span>
          <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs text-gray-600">i</span>
          </div>
        </div>

        {/* Size Chart */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 mb-4">
          <h3 className="font-bold text-gray-900 mb-3">My Size</h3>
          <p className="text-sm text-gray-600 mb-3">
            Tailored to match your exact measurements
          </p>

          {/* Circular Size Chart */}
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-200 to-purple-200"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-pink-200 to-yellow-200"></div>
              <div className="absolute inset-4 rounded-full bg-gradient-to-r from-green-200 to-blue-200"></div>
              <div className="absolute inset-6 rounded-full bg-white flex items-center justify-center">
                <span className="text-sm font-bold text-gray-700">Sizes</span>
              </div>
            </div>
          </div>

          {/* Size Options */}
          <div className="flex justify-between text-center mb-4">
            <div className="text-xs">
              <div className="font-medium">Large size</div>
              <div className="text-gray-600">(XL,XXL)</div>
            </div>
            <div className="text-xs">
              <div className="font-medium text-purple-600">Medium size</div>
              <div className="text-gray-600">(M)</div>
            </div>
            <div className="text-xs">
              <div className="font-medium">Small size</div>
              <div className="text-gray-600">(S)</div>
            </div>
          </div>

          {/* Best Fit */}
          <div className="bg-purple-100 rounded-xl p-3 mb-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">
                Best Fit: Large Size
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              We recommend Large "L" as the best fit for you—it offers a
              comfortable and well-balanced look.
            </p>
          </div>

          <div className="bg-gray-100 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">
                Other Fit: Medium Size
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Medium as the right fit for you—it could feel a bit snug. Great if
              you like tighter-fitting clothes.
            </p>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            *95% users said true to size
          </p>
        </div>

        <Button className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium mb-4">
          Try Now
        </Button>
      </div>

      {/* Product Information */}
      <div className="px-4 space-y-4 mb-6">
        <div className="border-b border-gray-200 pb-3">
          <button className="flex justify-between items-center w-full">
            <span className="font-medium text-gray-900">PRODUCT DETAILS</span>
            <span className="text-gray-400">▼</span>
          </button>
        </div>
        <div className="border-b border-gray-200 pb-3">
          <button className="flex justify-between items-center w-full">
            <span className="font-medium text-gray-900">KNOW YOUR PRODUCT</span>
            <span className="text-gray-400">▼</span>
          </button>
        </div>
        <div className="border-b border-gray-200 pb-3">
          <button className="flex justify-between items-center w-full">
            <span className="font-medium text-gray-900">
              PRODUCT MEASUREMENTS
            </span>
            <span className="text-gray-400">▼</span>
          </button>
        </div>
      </div>

      {/* Try Another Button */}
      <div className="px-4 mb-6">
        <Button
          variant="outline"
          className="w-full py-3 rounded-xl font-medium border-gray-300"
        >
          Try Another
        </Button>
      </div>

      {/* Find Similar */}
      <div className="px-4 mb-6">
        <h3 className="font-bold text-lg mb-3">Find Similar</h3>
        <div className="flex space-x-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex-1 bg-gray-100 rounded-2xl overflow-hidden"
            >
              <div className="h-32 bg-gray-200 relative">
                <button className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-600">View Details</p>
                <p className="text-sm font-semibold">₹500 ₹700</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="px-4 pb-6">
        <div className="bg-purple-100 rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-700">2A Moderate</span>
            <div className="flex space-x-2">
              <span className="bg-purple-200 px-2 py-1 rounded text-sm">
                2A
              </span>
              <span className="bg-purple-200 px-2 py-1 rounded text-sm">
                3C
              </span>
            </div>
          </div>
          <button className="text-xs text-purple-600 font-medium">
            JOIN EMPTY ROOMS
          </button>
        </div>

        <Button
          onClick={handleBuyNow}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium"
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}
