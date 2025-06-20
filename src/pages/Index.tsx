
import React, { useState } from 'react';
import { SplashScreen } from '@/components/SplashScreen';
import { FashionLaneScreen } from '@/components/FashionLaneScreen';
import { WelcomeScreen } from '@/components/WelcomeScreen';

type ScreenType = 'splash' | 'fashion-lane' | 'welcome';

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');

  const handleSplashComplete = () => {
    setCurrentScreen('fashion-lane');
  };

  const handleFashionLaneContinue = () => {
    setCurrentScreen('welcome');
  };

  const handleBrowseStore = () => {
    alert('Welcome to the store! This would typically navigate to the store page.');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={handleSplashComplete} />;
      case 'fashion-lane':
        return <FashionLaneScreen onContinue={handleFashionLaneContinue} />;
      case 'welcome':
        return <WelcomeScreen onBrowseStore={handleBrowseStore} />;
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
