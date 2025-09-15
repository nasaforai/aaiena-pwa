import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  X,
  Plus,
  Minus,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  QrCode,
  Home,
  Heart,
  User,
  Camera,
  ShoppingBag,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import BottomNavigation from "@/components/BottomNavigation";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [queryParams] = useSearchParams();
  const backRoute = queryParams.get("back");
  const isMobile = useIsMobile();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartItems(items);
  }, []);

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(index);
      return;
    }

    const updatedItems = cartItems.map((item, i) =>
      i === index ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  };

  const removeItem = (index: number) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  };

  const getTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getDiscountTotal = () => {
    return cartItems.reduce(
      (total, item) =>
        total + (item.originalPrice - item.price) * item.quantity,
      0
    );
  };

  const handleProceed = () => {
    navigate("/checkout");
  };

  const handleBack = () => {
    navigate(backRoute ? `/${backRoute}` : "/store");
  };

  return (
    <div className="bg-gray-100 flex lg:lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center p-4 bg-white border-b border-gray-100">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-3"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">CART</h1>
      </div>

      {/* Cart Items */}
      <div className="lg:flex-1">
        {cartItems.map((item, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 mb-4 bg-gray-50 p-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="text-sm text-gray-600">Fit & Regular</p>
                  <p className="font-medium text-gray-900 text-sm w-9/12 truncate ">
                    {item.name}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="flex space-x-1">
                <p className="text-xs text-gray-600 mb-2 bg-[#F5F0F0] px-2 flex items-center">
                  Size : {item.size}
                </p>
                <p className="text-xs text-gray-600 mb-2 bg-[#F5F0F0] px-2 flex items-center">
                  Qty {item.quantity} <ChevronDown className="w-3 ml-1" />
                </p>
              </div>
              <p className="font-medium text-gray-900">₹{item.price}</p>
            </div>
          </div>
        ))}

        {/* Add Coupon */}
        <div className="bg-gradient-to-r from-purple-400 to-pink-400  p-4 text-white mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Add Coupon</h3>
              <p className="text-sm opacity-90">
                Save rs.400 on your first order
              </p>
            </div>
            <button className="text-white">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Timer */}
        {!isMobile && (
          <div className="bg-[#FFFBED] border border-[#FFE6A2] rounded-lg p-3 mb-4 text-[#584001] mx-4 py-4">
            <div className="flex justify-between items-center">
              <span className="text-xs">Limited to 5 mins</span>
              <span className="text-sm bg-[#FFF0C6] px-2 py-1 rounded-sm">
                2:28 min
              </span>
            </div>

            <h3 className="font-semibold mb-3">Proceed to try product</h3>
            <div className="space-y-2 ">
              <Button className="w-full bg-[#FFE08D] hover:bg-amber-200 py-2 rounded-lg font-medium text-[#584001]">
                <QrCode className="w-4 h-4" />
                Switch To Mobile
              </Button>
              <Button
                variant="outline"
                className="w-full py-2 rounded-lg font-medium bg-transparent border-[#FFB900] hover:bg-amber-200"
              >
                Try Product
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Details */}
      <div className="bg-white rounded-lg">
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-3">PAYMENT DETAILS</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Bag Total</span>
              <span className="font-medium">₹{getTotal()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium">-₹{getDiscountTotal()}</span>
            </div>
            <span className="text-xs text-gray-500">
              &lt;COUPON&gt; applied
            </span>
            <div className="flex justify-between">
              <span className="text-gray-600">Packaging</span>
              <span className="font-medium">₹50 Free</span>
            </div>
            <div className="border-t border-dashed border-gray-400 pt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">TOTAL</span>
                <span className="font-semibold text-gray-900">
                  ₹{getTotal() - 100}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-2 mb-4">
          <p className="text-sm text-center text-gray-800">
            You're saving ₹{getDiscountTotal() + 100} on this order!
          </p>
        </div>

        <div className="flex items-center justify-between px-4 pb-4 mb-20">
          <div>
            <p className="text-xl font-bold text-gray-900">
              ₹{getTotal() - 100}
            </p>
            <button className="text-sm text-red-500 ">View Details</button>
          </div>
          <Button
            onClick={handleProceed}
            className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium"
          >
            Proceed to Buy
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
