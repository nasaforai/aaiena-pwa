import React, { useState, useEffect } from "react";
import { ArrowLeft, ShoppingCart, X, Heart, Home, User, Camera, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/BottomNavigation";

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("wishlistItems") || "[]");
    setWishlistItems(items);
  }, []);

  const removeFromWishlist = (index: number) => {
    const updatedItems = wishlistItems.filter((_, i) => i !== index);
    setWishlistItems(updatedItems);
    localStorage.setItem("wishlistItems", JSON.stringify(updatedItems));
  };

  const moveToCart = (item: any, index: number) => {
    // Add to cart
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const cartItem = {
      ...item,
      size: "M",
      color: "white",
      quantity: 1,
    };
    cartItems.push(cartItem);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    // Remove from wishlist
    removeFromWishlist(index);
  };

  return (
    <div className="bg-white flex lg:lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/store")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-3"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">WISHLIST</h1>
            <p className="text-sm text-gray-600">
              {wishlistItems.length} Products
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/cart")}
          className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ShoppingCart className="w-6 h-6 text-gray-700" />
          {JSON.parse(localStorage.getItem("cartItems") || "[]").length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {JSON.parse(localStorage.getItem("cartItems") || "[]").reduce(
                (total: number, item: any) => total + item.quantity,
                0
              )}
            </span>
          )}
        </button>
      </div>

      {/* Wishlist Items */}
      <div className="flex-1 p-4 mb-20">
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Heart className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center">Your wishlist is empty</p>
            <Button
              onClick={() => navigate("/store")}
              className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {wishlistItems.map((item, index) => (
              <div
                key={index}
                className="relative bg-gray-100 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => removeFromWishlist(index)}
                  className="absolute top-2 right-2 z-10 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>

                <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <button className="absolute bottom-2 left-2 bg-gray-900 text-white px-3 py-1 rounded-lg text-xs font-medium">
                    Try Virtually
                  </button>
                </div>

                <div className="p-3">
                  <p className="text-xs text-gray-600 mb-1">Fit & Regular</p>
                  <p className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                    {item.name}
                  </p>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="font-semibold text-gray-900">
                      ₹{item.price}
                    </span>
                    <span className="text-xs text-gray-500 line-through">
                      ₹{item.originalPrice}
                    </span>
                    <span className="text-xs text-green-600">20% OFF</span>
                  </div>
                  <Button
                    onClick={() => moveToCart(item, index)}
                    className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
                  >
                    Move To Bag
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Brand */}
      <div className="p-4 text-center mb-16">
        <p className="text-2xl font-bold text-gray-300">Aaiena</p>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
