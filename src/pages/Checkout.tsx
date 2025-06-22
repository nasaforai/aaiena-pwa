
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(items);
  }, []);

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity === 0) return;
    
    const updatedItems = cartItems.map((item, i) => 
      i === index ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDiscountTotal = () => {
    return cartItems.reduce((total, item) => total + ((item.originalPrice - item.price) * item.quantity), 0);
  };

  const handleProceedToPayment = () => {
    navigate('/payment');
  };

  return (
    <div className="bg-white flex max-w-[480px] w-full flex-col overflow-hidden mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
        <button 
          onClick={() => navigate('/cart')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <ShoppingCart className="w-6 h-6 text-gray-700" />
      </div>

      {/* Cart Items */}
      <div className="flex-1 p-4">
        {cartItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-3 mb-4 p-3 border border-gray-200 rounded-lg">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Fit & Regular</p>
              <p className="font-medium text-gray-900 text-sm mb-1">{item.name}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Size : {item.size}</p>
                  <p className="font-semibold text-gray-900">₹{item.price} <span className="text-gray-500 line-through text-xs">₹{item.originalPrice}</span> <span className="text-green-600 text-xs">15% OFF</span></p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                    className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                    className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center"
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
      <div className="bg-gray-50 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">PAYMENT DETAILS</h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Bag Total</span>
            <span className="font-medium">₹{getTotal()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Discount</span>
            <span className="font-medium text-green-600">-₹{getDiscountTotal()}</span>
          </div>
          <div className="text-xs text-gray-500">
            &lt;COUPON&gt; applied
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Packaging</span>
            <span className="font-medium">₹50 Free</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">TOTAL</span>
              <span className="font-semibold text-gray-900">₹{getTotal() - 100}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-100 p-3 rounded-lg mb-4">
          <p className="text-sm text-center text-blue-800">
            You're saving ₹{getDiscountTotal() + 100} on this order!
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-3 mb-4">
          <div className="border-b border-gray-200 pb-3">
            <button className="flex justify-between items-center w-full">
              <span className="font-medium text-gray-900">CANCELLATION POLICY</span>
              <span className="text-gray-400">+</span>
            </button>
          </div>
          <div className="border-b border-gray-200 pb-3">
            <button className="flex justify-between items-center w-full">
              <span className="font-medium text-gray-900">RETURNS POLICY</span>
              <span className="text-gray-400">+</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleProceedToPayment}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium"
          >
            Checkout via Mobile App
          </Button>
          <Button 
            variant="outline" 
            className="w-full py-3 rounded-xl font-medium border-gray-300"
          >
            Pay at Counter
          </Button>
        </div>
      </div>
    </div>
  );
}
