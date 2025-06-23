import React from "react";
import {
  ArrowLeft,
  Search,
  ShoppingBag,
  User,
  Heart,
  Home,
  MessageCircle,
} from "lucide-react";

interface StoreScreenProps {
  onBack?: () => void;
  onProductSelect?: () => void;
}

export const StoreScreen: React.FC<StoreScreenProps> = ({
  onBack,
  onProductSelect,
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleProductClick = () => {
    if (onProductSelect) {
      onProductSelect();
    }
  };

  return (
    <div className="bg-white flex lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="text-red-600 text-2xl font-bold">H&M</div>
        <ShoppingBag className="w-6 h-6 text-gray-700" />
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-gray-50">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Queue Status */}
      <div className="mx-4 mb-4 bg-purple-500 rounded-2xl p-4 text-white">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm opacity-90">Queue Status</span>
          <span className="text-sm">1-4-5 minutes</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-2xl font-bold">Moderate</div>
            <div className="text-sm opacity-90">
              <span className="mr-4">Activity Level: 4</span>
              <span>Average Wait: 3 min</span>
            </div>
          </div>
        </div>
        <button className="w-full mt-3 bg-white bg-opacity-20 text-white py-2 rounded-xl text-sm font-medium">
          Try Virtually
        </button>
        <div className="mt-2 text-center">
          <span className="text-xs opacity-75">Today's Discount offer →</span>
        </div>
        <button className="w-full mt-2 bg-white text-purple-500 py-2 rounded-xl text-sm font-medium">
          Log In To See Full Preview →
        </button>
      </div>

      {/* Designer Picks */}
      <div className="mx-4 mb-4 bg-purple-400 rounded-2xl p-4 text-white">
        <h3 className="font-bold text-lg mb-2">DESIGNER PICKS</h3>
        <p className="text-sm opacity-90 mb-3">
          Fashion Trends Selected Just For You! Handpicked Designer Brands
          Including Limited Edition Fashion Finds!
        </p>
        <button className="bg-white text-purple-500 px-6 py-2 rounded-xl text-sm font-medium">
          Explore Now
        </button>
      </div>

      {/* Categories */}
      <div className="px-4 mb-4">
        <h3 className="font-bold text-lg mb-3">Shop All</h3>
        <div className="flex justify-between">
          {["Dress", "Jeans", "Trousers", "Tops", "Bags"].map(
            (category, index) => (
              <div key={category} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-1"></div>
                <span className="text-xs text-gray-600">{category}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-4 pb-20">
        {/* Discount Section */}
        <div className="bg-gradient-to-r from-orange-400 to-yellow-500 rounded-2xl p-6 mb-4 text-white">
          <h3 className="text-xl font-bold mb-2">Discount</h3>
          <p className="text-sm mb-2">New Users Only</p>
        </div>

        {/* Product Grid */}
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-3">Trending Now</h3>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="bg-gray-100 rounded-2xl overflow-hidden"
                >
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-3">
                    <button
                      onClick={handleProductClick}
                      className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                    >
                      View Details
                    </button>
                    <p className="font-semibold">₹500 ₹1000</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3">Recently Tried</h3>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="bg-gray-100 rounded-2xl overflow-hidden"
                >
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-3">
                    <button
                      onClick={handleProductClick}
                      className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                    >
                      View Details
                    </button>
                    <p className="font-semibold">₹500 ₹1000</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3">Newest</h3>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="bg-gray-100 rounded-2xl overflow-hidden"
                >
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-3">
                    <button
                      onClick={handleProductClick}
                      className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                    >
                      View Details
                    </button>
                    <p className="font-semibold">₹500 ₹1000</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What's New Section */}
        <div className="mt-6 bg-gradient-to-r from-pink-400 to-red-500 rounded-2xl p-6 text-white text-center">
          <h3 className="font-bold text-lg mb-2">WHAT'S NEW!</h3>
          <button className="bg-white text-pink-500 px-6 py-2 rounded-xl text-sm font-medium">
            See All
          </button>
        </div>

        {/* In Offer Section */}
        <div className="mt-6">
          <h3 className="font-bold text-lg mb-3">In Offer</h3>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="bg-gray-100 rounded-2xl overflow-hidden"
              >
                <div className="h-40 bg-gray-200"></div>
                <div className="p-3">
                  <button
                    onClick={handleProductClick}
                    className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    View Details
                  </button>
                  <p className="font-semibold">₹500 ₹1000</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 lg:max-w-sm w-full bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex justify-around">
          <button className="flex flex-col items-center space-y-1">
            <Home className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <ShoppingBag className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Cart</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <MessageCircle className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Social</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <Heart className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Wishlist</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <User className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
