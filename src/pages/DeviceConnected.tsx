import React from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function DeviceConnected() {
  const navigate = useNavigate();

  const handleContinueOnMobile = () => {
    // This would typically redirect to the virtual try-on experience
    localStorage.setItem("isLoggedIn", "true");
    navigate("/store");
  };

  const handleStickWithKiosk = () => {
    localStorage.setItem("isLoggedIn", "true");
    navigate("/store");
  };

  return (
    <div className="bg-white flex lg:lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-between px-6 py-8">
        <div className="flex flex-col items-center justify-center mt-20">
          <img
            src="/icons/success.svg"
            alt="success icon"
            width={55}
            height={55}
            className="mb-4"
          />

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Device Connected!
          </h1>
          <p className="text-gray-600 text-center mb-12">
            Continue Your Experience Seamlessly
          </p>
        </div>

        {/* Options */}
        <div className="w-full bg-purple-100 rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-6 text-center">
            Where Would You Like To Pick Up From?
          </h3>

          <div className="space-y-3">
            <Button
              onClick={handleContinueOnMobile}
              className="w-full bg-gray-900 text-white py-6 rounded-xl font-medium hover:bg-gray-800"
            >
              Continue On Mobile
            </Button>
            <button
              onClick={handleStickWithKiosk}
              className="w-full text-gray-600 py-2 font-medium"
            >
              Stick With Aaiena Kiosk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
