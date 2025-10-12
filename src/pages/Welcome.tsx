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
    <div className="relative flex lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen font-roboto">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/virtual-screen.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen px-6 py-8">
        {/* Brand Logo */}
        {currentBrand?.logo_url && (
          <div className="flex justify-center mb-8">
            <img src={currentBrand.logo_url} alt={`${currentBrand.name} logo`} height={54} width={82} className="object-contain drop-shadow-lg" />
          </div>
        )}

        {/* Welcome Content */}
        <div className="flex-1"></div>

        {/* Bottom Content */}
        <div className="space-y-4 pb-8">
          {/* Call to Action Button */}
          <div className="w-full max-w-xs mx-auto">
            <Button
              onClick={handleBrowseStore}
              className="w-full bg-transparent border-2 border-white text-white hover:bg-white/20 py-4 text-lg font-semibold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Browse the Store
            </Button>
          </div>

          {/* Hint Text */}
          <div>
            <p className="text-sm text-white/80 text-center drop-shadow-md">
              Touch to continue your fashion journey
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}