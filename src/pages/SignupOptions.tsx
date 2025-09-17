import React from "react";
import { ArrowLeft, Monitor, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";

export default function SignupOptions() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleKioskSignup = () => {
    // Navigate to kiosk-specific signup flow
    navigate("/device-connect-flow");
  };

  const handleMobileSignup = () => {
    // Navigate to mobile signup
    navigate("/sign-up");
  };

  return (
    <div className="bg-white flex lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Sign Up Options</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        {/* H&M Logo */}
        <div className="flex justify-center mb-8">
          <img src="/images/hm.png" alt="h&m logo" width={82} height={54} />
        </div>

        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Choose Your Signup Method
          </h2>
          <p className="text-gray-600">
            Select how you'd like to create your account
          </p>
        </div>

        {/* Signup Options */}
        <div className="space-y-6">
          {/* Kiosk Signup Section */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <Monitor className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Signup using Kiosk
                </h3>
                <p className="text-sm text-gray-600">
                  Quick setup with in-store device
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-6 text-sm">
              Connect to our in-store kiosk for a seamless signup experience with instant measurements and personalized recommendations.
            </p>
            <Button
              onClick={handleKioskSignup}
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700"
            >
              Connect to Kiosk
            </Button>
          </div>

          {/* Mobile Phone Signup Section */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Signup using Mobile Phone
                </h3>
                <p className="text-sm text-gray-600">
                  Traditional mobile registration
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-6 text-sm">
              Create your account using your mobile device with email, phone number, or social media accounts.
            </p>
            <Button
              onClick={handleMobileSignup}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700"
            >
              Sign Up with Mobile
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Both methods provide full access to all features including virtual try-on, personalized recommendations, and exclusive offers.
          </p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}