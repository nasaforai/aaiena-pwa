import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function MeasurementProfile() {
  const navigate = useNavigate();

  const handleContinue = () => {
    localStorage.setItem("hasMeasurements", "true");
    navigate("/photo-source");
  };

  const handleNoThanks = () => {
    localStorage.setItem("hasMeasurements", "false");
    localStorage.setItem("isLoggedIn", "true");
    navigate("/store");
  };

  return (
    <div className="bg-gradient-to-b from-blue-400 to-purple-600 flex lg:lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen relative">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-6 w-full lg:max-w-sm">
          {/* Purple gradient placeholder */}
          <div className="w-full h-32 bg-gradient-to-r from-purple-300 to-pink-300 rounded-xl mb-6"></div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Provide your precise measurements before proceeding.
          </h2>

          <div className="space-y-3">
            <Button
              onClick={handleContinue}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800"
            >
              Continue To Set Your Profile
            </Button>
            <button
              onClick={handleNoThanks}
              className="w-full text-gray-600 py-2 font-medium"
            >
              No Thanks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
