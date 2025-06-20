
import React from 'react';

interface FashionLaneScreenProps {
  onContinue?: () => void;
  onBrowseStore?: () => void;
}

export const FashionLaneScreen: React.FC<FashionLaneScreenProps> = ({ 
  onContinue, 
  onBrowseStore 
}) => {
  const handleBrowseStore = () => {
    if (onBrowseStore) {
      onBrowseStore();
    }
  };

  return (
    <div className="bg-[#EDE1FC] flex max-w-[480px] w-full flex-col items-center justify-center overflow-hidden mx-auto min-h-screen relative">
      <div className="flex flex-col items-center justify-center">
        <img
          alt="Fashion Lane illustration"
          src="/lovable-uploads/dcae647b-63e9-4d29-b93f-5141d3ff852d.png"
          className="aspect-[1.99] object-contain max-w-[30vw] mb-8"
        />
        
        <div className="flex flex-col space-y-4">
          <button className="bg-[rgba(222,196,255,1)] border w-[196px] text-xl text-[rgba(18,0,44,1)] font-medium leading-loose px-[19px] py-[9px] rounded-lg border-[rgba(207,169,255,1)] border-solid transition-all duration-200 hover:bg-[rgba(207,169,255,1)]">
            Option 1
          </button>
          <button className="bg-[rgba(222,196,255,1)] border w-[196px] text-xl text-[rgba(18,0,44,1)] font-medium leading-loose px-[19px] py-[9px] rounded-lg border-[rgba(207,169,255,1)] border-solid transition-all duration-200 hover:bg-[rgba(207,169,255,1)]">
            Option 2
          </button>
          <button className="bg-[rgba(222,196,255,1)] border w-[196px] text-xl text-[rgba(18,0,44,1)] font-medium leading-loose px-[19px] py-[9px] rounded-lg border-[rgba(207,169,255,1)] border-solid transition-all duration-200 hover:bg-[rgba(207,169,255,1)]">
            Option 3
          </button>
          <button 
            onClick={handleBrowseStore}
            className="bg-[rgba(222,196,255,1)] border w-[196px] text-xl text-[rgba(18,0,44,1)] font-medium leading-loose px-[19px] py-[9px] rounded-lg border-[rgba(207,169,255,1)] border-solid transition-all duration-200 hover:bg-[rgba(207,169,255,1)]"
          >
            Browse Store
          </button>
        </div>
      </div>
    </div>
  );
};
