import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "@/hooks/useNavigation";
import { Button } from "@/components/ui/button";

export default function ImageGuide() {
  const navigate = useNavigate();
  const { navigateBack } = useNavigation();

  const handleBack = () => {
    navigateBack("/photo-source");
  };

  const handleSnapIt = () => {
    navigate("/update-profile");
  };

  return (
    <div className="bg-white flex lg:lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Image Guide For Best Results
          </h1>
        </div>

        {/* Image Examples */}
        <div className="flex space-x-4 mb-8">
          <div className="flex-1">
            <div
              className="w-full h-64 rounded-2xl mb-2 relative overflow-hidden"
              style={{
                backgroundImage: `url(/images/side.png)`,
                backgroundSize: "cover",
              }}
            ></div>
          </div>
          <div className="flex-1">
            <div
              className="w-full h-64 rounded-2xl mb-2 relative overflow-hidden"
              style={{
                backgroundImage: `url(/images/back.png)`,
                backgroundSize: "cover",
              }}
            ></div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            For Best Results:
          </h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-6 h-6 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                1.
              </div>
              <span className="text-gray-700">
                Look straight at the camera.
              </span>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                2.
              </div>
              <span className="text-gray-700">Natural light works best.</span>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                3.
              </div>
              <span className="text-gray-700">
                No hats, filters, or busy backgrounds.
              </span>
            </div>
          </div>
        </div>

        {/* Snap Button */}
        <Button
          onClick={handleSnapIt}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 mb-8"
        >
          Snap It On!
        </Button>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-400 font-semibold text-lg">Aaiena</p>
        </div>
      </div>
    </div>
  );
}
