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
import { useNavigation } from "@/hooks/useNavigation";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/BottomNavigation";
import Topbar from "@/components/ui/topbar";

export default function Cart() {
  const navigate = useNavigate();
  const { navigateBack } = useNavigation();
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


  const handleProceed = () => {
    navigate("/checkout");
  };

  const handleBack = () => {
    navigateBack(backRoute ? `/${backRoute}` : "/store");
  };

  return (
    <div className="bg-gray-100 flex lg:lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen">
      <Topbar handleBack={handleBack} showBack={true} />

      {cartItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <ShoppingBag className="w-20 h-20 text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 text-center mb-6">
            Looks like you haven't added any items yet
          </p>
          <Button
            onClick={() => navigate("/store")}
            className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium"
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <>
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
                <div className="border-t border-dashed border-gray-400 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">TOTAL</span>
                    <span className="font-semibold text-gray-900">
                      ₹{getTotal()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-4 pb-4 mb-20">
              <div>
                <p className="text-xl font-bold text-gray-900">
                  ₹{getTotal()}
                </p>
              </div>
              <Button
                onClick={handleProceed}
                className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium"
              >
                Proceed to Buy
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
