
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, QrCode, Scan, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function ProductScan() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleBack = () => {
    navigate('/fashion-lane');
  };

  const startCamera = async () => {
    try {
      console.log('Requesting camera access...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      console.log('Camera access granted, starting video...');
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log('Video playing successfully');
                setIsScanning(true);
                setHasPermission(true);
              })
              .catch((error) => {
                console.error('Error playing video:', error);
                setHasPermission(false);
              });
          }
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    if (stream) {
      stream.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind);
        track.stop();
      });
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const simulateScan = () => {
    console.log('Simulating scan...');
    // Simulate successful scan
    setScanResult('PRODUCT_12345');
    setTimeout(() => {
      stopCamera();
      navigate('/product-details');
    }, 1500);
  };

  useEffect(() => {
    return () => {
      stopCamera(); // Cleanup on unmount
    };
  }, []);

  const handleScan = () => {
    if (!isScanning) {
      startCamera();
    } else {
      simulateScan();
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
            Scan Product
          </h1>
          <p className="text-gray-600">Point your camera at the product's barcode, QR code, or RFID tag</p>
        </div>

        {/* Camera/Scanner View */}
        <div className="bg-gray-100 rounded-2xl p-4 mb-8 h-96 flex items-center justify-center relative overflow-hidden">
          {isScanning ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                className="w-full h-full object-cover rounded-lg"
                playsInline
                muted
                autoPlay
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-32 border-2 border-purple-500 rounded-lg bg-transparent">
                  <div className="w-full h-full border-2 border-dashed border-purple-300 rounded-lg animate-pulse"></div>
                </div>
              </div>
              
              {scanResult && (
                <div className="absolute bottom-4 left-4 right-4 bg-green-500 text-white p-3 rounded-lg text-center">
                  <p className="font-medium">Product Found!</p>
                  <p className="text-sm opacity-90">Redirecting to product details...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                {hasPermission === false ? (
                  <Camera className="w-12 h-12 text-red-500" />
                ) : (
                  <Scan className="w-12 h-12 text-purple-600" />
                )}
              </div>
              {hasPermission === false ? (
                <div>
                  <p className="text-red-600 mb-4">Camera access denied</p>
                  <p className="text-gray-600 text-sm mb-4">Please allow camera access to scan products</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-purple-600 text-sm underline"
                  >
                    Refresh and try again
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">Tap to start scanning</p>
                  <div className="w-48 h-32 border-2 border-dashed border-purple-300 rounded-lg mx-auto flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
              )}
            </div>
          )}
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
          disabled={scanResult !== null || hasPermission === false}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {isScanning ? 'Tap to Scan' : hasPermission === false ? 'Camera Access Denied' : 'Start Camera'}
        </Button>
      </div>
    </div>
  );
}
