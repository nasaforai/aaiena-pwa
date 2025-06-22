
import React from 'react';
import { ArrowLeft, Scan } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function KioskProductScan() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/fashion-lane');
  };

  const handleScanComplete = () => {
    // Simulate scanning completion and redirect to product details
    navigate('/product-details');
  };

  return (
    <div className="bg-white flex max-w-[480px] w-full flex-col overflow-hidden mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Scan Product with Kiosk Scanner
          </h1>
          <p className="text-gray-600">Use the kiosk scanner to scan the product</p>
        </div>

        {/* Scanner Animation */}
        <div className="bg-purple-50 rounded-2xl p-8 mb-8 h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse">
              <Scan className="w-16 h-16 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Scanner Ready</h3>
            <p className="text-gray-600 mb-4">Hold the product near the scanner</p>
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-green-600">Scanner Active</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8">
          <h3 className="font-medium text-gray-900 mb-2">Instructions:</h3>
          <p className="text-sm text-gray-600 mb-1">1. Hold the product steady</p>
          <p className="text-sm text-gray-600 mb-1">2. Position the barcode/tag towards the scanner</p>
          <p className="text-sm text-gray-600">3. Wait for the beep sound</p>
        </div>

        <Button 
          onClick={handleScanComplete}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800"
        >
          Simulate Scan Complete
        </Button>
      </div>
    </div>
  );
}
