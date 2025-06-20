
import React from 'react';
import { Search, ShoppingCart, Home, User, Heart } from 'lucide-react';

interface StoreScreenProps {
  onBack?: () => void;
}

export const StoreScreen: React.FC<StoreScreenProps> = ({ onBack }) => {
  return (
    <div className="bg-white flex max-w-[480px] w-full flex-col overflow-hidden mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="text-lg font-medium">Guest</div>
        <div className="text-red-600 text-2xl font-bold">H&M</div>
        <ShoppingCart className="w-6 h-6 text-gray-700" />
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg text-gray-700 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Queue Status */}
      <div className="mx-4 mb-4 bg-purple-500 rounded-lg p-4 text-white">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm">Queue Status</span>
          <span className="text-sm">1-5 minutes</span>
        </div>
        <div className="text-lg font-semibold mb-2">Moderate</div>
        <div className="flex justify-between text-sm mb-3">
          <span>Queuing Room: 4</span>
          <span>Average Wait: 3 min</span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span>↑ 15 Min Prev: Join</span>
          <span>↑ 15 Min Prev: Join</span>
        </div>
        <button className="w-full bg-white text-purple-500 py-2 rounded-lg font-medium">
          Try Virtually
        </button>
        <div className="text-center text-sm mt-2 opacity-90">
          Today's Shopping Goal
        </div>
        <div className="text-center text-sm mt-1">
          Log In To See Full Preview →
        </div>
      </div>

      {/* Designer Picks */}
      <div className="mx-4 mb-4 bg-purple-400 rounded-lg p-4">
        <h3 className="text-white text-lg font-semibold mb-2">DESIGNER PICKS</h3>
        <p className="text-white text-sm mb-3">
          Trending Trends Lifestyle Golf for You Discount Discover 
          Everyday Exclusive Limited Global Fashion Utility
        </p>
        <button className="bg-white text-purple-500 px-6 py-2 rounded-lg font-medium">
          Explore Now
        </button>
      </div>

      {/* Shop All Categories */}
      <div className="px-4 mb-4">
        <h3 className="text-lg font-semibold mb-3">Shop All</h3>
        <div className="flex space-x-4">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-lg mb-1"></div>
            <span className="text-xs text-gray-600">Dress</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-lg mb-1"></div>
            <span className="text-xs text-gray-600">Jeans</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-lg mb-1"></div>
            <span className="text-xs text-gray-600">Trousers</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-lg mb-1"></div>
            <span className="text-xs text-gray-600">T-shirts</span>
          </div>
        </div>
      </div>

      {/* Discount Banner */}
      <div className="mx-4 mb-4">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-4 text-white">
          <div className="text-lg font-bold">Discount</div>
          <div className="text-sm">New Users Only</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 mb-4">
        <div className="flex space-x-4 border-b">
          <button className="text-purple-500 border-b-2 border-purple-500 pb-2">All</button>
          <button className="text-gray-500 pb-2">Women</button>
          <button className="text-gray-500 pb-2">Men</button>
          <button className="text-gray-500 pb-2">Kids</button>
        </div>
      </div>

      {/* Trending Now */}
      <div className="px-4 mb-4">
        <h3 className="text-lg font-semibold mb-3">Trending Now</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-200 rounded-lg aspect-[3/4] relative">
            <div className="absolute bottom-2 left-2 bg-white rounded-full p-1">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg aspect-[3/4] relative">
            <div className="absolute bottom-2 left-2 bg-white rounded-full p-1">
              <Heart className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Recently Tried */}
      <div className="px-4 mb-4">
        <h3 className="text-lg font-semibold mb-3">Recently Tried</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-200 rounded-lg aspect-[3/4] relative">
            <div className="absolute bottom-2 left-2 bg-white rounded-full p-1">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg aspect-[3/4] relative">
            <div className="absolute bottom-2 left-2 bg-white rounded-full p-1">
              <Heart className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* What's New Banner */}
      <div className="mx-4 mb-4">
        <div className="bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg p-4 text-white text-center">
          <div className="text-sm opacity-90">GALLAREST</div>
          <div className="text-lg font-bold">WHAT'S NEW!</div>
          <button className="bg-white text-purple-500 px-4 py-1 rounded-lg text-sm mt-2">
            See All
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[480px] bg-white border-t flex justify-around py-2">
        <div className="flex flex-col items-center">
          <Home className="w-6 h-6 text-purple-500" />
          <span className="text-xs text-purple-500">Home</span>
        </div>
        <div className="flex flex-col items-center">
          <ShoppingCart className="w-6 h-6 text-gray-400" />
          <span className="text-xs text-gray-400">Cart</span>
        </div>
        <div className="flex flex-col items-center">
          <Search className="w-6 h-6 text-gray-400" />
          <span className="text-xs text-gray-400">Search</span>
        </div>
        <div className="flex flex-col items-center">
          <Heart className="w-6 h-6 text-gray-400" />
          <span className="text-xs text-gray-400">Wishlist</span>
        </div>
        <div className="flex flex-col items-center">
          <User className="w-6 h-6 text-gray-400" />
          <span className="text-xs text-gray-400">Profile</span>
        </div>
      </div>

      {/* Spacer for bottom navigation */}
      <div className="h-16"></div>
    </div>
  );
};
