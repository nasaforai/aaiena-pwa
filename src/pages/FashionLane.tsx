import React, { useState } from "react";
import { QrCode, Camera, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FashionLane() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleContinue = () => {
    if (selectedOption === 1) {
      // Scan The Product - go to QR scan screen
      navigate("/qr-scan-product");
    } else if (selectedOption === 2) {
      // Try On Virtually - go to QR scan screen
      navigate("/qr-scan-virtual");
    } else if (selectedOption === 3) {
      navigate("/store");
    }
  };

  const options = [
    {
      id: 1,
      title: "Scan The Product",
      description: "Scan your picks to get a sneak peek before trying them on.",
      icon: QrCode,
    },
    {
      id: 2,
      title: "Try On Virtually",
      description: "Skip the lines, try it on with just a scan.",
      icon: Camera,
    },
    {
      id: 3,
      title: "Browse The Store",
      description: "Stay updated with real-time queue tracking.",
      icon: Monitor,
    },
  ];

  return (
    <div className="bg-gradient-to-t from-[#FFE3F5] to-[#E8E1FF] flex max-w-[480px] w-full flex-col overflow-hidden mx-auto min-h-screen px-6 py-8 font-roboto">
      {/* H&M Logo */}
      <div className="flex justify-center mb-8">
        <div className="text-red-600 text-4xl font-bold">H&M</div>
      </div>

      {/* Title */}
      <div className="text-left mb-12 pl-4">
        <h1 className="text-2xl text-gray-900 mb-1">Pick Your Fashion Lane!</h1>
        <p className="text-gray-600 text-lg">
          Get Started With Any One Of Them
        </p>
      </div>

      {/* Options */}
      <div className="flex-1 flex flex-col space-y-4">
        {options.map((option) => {
          const IconComponent = option.icon;
          const isSelected = selectedOption === option.id;

          return (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              className={` rounded-2xl p-6 border-2 transition-all duration-200 ${
                isSelected ? "bg-purple-300 border-purple-300" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div
                    className={`p-3 rounded-xl ${
                      isSelected ? "bg-gray-100" : ""
                    }`}
                  >
                    <IconComponent className={`w-6 h-6 text-purple-600`} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl text-gray-900 mb-1">
                      {option.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {option.description}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 border-purple-600 ${
                    isSelected ? " bg-purple-600" : ""
                  }`}
                >
                  {isSelected && (
                    <div className="w-full h-full rounded-full bg-purple-300 flex items-center justify-center">
                      <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
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
}
