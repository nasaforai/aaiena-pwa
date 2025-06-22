
import React from 'react';
import { ArrowLeft, QrCode, Scan } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function ProductScan() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/fashion-lane');
  };

  const handleScan = () => {
    // Simulate scanning and redirect to product details
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
            Scan Product
          </h1>
          <p className="text-gray-600">Point your camera at the product's barcode, QR code, or RFID tag</p>
        </div>

        {/* Scanner View */}
        <div className="bg-gray-100 rounded-2xl p-8 mb-8 h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Scan className="w-12 h-12 text-purple-600" />
            </div>
            <p className="text-gray-600 mb-4">Position the product code within the frame</p>
            <div className="w-48 h-32 border-2 border-dashed border-purple-300 rounded-lg mx-auto flex items-center justify-center">
              <QrCode className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Scan Types */}
        <div className="space-y-3 mb-8">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-medium text-gray-900 mb-1">Supported Scan Types:</h3>
            <p className="text-sm text-gray-600">• Barcode</p>
            <p className="text-sm text-gray-600">• QR Code</p>
            <p className="text-sm text-gray-600">• RFID Tag</p>
          </div>
        </div>

        <Button 
          onClick={handleScan}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800"
        >
          Tap to Scan
        </Button>
      </div>
    </div>
  );
}
