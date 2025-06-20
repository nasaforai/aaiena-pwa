
import React from 'react';
import { QrCode, Camera, Monitor } from 'lucide-react';

interface FashionLaneScreenProps {
  onContinue?: () => void;
}

export const FashionLaneScreen: React.FC<FashionLaneScreenProps> = ({ onContinue }) => {
  const [selectedOption, setSelectedOption] = React.useState<string>('browse');

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      console.log(`Selected option: ${selectedOption}`);
    }
  };

  return (
    <div className="bg-[#EDE1FC] flex max-w-[480px] w-full flex-col overflow-hidden mx-auto min-h-screen p-6">
      {/* H&M Logo */}
      <div className="flex justify-center mt-12 mb-16">
        <div className="text-red-600 text-4xl font-bold">H&M</div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-[#12002C] text-2xl font-bold mb-3">Pick Your Fashion Lane!</h1>
        <p className="text-gray-600 text-base">Get Started With Any One Of Them</p>
      </div>

      {/* Options */}
      <div className="flex-1 space-y-4 mb-8">
        {/* Scan The Product */}
        <div 
          className={`bg-white rounded-2xl p-6 flex items-center space-x-4 cursor-pointer transition-all ${
            selectedOption === 'scan' ? 'ring-2 ring-purple-500' : ''
          }`}
          onClick={() => setSelectedOption('scan')}
        >
          <div className="bg-purple-100 p-3 rounded-lg">
            <QrCode className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-[#12002C] text-lg font-semibold mb-1">Scan The Product</h3>
            <p className="text-gray-600 text-sm">Scan your picks to get a sneak peek before trying them on.</p>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            selectedOption === 'scan' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
          }`}>
            {selectedOption === 'scan' && <div className="w-3 h-3 bg-white rounded-full"></div>}
          </div>
        </div>

        {/* Try On Virtually */}
        <div 
          className={`bg-white rounded-2xl p-6 flex items-center space-x-4 cursor-pointer transition-all ${
            selectedOption === 'virtual' ? 'ring-2 ring-purple-500' : ''
          }`}
          onClick={() => setSelectedOption('virtual')}
        >
          <div className="bg-purple-100 p-3 rounded-lg">
            <Camera className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-[#12002C] text-lg font-semibold mb-1">Try On Virtually</h3>
            <p className="text-gray-600 text-sm">Skip the lines, try it on with just a scan.</p>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            selectedOption === 'virtual' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
          }`}>
            {selectedOption === 'virtual' && <div className="w-3 h-3 bg-white rounded-full"></div>}
          </div>
        </div>

        {/* Browse The Store */}
        <div 
          className={`bg-purple-200 rounded-2xl p-6 flex items-center space-x-4 cursor-pointer transition-all ${
            selectedOption === 'browse' ? 'ring-2 ring-purple-600' : ''
          }`}
          onClick={() => setSelectedOption('browse')}
        >
          <div className="bg-purple-300 p-3 rounded-lg">
            <Monitor className="w-6 h-6 text-purple-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-[#12002C] text-lg font-semibold mb-1">Browse The Store</h3>
            <p className="text-gray-700 text-sm">Stay updated with real-time queue tracking.</p>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            selectedOption === 'browse' ? 'border-purple-600 bg-purple-600' : 'border-gray-400'
          }`}>
            {selectedOption === 'browse' && <div className="w-3 h-3 bg-white rounded-full"></div>}
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        className="bg-[#12002C] text-white text-lg font-medium py-4 px-6 rounded-2xl flex items-center justify-center space-x-2 transition-all hover:bg-opacity-90 active:scale-95"
      >
        <span>Continue</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
