import React, { useState } from "react";
import { ArrowLeft, Monitor, Smartphone, ArrowRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileSignupQRDialog from "@/components/MobileSignupQRDialog";

export default function SignupOptions() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const isMobile = useIsMobile();
  const [showMobileQR, setShowMobileQR] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleKioskSignup = () => {
    // Navigate to kiosk-specific signup flow
    navigate("/device-connect-flow");
  };

  const handleMobileSignup = () => {
    // If on mobile and has session_id, navigate to signup directly
    if (isMobile && sessionId) {
      navigate(`/sign-up?session_id=${sessionId}`);
    } else {
      // Show QR code popup for kiosk signup
      setShowMobileQR(true);
    }
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
            Choose Your Method
          </h2>
          <p className="text-gray-600">
            Select how you'd like to proceed
          </p>
        </div>

        {/* Signup Options */}
        <div className="space-y-6">
          {/* Kiosk Signup Section - Hide on mobile */}
          {!isMobile && (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <Monitor className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Signup using Kiosk
                  </h3>
                </div>
              </div>
              <Button
                onClick={handleKioskSignup}
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 flex items-center justify-center gap-2"
              >
                Connect to Kiosk
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Mobile Phone Signup Section */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Signup using Mobile Device
                </h3>
              </div>
            </div>
            <Button
              onClick={handleMobileSignup}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              {isMobile ? "Sign Up" : "Sign Up with Mobile"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          {/* Sign In Section for existing users */}
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Already have an account?</p>
            <button
              onClick={() => navigate(sessionId ? `/sign-in?session_id=${sessionId}` : "/sign-in")}
              className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              Sign In Here
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Signup QR Dialog */}
      <MobileSignupQRDialog 
        open={showMobileQR} 
        onClose={() => setShowMobileQR(false)} 
      />
    </div>
  );
}