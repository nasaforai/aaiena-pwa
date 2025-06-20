
import React, { useState } from 'react';
import { Camera, QrCode, Monitor } from 'lucide-react';

interface FashionLaneScreenProps {
  onContinue?: () => void;
}

export const FashionLaneScreen: React.FC<FashionLaneScreenProps> = ({ 
  onContinue 
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const options = [
    {
      id: 1,
      title: "Scan The Product",
      description: "Scan your picks to get a sneak peek before trying them on.",
      icon: QrCode,
      bgColor: "bg-white"
    },
    {
      id: 2,
      title: "Try On Virtually",
      description: "Skip the lines, try it on with just a scan.",
      icon: Camera,
      bgColor: "bg-white"
    },
    {
      id: 3,
      title: "Browse The Store",
      description: "Stay updated with real-time queue tracking.",
      icon: Monitor,
      bgColor: "bg-[#8B5CF6]",
      isSelected: true
    }
  ];

  const handleOptionSelect = (optionId: number) => {
    setSelectedOption(optionId);
  };

  const handleContinue = () => {
    if (onContinue && selectedOption === 3) {
      onContinue();
    }
  };

  return (
    <div className="bg-[#EDE1FC] flex max-w-[480px] w-full flex-col overflow-hidden mx-auto min-h-screen relative px-6 py-8">
      {/* H&M Logo */}
      <div className="flex justify-center mb-8">
        <div className="text-red-600 text-4xl font-bold">H&M</div>
      </div>

      {/* Title */}
      <div className="text-center mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pick Your Fashion Lane!</h1>
        <p className="text-gray-600 text-lg">Get Started With Any One Of Them</p>
      </div>

      {/* Options */}
      <div className="flex-1 flex flex-col space-y-4 mt-12">
        {options.map((option) => {
          const IconComponent = option.icon;
          const isSelected = selectedOption === option.id || option.isSelected;
          
          return (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`${option.bgColor} rounded-2xl p-6 border-2 transition-all duration-200 ${
                isSelected ? 'border-purple-600' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${isSelected ? 'bg-purple-100' : 'bg-gray-100'}`}>
                    <IconComponent className={`w-6 h-6 ${isSelected ? 'text-purple-600' : 'text-gray-600'}`} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{option.title}</h3>
                    <p className="text-gray-600 text-sm">{option.description}</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 ${
                  isSelected 
                    ? 'border-purple-600 bg-purple-600' 
                    : 'border-gray-300'
                }`}>
                  {isSelected && (
                    <div className="w-full h-full rounded-full bg-purple-600 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="mt-12">
        <button
          onClick={handleContinue}
          disabled={!selectedOption}
          className="w-full bg-gray-900 text-white py-4 rounded-2xl text-xl font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Continue</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
