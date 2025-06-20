
import React from 'react';
import { StatusBar } from './StatusBar';
import { WelcomeHero } from './WelcomeHero';
import { PWAInstallPrompt } from './PWAInstallPrompt';

interface WelcomeScreenProps {
  onBrowseStore?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onBrowseStore
}) => {
  const handleBrowseStore = () => {
    if (onBrowseStore) {
      onBrowseStore();
    } else {
      // Default behavior - could integrate with router
      alert('Welcome! Redirecting to store...');
    }
  };

  return (
    <div
      role="application"
      aria-label="Welcome screen for guest users"
      className="bg-[#EDE1FC] flex max-w-[480px] w-full flex-col items-center justify-center overflow-hidden items-center mx-auto min-h-screen relative"
    >
      {/* <StatusBar /> */}
      <WelcomeHero onButtonClick={handleBrowseStore} />
      <PWAInstallPrompt />
    </div>
  );
};
