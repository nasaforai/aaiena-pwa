
import React, { useState } from 'react';
import { ArrowLeft, Heart, ShoppingCart } from 'lucide-react';

interface ProductDetailsScreenProps {
  onBack?: () => void;
}

export const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({ onBack }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = ['White', 'Blue', 'Black', 'Gray'];

  return (
    <div className="bg-white flex max-w-[480px] w-full flex-col overflow-hidden mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white">
        <button 
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <ShoppingCart className="w-6 h-6 text-gray-700" />
      </div>

      {/* Product Image */}
      <div className="relative bg-[#E8C4A0] h-96 mx-4 rounded-2xl mb-4 overflow-hidden">
        <img 
          src="/lovable-uploads/ffe0dc82-9639-4192-ae97-d15133e15fb9.png" 
          alt="Product" 
          className="w-full h-full object-cover"
        />
        <button className="absolute top-4 right-4 p-2 bg-white bg-opacity-80 rounded-full">
          <Heart className="w-5 h-5 text-gray-600" />
        </button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
          <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
        </div>
      </div>

      {/* Product Info */}
      <div className="px-4 mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Drop-Shoulder Cotton Tee | Relaxed Fit, All-Day Comfort.
        </h1>
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl font-bold text-gray-900">₹700</span>
          <span className="text-lg text-gray-500 line-through">₹1400</span>
          <span className="text-sm text-green-600 font-medium">50% OFF</span>
        </div>
      </div>

      {/* Size Selection */}
      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="font-medium text-gray-900">Select Size :</span>
          <span className="font-medium text-gray-900">Color :</span>
        </div>
        <div className="flex justify-between items-start">
          <div className="flex space-x-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-2 border rounded-lg text-sm font-medium ${
                  selectedSize === size
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 text-gray-700'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-blue-200 rounded border-2 border-blue-500"></div>
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Login to get your size recommendation</p>
      </div>

      {/* Product Information Sections */}
      <div className="px-4 space-y-4 mb-6">
        <div className="border-b border-gray-200 pb-3">
          <button className="flex justify-between items-center w-full">
            <span className="font-medium text-gray-900">PRODUCT DETAILS</span>
            <span className="text-gray-400">▼</span>
          </button>
        </div>
        <div className="border-b border-gray-200 pb-3">
          <button className="flex justify-between items-center w-full">
            <span className="font-medium text-gray-900">KNOW YOUR PRODUCT</span>
            <span className="text-gray-400">▼</span>
          </button>
        </div>
      </div>

      {/* Find Similar */}
      <div className="px-4 mb-6">
        <h3 className="font-bold text-lg mb-3">Find Similar</h3>
        <div className="flex space-x-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex-1 bg-gray-100 rounded-2xl overflow-hidden">
              <div className="h-32 bg-gray-200"></div>
              <div className="p-2">
                <p className="text-xs text-gray-600">View Details</p>
                <p className="text-sm font-semibold">₹500 ₹700</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Try Virtually Section */}
      <div className="mx-4 mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 text-center">
        <div className="text-white">
          <h3 className="font-bold text-lg mb-2">Struggling To Spot Your Fit?</h3>
          <button className="bg-white text-orange-500 px-6 py-2 rounded-xl text-sm font-medium">
            Set Your Profile →
          </button>
        </div>
      </div>

      {/* You Might Also Like */}
      <div className="px-4 mb-6">
        <h3 className="font-bold text-lg mb-3">You Might Also Like</h3>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((item) => (
            <div key={item} className="bg-gray-100 rounded-2xl overflow-hidden">
              <div className="h-40 bg-gray-200"></div>
              <div className="p-3">
                <p className="text-sm text-gray-600">View Details</p>
                <p className="font-semibold">₹500 ₹700</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section with Try Virtually and Buy Now */}
      <div className="px-4 pb-24">
        <div className="bg-purple-500 rounded-2xl p-4 text-white text-center mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm opacity-90">JOIN EMPTY ROOMS:</span>
            <div className="flex space-x-2">
              <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm">2A</span>
              <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm">2C</span>
              <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm">3C</span>
            </div>
          </div>
          <div className="text-2xl font-bold mb-2">Moderate</div>
          <button className="w-full bg-white bg-opacity-20 text-white py-2 rounded-xl text-sm font-medium mb-2">
            Join Room
          </button>
        </div>
        
        <div className="flex space-x-3">
          <button className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-center font-medium">
            Try Virtually
          </button>
          <button className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-center font-medium">
            Buy Now
          </button>
          <button className="p-3 border border-gray-300 rounded-xl">
            <ShoppingCart className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
