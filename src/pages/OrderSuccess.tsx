import React, { useEffect } from "react";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function OrderSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear cart after successful order
    localStorage.removeItem("cartItems");
  }, []);

  const handleGoHome = () => {
    navigate("/");
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
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Thanks! You're all set.
          </h1>
          <p className="text-gray-600">Pick up your item at the counter.</p>
        </div>

        {/* Success Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-20 bg-blue-500 rounded-lg"></div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                <div className="w-4 h-3 bg-white rounded-sm"></div>
              </div>
              <div className="absolute -bottom-2 -left-2 w-12 h-8 bg-orange-300 rounded-lg"></div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Congratulations
          </h2>
          <p className="text-gray-600">
            Your order is sent to the counter.
            <br />
            Please visit to collect it!
          </p>
        </div>

        {/* Order Details */}
        <div className="w-full bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium text-gray-900">
              Order ID: 123456789
            </span>
            <button className="text-purple-600 font-medium flex items-center">
              ORDER DETAILS
              <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-gray-50 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">PAYMENT DETAILS</h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Bag Total</span>
            <span className="font-medium">₹774</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Discount</span>
            <span className="font-medium text-green-600">-₹100.0</span>
          </div>
          <div className="text-xs text-gray-500">&lt;COUPON&gt; applied</div>
          <div className="flex justify-between">
            <span className="text-gray-600">Packaging</span>
            <span className="font-medium">₹50 Free</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">TOTAL</span>
              <span className="font-semibold text-gray-900">600.00</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-100 p-3 rounded-lg mb-4">
          <p className="text-sm text-center text-blue-800">
            You're saving ₹199 on this order!
          </p>
        </div>

        <Button
          onClick={handleGoHome}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium"
        >
          Home
        </Button>
      </div>
    </div>
  );
}
