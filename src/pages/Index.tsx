
import React, { useState } from 'react';
import { SplashScreen } from '@/components/SplashScreen';
import { FashionLaneScreen } from '@/components/FashionLaneScreen';
import { StoreScreen } from '@/components/StoreScreen';
import { ProductDetailsScreen } from '@/components/ProductDetailsScreen';

type ScreenType = 'splash' | 'fashion-lane' | 'store' | 'product-details';

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');

  const handleSplashComplete = () => {
    setCurrentScreen('fashion-lane');
  };

  const handleFashionLaneContinue = () => {
    setCurrentScreen('store');
  };

  const handleBackToFashionLane = () => {
    setCurrentScreen('fashion-lane');
  };

  const handleProductDetails = () => {
    setCurrentScreen('product-details');
  };

  const handleBackToStore = () => {
    setCurrentScreen('store');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={handleSplashComplete} />;
      case 'fashion-lane':
        return <FashionLaneScreen onContinue={handleFashionLaneContinue} />;
      case 'store':
        return <StoreScreen onBack={handleBackToFashionLane} onProductSelect={handleProductDetails} />;
      case 'product-details':
        return <ProductDetailsScreen onBack={handleBackToStore} />;
      default:
        return <SplashScreen onComplete={handleSplashComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {renderScreen()}
    </div>
  );
}
