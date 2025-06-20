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
  return <main className="flex flex-col items-center" role="main">
      <section className="flex flex-col items-center">
        <img alt="Welcome illustration" className="aspect-[1.99] object-contain w-[175px] max-w-full mt-[145px]" src="/lovable-uploads/dcae647b-63e9-4d29-b93f-5141d3ff852d.png" />
        <h1 className="text-[rgba(18,0,44,1)] text-2xl font-normal leading-none mt-[25px]">
          {title}
        </h1>
        <div className="mt-4">
          <ActionButton onClick={handleButtonClick}>
            {buttonText}
          </ActionButton>
        </div>
      </section>
    </main>;
};