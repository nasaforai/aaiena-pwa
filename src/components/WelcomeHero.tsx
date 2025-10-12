
import React from 'react';
import { ActionButton } from './ActionButton';

interface WelcomeHeroProps {
  title?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  title = "Guest user flow",
  buttonText = "Browse the store",
  onButtonClick
}) => {
  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      // Default action - could navigate to store
      console.log('Navigating to store...');
    }
  };

  return (
    <main className="flex flex-col items-center" role="main">
      <section className="flex flex-col items-center justify-center">
        <img
          alt="Welcome illustration"
          src="/lovable-uploads/dcae647b-63e9-4d29-b93f-5141d3ff852d.png"
          className="aspect-[1.99] object-contain max-w-[30vw]"
        />
      </section>
      <ActionButton onClick={handleButtonClick}>
        {buttonText}
      </ActionButton>
    </main>
  );
};
