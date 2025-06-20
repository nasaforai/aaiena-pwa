import React from 'react';
import { ArrowLeft, Search, ShoppingBag, User, Heart } from 'lucide-react';

interface StoreScreenProps {
  onBack?: () => void;
}

export const StoreScreen: React.FC<StoreScreenProps> = ({ onBack }) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const products = [
    {
      id: 1,
      name: "Striped Long Sleeve",
      price: "$29.99",
      image: "/lovable-uploads/c65964eb-6d55-487b-a6fd-5b106701377c.png",
      isLiked: false
    },
    {
      id: 2,
      name: "Classic White Tee",
      price: "$19.99",
      image: "/lovable-uploads/c65964eb-6d55-487b-a6fd-5b106701377c.png",
      isLiked: true
    },
    {
      id: 3,
      name: "Denim Jacket",
      price: "$59.99",
      image: "/lovable-uploads/c65964eb-6d55-487b-a6fd-5b106701377c.png",
      isLiked: false
    },
    {
      id: 4,
      name: "Summer Dress",
      price: "$39.99",
      image: "/lovable-uploads/c65964eb-6d55-487b-a6fd-5b106701377c.png",
      isLiked: true
    }
  ];

  return (
    <div className="bg-white flex max-w-[480px] w-full flex-col overflow-hidden mx-auto min-h-screen">
      {/* Header with back button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button 
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Store</h1>
        <div className="w-10 h-10" /> {/* Spacer for alignment */}
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-6">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {['All', 'Tops', 'Bottoms', 'Dresses', 'Accessories'].map((category) => (
            <button
              key={category}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === 'All' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 px-4 pb-20">
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm">
                  <Heart className={`w-4 h-4 ${product.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-900 text-sm mb-1">{product.name}</h3>
                <p className="text-purple-600 font-semibold">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-[480px] w-full bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex justify-around">
          <button className="flex flex-col items-center space-y-1">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Search className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs text-purple-600 font-medium">Browse</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <div className="p-2 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-xs text-gray-400">Cart</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <div className="p-2 rounded-lg">
              <Heart className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-xs text-gray-400">Wishlist</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <div className="p-2 rounded-lg">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-xs text-gray-400">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
