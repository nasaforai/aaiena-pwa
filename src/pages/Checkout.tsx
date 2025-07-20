import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  ChevronRight,
  PlusIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartItems(items);
  }, []);

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity === 0) return;

    const updatedItems = cartItems.map((item, i) =>
      i === index ? { ...item, quantity: newQuantity } : item
    );
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

  const handleProceedToPayment = () => {
    if (isMobile) {
      navigate("/payment");
    } else {
      navigate("/qr-code?back=checkout");
    }
  };

  return (
    <div className="bg-white flex lg:lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
        <button
          onClick={() => navigate("/cart")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <ShoppingCart className="w-6 h-6 text-gray-700" />
      </div>

      {/* Cart Items */}
      <div className="flex-1 p-4">
        {cartItems.map((item, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 mb-4 p-3 rounded-lg"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Fit & Regular</p>
              <p className="font-medium text-gray-900 text-sm mb-1 w-8/12 truncate text-ellipsis">
                {item.name}
              </p>
              <div className="flex items-end justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Size : {item.size}</p>
                  <div className="text-gray-900">
                    <span>₹{item.price}</span>
                    <span className="text-gray-500 line-through text-xs ml-1">
                      ₹{item.originalPrice}
                    </span>
                    <span className="text-gray-500 text-xs ml-1">15% OFF</span>
                  </div>
                </div>
                <div className="flex items-center bg-gray-100 flex-1 ml-1">
                  <button
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                    className="w-6 h-6 rounded flex items-center justify-center"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                    className="w-6 h-6 rounded flex items-center justify-center"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
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
      </div>

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

      {/* Policy Sections */}
      <div className="space-y-3 mb-4 px-4">
        <div className="border-b border-gray-200 pb-3">
          <button className="flex justify-between items-center w-full">
            <span className="font-medium text-gray-700 text-sm">
              CANCELLATION POLICY
            </span>
            <PlusIcon className="text-gray-600" />
          </button>
        </div>
        <div className="border-b border-gray-200 pb-3">
          <button className="flex justify-between items-center w-full">
            <span className="font-medium text-gray-700 text-sm">
              RETURNS POLICY
            </span>
            <PlusIcon className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="space-y-3 px-4 my-4">
        <Button
          onClick={handleProceedToPayment}
          className="w-full bg-gray-900 text-white py-6 rounded-xl font-medium"
        >
          {isMobile ? "Checkout" : "Checkout via Mobile App"}
        </Button>
        {!isMobile && (
          <Button className="w-full rounded-xl font-medium bg-transparent text-gray-900">
            Pay at Counter
          </Button>
        )}
      </div>
    </div>
  );
}
