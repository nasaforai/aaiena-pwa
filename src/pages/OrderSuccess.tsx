import React, { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    // Clear cart after successful order
    const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartItems(items);

    return () => {
      localStorage.removeItem("cartItems");
    };
  }, []);

  const handleGoHome = () => {
    navigate("/");
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

  return (
    <div className="bg-white flex lg:lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
        <button
          onClick={() => navigate("/store")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <ShoppingCart className="w-6 h-6 text-gray-700" />
      </div>

      {/* Success Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Thanks! You're all set. <br />
            Pick up your item at the counter.
          </h1>
        </div>

        {/* Success Illustration */}
        <div className="mb-8">
          <img
            src="/icons/payment.png"
            alt="payment success icon"
            width={118}
            height={118}
          />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Congratulations
          </h2>
          <p className="text-gray-600 text-sm">
            Your order is sent to the counter.
            <br />
            Please visit to collect it!
          </p>
        </div>

        {/* Order Details */}
        <div className="w-full bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm text-gray-900">
              Order ID: 123456789
            </span>
            <button className="text-gray-800 font-medium flex items-center">
              ORDER DETAILS
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3">PAYMENT DETAILS</h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Bag Total</span>
            <span className="font-medium">₹{getTotal()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Discount</span>
            <span className="font-medium text-gray-400">
              -₹{getDiscountTotal()}
            </span>
          </div>
          <div className="text-xs text-gray-500">&lt;COUPON&gt; applied</div>
          <div className="flex justify-between">
            <span className="text-gray-600">Packaging</span>
            <div>
              <span className="text-xs text-gray-400 line-through mr-1">
                ₹50
              </span>
              <span className="font-medium"> Free</span>
            </div>
          </div>
          <div className="border-t border-dashed border-gray-300 pt-2">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">TOTAL</span>
              <span className="font-semibold text-gray-900">
                ₹{getTotal() - 100}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg mb-4">
          <p className="text-sm text-center text-gray-800">
            You're saving ₹{getDiscountTotal() + 100} on this order!
          </p>
        </div>

        <button
          onClick={() => {
            navigate("/store");
          }}
          className="bg-black py-4 rounded-xl my-4 w-full text-white"
        >
          Home
        </button>
      </div>
    </div>
  );
}
