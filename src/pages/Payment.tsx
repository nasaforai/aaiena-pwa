import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Payment() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedPayment, setSelectedPayment] = useState("google-pay");

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartItems(items);
  }, []);

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

  const handlePayment = () => {
    navigate("/order-success");
  };

  return (
    <div className="bg-white flex lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center p-4 bg-white border-b border-gray-100">
        <button
          onClick={() => navigate("/checkout")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-3"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">PAYMENT</h1>
      </div>

      {/* Payment Options */}
      <div className="flex-1 p-4">
        {/* UPI Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">UPI</span>
              </div>
              <span className="font-medium">UPI</span>
            </div>
            <span className="text-sm text-gray-600">
              Google Pay, Paytm, Phonepe & More
            </span>
          </div>

          {/* Google Pay */}
          <div className="flex items-center space-x-3 p-3 mb-2">
            <input
              type="radio"
              name="payment"
              id="google-pay"
              checked={selectedPayment === "google-pay"}
              onChange={() => setSelectedPayment("google-pay")}
              className="w-4 h-4 text-purple-600"
            />
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
              <div className="w-6 h-6 bg-orange-500 rounded"></div>
              <span className="font-medium">Google Pay</span>
            </div>
          </div>

          {selectedPayment === "google-pay" && (
            <Button
              onClick={handlePayment}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium mb-4"
            >
              Pay ₹ {getTotal() - 100}
            </Button>
          )}

          {/* Paytm */}
          <div className="flex items-center space-x-3 p-3 mb-2">
            <input
              type="radio"
              name="payment"
              id="paytm"
              checked={selectedPayment === "paytm"}
              onChange={() => setSelectedPayment("paytm")}
              className="w-4 h-4 text-purple-600"
            />
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
              <span className="font-medium">Paytm</span>
            </div>
          </div>

          {/* Other UPI */}
          <div className="flex items-center space-x-3 p-3 mb-4">
            <input
              type="radio"
              name="payment"
              id="other-upi"
              checked={selectedPayment === "other-upi"}
              onChange={() => setSelectedPayment("other-upi")}
              className="w-4 h-4 text-purple-600"
            />
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">UPI</span>
              </div>
              <span className="font-medium">Other UPI</span>
            </div>
          </div>
        </div>

        {/* Other Payment Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-400 rounded"></div>
              <span className="font-medium">Credit/Debit Card</span>
            </div>
            <span className="text-gray-400">▼</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
              <span className="font-medium">Net Banking</span>
            </div>
            <span className="text-gray-400">▼</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-600 rounded"></div>
              <span className="font-medium">Shop now & pay later</span>
            </div>
            <span className="text-gray-400">▼</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-yellow-500 rounded"></div>
              <span className="font-medium">Have a Gift Card?</span>
            </div>
            <span className="text-gray-400">▼</span>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-gray-50 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">PAYMENT DETAILS</h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Bag Total</span>
            <span className="font-medium">₹{getTotal()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Discount</span>
            <span className="font-medium text-green-600">
              -₹{getDiscountTotal()}
            </span>
          </div>
          <div className="text-xs text-gray-500">&lt;COUPON&gt; applied</div>
          <div className="flex justify-between">
            <span className="text-gray-600">Packaging</span>
            <span className="font-medium">₹50 Free</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">TOTAL</span>
              <span className="font-semibold text-gray-900">
                ₹{getTotal() - 100}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-blue-100 p-3 rounded-lg">
          <p className="text-sm text-center text-blue-800">
            You're saving ₹{getDiscountTotal() + 100} on this order!
          </p>
        </div>
      </div>
    </div>
  );
}
