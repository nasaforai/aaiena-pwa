
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Scan, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function KioskProductScan() {
  const navigate = useNavigate();
  const [scannerStatus, setScannerStatus] = useState<'ready' | 'scanning' | 'success' | 'error'>('ready');
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const handleBack = () => {
    navigate('/fashion-lane');
  };

  const initializeScanner = () => {
    setScannerStatus('scanning');
    
    // Simulate scanner initialization and listening
    console.log('Initializing kiosk scanner...');
    
    // Simulate waiting for scan input
    setTimeout(() => {
      // Simulate successful scan after 3 seconds
      setScanResult('PRODUCT_12345');
      setScannerStatus('success');
      
      // Start countdown to product details
      let count = 3;
      setCountdown(count);
      
      const countdownInterval = setInterval(() => {
        count--;
        setCountdown(count);
        
        if (count === 0) {
          clearInterval(countdownInterval);
          navigate('/product-details');
        }
      }, 1000);
    }, 3000);
  };

  const handleScanComplete = () => {
    navigate('/product-details');
  };

  const handleRetry = () => {
    setScannerStatus('ready');
    setScanResult(null);
    setCountdown(null);
  };

  useEffect(() => {
    // Auto-initialize scanner when component mounts
    const timer = setTimeout(() => {
      initializeScanner();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const renderScannerContent = () => {
    switch (scannerStatus) {
      case 'ready':
        return (
          <div className="text-center">
            <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Scan className="w-16 h-16 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Scanner Ready</h3>
            <p className="text-gray-600 mb-4">Initializing scanner...</p>
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2 animate-pulse"></div>
            <p className="text-sm text-blue-600">Preparing Scanner</p>
          </div>
        );

      case 'scanning':
        return (
          <div className="text-center">
            <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse">
              <Scan className="w-16 h-16 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Scanner Active</h3>
            <p className="text-gray-600 mb-4">Hold the product near the scanner</p>
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
            <p className="text-sm text-green-600">Listening for Product</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Scan Successful!</h3>
            <p className="text-gray-600 mb-4">Product found: {scanResult}</p>
            {countdown && (
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <p className="text-green-700 font-medium">Redirecting in {countdown} seconds...</p>
              </div>
            )}
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-green-600">Scan Complete</p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <AlertCircle className="w-16 h-16 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Scan Failed</h3>
            <p className="text-gray-600 mb-4">Please try scanning again</p>
            <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-red-600">Scanner Error</p>
          </div>
        );

      default:
        return null;
    }
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
          {renderScannerContent()}
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8">
          <h3 className="font-medium text-gray-900 mb-2">Instructions:</h3>
          <p className="text-sm text-gray-600 mb-1">1. Hold the product steady</p>
          <p className="text-sm text-gray-600 mb-1">2. Position the barcode/tag towards the scanner</p>
          <p className="text-sm text-gray-600">3. Wait for the beep sound</p>
        </div>

        {scannerStatus === 'success' ? (
          <Button 
            onClick={handleScanComplete}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800"
          >
            View Product Details
          </Button>
        ) : scannerStatus === 'error' ? (
          <Button 
            onClick={handleRetry}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800"
          >
            Try Again
          </Button>
        ) : (
          <Button 
            disabled
            className="w-full bg-gray-400 text-white py-3 rounded-xl font-medium opacity-50"
          >
            {scannerStatus === 'ready' ? 'Initializing...' : 'Scanning...'}
          </Button>
        )}
      </div>
    </div>
  );
}
