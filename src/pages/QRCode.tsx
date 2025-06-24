import React from "react";
import { ArrowLeft, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function QRCode() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/waiting-room");
  };

  const handleContinue = () => {
    navigate("/sign-in");
  };

  const handleBackToPhysical = () => {
    navigate("/waiting-room");
  };

  const copyCode = () => {
    try {
      navigator.clipboard.writeText("TSRO - 23UH489");
      toast.success("Code Copied Successfully");
    } catch (error) {
      console.log(error);
    }
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Scan QR Or Enter This Code On Your Phone To Continue Shopping.
          </h1>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <span className="text-gray-900">Scan</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <span className="text-gray-900">Connect</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            <span className="text-gray-900">Continue shopping</span>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="border border-gray-200 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-center mb-2">Scan QR Code</h3>
          <p className="text-sm text-gray-600 text-center mb-4">
            Use your phone camera to scan
          </p>

          <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center">
            <img
              src="/images/qr-code.png"
              alt="qrcode"
              width={145}
              height={145}
            />
          </div>

          <p className="text-xs text-gray-500 text-center">
            Position the QR code within the frame
          </p>
        </div>

        {/* Code Section */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 text-center mb-4">
            Copy The Code To Continue In Kiosk
          </p>
          <div className="bg-purple-100 rounded-xl p-4 flex items-center justify-between">
            <span className="font-mono text-lg font-bold text-center flex-1">
              TSRO - 23UH489
            </span>
            <button
              onClick={copyCode}
              className="p-2 hover:bg-purple-200 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Valid Till One Day
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleContinue}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800"
          >
            Continue
          </Button>
          <button
            onClick={handleBackToPhysical}
            className="w-full border border-gray-500 rounded-xl text-gray-600 py-2 font-medium"
          >
            Back To Physical Try-On
          </button>
        </div>
      </div>
    </div>
  );
}
