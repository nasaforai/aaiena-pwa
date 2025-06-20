
import React from 'react';
import { StatusBar } from './StatusBar';
import { WelcomeHero } from './WelcomeHero';
import { PWAInstallPrompt } from './PWAInstallPrompt';

interface WelcomeScreenProps {
  onBrowseStore?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onBrowseStore }) => {
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
      className="bg-[#EDE1FC] flex max-w-[480px] w-full flex-col overflow-hidden items-center mx-auto pb-[415px] min-h-screen relative"
      role="application"
      aria-label="Welcome screen for guest users"
    >
      {/* <StatusBar /> */}
      <WelcomeHero 
        title="Guest user flow"
        buttonText="Browse the store"
        onButtonClick={handleBrowseStore}
      />
      <PWAInstallPrompt />
    </div>
  );
};
