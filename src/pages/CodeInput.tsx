import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CodeInput() {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState("");

  const isProductScan = location.state?.isProductScan;

  const handleBack = () => {
    navigate("/fashion-lane");
  };

  const handleContinue = () => {
    if (code.trim()) {
      if (isProductScan) {
        navigate("/product-details");
      } else {
        navigate("/sign-in");
      }
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
            Enter Code To Continue
          </h1>
          <p className="text-gray-600">
            Enter the code from your mobile device
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code
            </label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full text-center text-lg font-mono"
              placeholder="TSRO - 23UH489"
            />
          </div>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!code.trim()}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
