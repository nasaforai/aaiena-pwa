import React, { useEffect } from "react";
import { useBrand } from "@/contexts/BrandContext";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const { currentBrand } = useBrand();

  useEffect(() => {
    localStorage.clear();
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // Show for 3 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="bg-[#EDE1FC] flex lg:lg:max-w-sm w-full flex-col items-center justify-center overflow-hidden mx-auto min-h-screen relative">
      <div className="flex flex-col items-center animate-fade-in space-y-8">
        {currentBrand?.logo_url && (
          <img
            alt={`${currentBrand.name} logo`}
            src={currentBrand.logo_url}
            className="h-16 object-contain"
          />
        )}
        <img
          alt="Welcome illustration"
          src="/lovable-uploads/dcae647b-63e9-4d29-b93f-5141d3ff852d.png"
          className="aspect-[1.99] object-contain max-w-[30vw]"
        />
        <div className="w-8 h-8 border-4 border-[#12002C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};
