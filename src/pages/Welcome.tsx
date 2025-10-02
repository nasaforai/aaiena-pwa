import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useBrand } from '@/contexts/BrandContext';

export default function Welcome() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { currentBrand } = useBrand();

  useEffect(() => {
    // Simulate loading time for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleBrowseStore = () => {
    navigate('/store');
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-t from-[#FFE3F5] to-[#E8E1FF] flex lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen px-6 py-8 items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-purple-800 text-lg font-medium">Loading Experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-t from-[#FFE3F5] to-[#E8E1FF] flex lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen px-6 py-8 font-roboto">
      {/* Brand Logo */}
      {currentBrand?.logo_url && (
        <div className="flex justify-center mb-8">
          <img src={currentBrand.logo_url} alt={`${currentBrand.name} logo`} height={54} width={82} className="object-contain" />
        </div>
      )}

      {/* Welcome Content */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        {/* Fashion Model/Animation */}
        <div className="relative mb-8">
          <div className="w-48 h-64 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-400/20 via-pink-400/15 to-purple-600/20 rounded-3xl blur-xl"></div>
            <img 
              src="/images/shopping.png" 
              alt="Fashion Model" 
              className="relative z-10 w-full h-full object-contain animate-bounce"
              style={{ animationDuration: '3s' }}
            />
          </div>
          {/* Floating Elements */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-400/40 rounded-full animate-ping"></div>
          <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-pink-400/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Welcome Text */}
        <div className="text-center space-y-4 px-4">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent">
              {currentBrand?.name || 'Fashion Lane'}
            </span>
          </h1>
          <p className="text-lg text-gray-700 font-light">
            Experience fashion in a whole new dimension
          </p>
        </div>

        {/* Call to Action Button */}
        <div className="pt-6 w-full max-w-xs">
          <Button
            onClick={handleBrowseStore}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 text-lg font-semibold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Browse the Store
          </Button>
        </div>

        {/* Hint Text */}
        <div className="pt-2">
          <p className="text-sm text-gray-500 text-center">
            Touch to continue your fashion journey
          </p>
        </div>
      </div>
    </div>
  );
}