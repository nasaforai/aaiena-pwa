
import React, { useState } from 'react';
import { SplashScreen } from '@/components/SplashScreen';
import { FashionLaneScreen } from '@/components/FashionLaneScreen';
import { StoreScreen } from '@/components/StoreScreen';

type ScreenType = 'splash' | 'fashion-lane' | 'store';

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');

  const handleSplashComplete = () => {
    setCurrentScreen('fashion-lane');
  };

  const handleBrowseStore = () => {
    setCurrentScreen('store');
  };

  const handleBackToFashionLane = () => {
    setCurrentScreen('fashion-lane');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={handleSplashComplete} />;
      case 'fashion-lane':
        return <FashionLaneScreen onBrowseStore={handleBrowseStore} />;
      case 'store':
        return <StoreScreen onBack={handleBackToFashionLane} />;
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
