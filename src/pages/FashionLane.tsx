
import React, { useState } from 'react';
import { ActionButton } from '@/components/ActionButton';
import { useNavigate } from 'react-router-dom';

export default function FashionLane() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleContinue = () => {
    navigate('/store');
  };

  const options = [
    {
      id: 'search',
      title: 'Search For a Particular Product',
      subtitle: 'From Top Fashion Brands',
      bgColor: 'bg-purple-300',
      textColor: 'text-black',
      icon: '🔍'
    },
    {
      id: 'categories',
      title: 'Shop by Categories',
      subtitle: 'From Top Fashion Brands',
      bgColor: 'bg-yellow-300',
      textColor: 'text-black',
      icon: '🏷️'
    },
    {
      id: 'style',
      title: 'Set Personal Style',
      subtitle: 'Get curated fashion just for you',
      bgColor: 'bg-pink-300',
      textColor: 'text-black',
      icon: '✨'
    },
    {
      id: 'store',
      title: 'Browse The Store',
      subtitle: 'Check out what\'s trending',
      bgColor: 'bg-blue-300',
      textColor: 'text-black',
      icon: '🏪'
    }
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-[480px] w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">Fashion Lane</h1>
          <p className="text-gray-600">Choose your shopping experience</p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              className={`w-full p-6 rounded-2xl transition-all duration-200 border-2 ${
                selectedOption === option.id
                  ? `${option.bgColor} border-purple-500 scale-105`
                  : 'bg-white border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{option.icon}</div>
                <div className="text-left flex-1">
                  <h3 className={`font-bold text-lg ${selectedOption === option.id ? option.textColor : 'text-gray-900'}`}>
                    {option.title}
                  </h3>
                  <p className={`text-sm ${selectedOption === option.id ? option.textColor : 'text-gray-600'}`}>
                    {option.subtitle}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center pt-4">
          <ActionButton onClick={handleContinue}>
            Continue
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
