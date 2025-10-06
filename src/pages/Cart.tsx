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
    <div className="bg-background flex lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen">
      <Topbar handleBack={handleBack} showBack={true} />

      {cartItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl"></div>
            <ShoppingBag className="relative w-24 h-24 text-muted-foreground/40" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground text-center mb-8 max-w-sm">
            Looks like you haven't added any items yet. Start shopping to fill your cart!
          </p>
          <Button
            onClick={() => navigate("/store")}
            className="bg-primary text-primary-foreground px-8 py-6 rounded-xl font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <>
          {/* Header with item count */}
          <div className="px-4 py-3 bg-card border-b border-border">
            <h1 className="text-lg font-semibold text-foreground">
              Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </h1>
          </div>

          {/* Cart Items */}
          <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto mb-4 pb-4">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="bg-card rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-28 rounded-lg object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 pr-2">
                        <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
                          {item.name}
                        </h3>
                      </div>
                      <button
                        onClick={() => removeItem(index)}
                        className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors group"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full font-medium">
                        Size: {item.size}
                      </span>
                      {item.color && (
                        <span className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full font-medium">
                          {item.color}
                        </span>
                      )}
                      <span className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full font-medium">
                        Qty: {item.quantity}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-foreground">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ₹{item.price.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Details - Fixed at bottom */}
          <div className="sticky bottom-16 bg-card border-t border-border shadow-lg z-10">
            <div className="p-4">
              <h3 className="text-xs font-semibold text-muted-foreground mb-3 tracking-wider uppercase">
                Payment Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Bag Total</span>
                  <span className="text-sm font-semibold text-foreground">
                    ₹{getTotal().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Delivery</span>
                  <span className="text-sm font-semibold text-green-600">FREE</span>
                </div>
                <div className="border-t border-dashed border-border pt-2 mt-2">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-base font-bold text-foreground">Total Amount</span>
                    <span className="text-xl font-bold text-foreground">
                      ₹{getTotal().toLocaleString()}
                    </span>
                  </div>
                  
                  <Button
                    onClick={handleProceed}
                    className="w-full bg-primary text-primary-foreground py-5 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl text-base"
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
