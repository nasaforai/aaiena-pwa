
import React, { useState } from "react";
import { ArrowLeft, Heart, ShoppingCart, UserPen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Topbar from "@/components/ui/topbar";
import { Avatar3D } from "@/components/Avatar3D";

export default function TryVirtually() {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("white");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const handleBack = () => {
    navigate("/product-details");
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
      quantity: 1,
      image: "/lovable-uploads/df938429-9c2a-4054-b1fe-5c1aa483a885.png",
    };

    const existingItemIndex = cartItems.findIndex(
      (item: any) =>
        item.id === newItem.id &&
        item.size === selectedSize &&
        item.color === selectedColor
    );

    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push(newItem);
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    navigate("/cart");
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

      {/* 3D Avatar Section */}
      <div className="relative bg-gradient-to-b from-purple-100 to-white min-h-[50vh] mx-4 mb-4 overflow-hidden rounded-xl">
        <Avatar3D />
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-sm font-medium text-gray-700">Virtual Try-On</span>
        </div>
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full">
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="px-4">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Drop-Shoulder Cotton Tee | Relaxed Fit, All-Day Comfort.
        </h1>
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-md text-gray-500 line-through">₹1400</span>
          <span className="text-3xl font-semibold text-gray-900">₹700</span>
          <span className="text-sm text-green-600 font-medium">50% OFF</span>
        </div>
      </div>

      <div className="flex justify-between">
        {/* Size Selection */}
        <div className="px-4 mb-4">
          <span className="font-medium text-gray-900 mb-3 block">Sizes:</span>
          <div className="flex space-x-3">
            {sizes.map((size) => (
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
      </div>

      {/* Virtual Try-On Controls */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
            <UserPen className="w-5 h-5 mr-2" />
            Virtual Try-On Controls
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="text-sm">
              Change Pose
            </Button>
            <Button variant="outline" className="text-sm">
              Adjust Fit
            </Button>
            <Button variant="outline" className="text-sm">
              Lighting
            </Button>
            <Button variant="outline" className="text-sm">
              Background
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 w-full h-2 my-4"></div>

      {/* How It Looks */}
      <div className="px-4 mb-6">
        <h3 className="font-semibold text-lg mb-3">How It Looks</h3>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-900 font-medium">Fit Analysis</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              Perfect Fit
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            This size looks great on your body type. The fit is comfortable and flattering.
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full mx-auto mb-1 flex items-center justify-center">
                <span className="text-green-600">✓</span>
              </div>
              <span className="text-gray-600">Shoulder</span>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full mx-auto mb-1 flex items-center justify-center">
                <span className="text-green-600">✓</span>
              </div>
              <span className="text-gray-600">Chest</span>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-full mx-auto mb-1 flex items-center justify-center">
                <span className="text-yellow-600">~</span>
              </div>
              <span className="text-gray-600">Length</span>
            </div>
          </div>
        </div>
      </div>

      {/* Try Different Styles */}
      <div className="px-4 mb-6">
        <Button
          variant="outline"
          className="w-full py-6 rounded-xl font-medium border-gray-500"
        >
          Try Different Styles
        </Button>
      </div>

      <div className="bg-gray-100 w-full h-2 my-4"></div>

      {/* Share Your Look */}
      <div className="px-4 mb-6">
        <h3 className="font-semibold text-lg mb-3">Share Your Look</h3>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex-1">
            Save Photo
          </Button>
          <Button variant="outline" className="flex-1">
            Share
          </Button>
        </div>
      </div>

      {/* Suggestion Banner */}
      <div className="py-10 mb-6 flex flex-col items-center justify-center bg-blue-300">
        <p className="text-xl font-semibold text-white mb-2">Love this look?</p>
        <p className="text-white mb-4">Try it with different accessories</p>
        <button className="flex shadow-sm bg-white items-center rounded-md pl-6 pr-4 py-2">
          <span className="text-blue-600 font-medium">Explore Accessories</span>
          <ArrowRight className="h-4 ml-2 text-blue-600" />
        </button>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 w-full lg:lg:max-w-sm lg:left-1/2 lg:-translate-x-1/2">
        <div className="px-4 py-4 bg-white shadow-lg border-t border-gray-200 flex gap-4">
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-medium"
          >
            Add to Cart
          </Button>
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
