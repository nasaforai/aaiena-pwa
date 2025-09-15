import React, { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, QrCode, Scan, Camera, AlertCircle, X, Home, Heart, User, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Html5Qrcode } from "html5-qrcode";
import BottomNavigation from "@/components/BottomNavigation";

export default function ProductScan() {
  const navigate = useNavigate();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    if (isScanning) {
      stopScanner();
    }
    navigate("/fashion-lane");
  };

  const stopScanner = useCallback(() => {
    console.log("Stopping QR scanner...");
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          console.log("QR scanner stopped successfully");
          scannerRef.current = null;

          // Clean up the qr-reader element
          const qrReaderElement = document.getElementById("qr-reader");
          if (qrReaderElement) {
            qrReaderElement.remove();
          }
        })
        .catch((err) => {
          console.error("Error stopping scanner:", err);
        });
    }
    setIsScanning(false);
    setIsLoading(false);
  }, []);

  const startScanner = async () => {
    try {
      console.log("Starting QR scanner...");
      setIsLoading(true);
      setError(null);

      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported on this device/browser");
      }

      // Set scanning state first to ensure DOM element exists
      setIsScanning(true);

      // Wait a bit for the DOM to update
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check if the element exists, create it if it doesn't
      let qrReaderElement = document.getElementById("qr-reader");
      if (!qrReaderElement) {
        console.log("Creating qr-reader element...");
        qrReaderElement = document.createElement("div");
        qrReaderElement.id = "qr-reader";
        qrReaderElement.className = "w-full h-full rounded-lg overflow-hidden";

        // Find the scanner container and append the element
        const scannerContainer = document.querySelector(
          ".bg-gray-100.rounded-2xl.p-4.mb-8.h-96"
        );
        if (scannerContainer) {
          scannerContainer.appendChild(qrReaderElement);
        } else {
          throw new Error("Scanner container not found");
        }
      }

      console.log("QR reader element found/created:", qrReaderElement);

      // Create scanner instance
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      // Get available cameras
      const cameras = await Html5Qrcode.getCameras();
      if (cameras && cameras.length > 0) {
        console.log("Available cameras:", cameras);

        // Use the first available camera (usually the back camera on mobile)
        const cameraId = cameras[0].id;

        // Start scanning
        await scanner.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText, decodedResult) => {
            console.log("QR Code detected:", decodedText);
            setScanResult(decodedText);

            // Stop scanning after successful detection
            setTimeout(() => {
              stopScanner();
              // Navigate to product details with the scanned data
              navigate("/product-details", {
                state: {
                  scannedData: decodedText,
                  scanType: "qr",
                },
              });
            }, 1000);
          },
          (errorMessage) => {
            // Ignore errors during scanning - they're normal
            console.log("Scan error (normal):", errorMessage);
          }
        );

        setHasPermission(true);
        setIsLoading(false);
      } else {
        throw new Error("No cameras found on this device");
      }
    } catch (error) {
      console.error("Error starting QR scanner:", error);
      setHasPermission(false);
      setIsScanning(false);
      setIsLoading(false);

      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          setError(
            "Camera access denied. Please allow camera permission and try again."
          );
        } else if (error.name === "NotFoundError") {
          setError("No camera found on this device.");
        } else if (error.name === "NotSupportedError") {
          setError("Camera not supported on this browser.");
        } else {
          setError(error.message);
        }
      } else {
        setError("Unknown camera error occurred");
      }
    }
  };

  const handleScan = () => {
    if (!isScanning && !isLoading) {
      startScanner();
    }
  };

  const handleStopScan = () => {
    if (isScanning) {
      stopScanner();
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  const renderScannerView = () => {
    if (isLoading) {
      return (
        <div className="text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <Camera className="w-12 h-12 text-blue-600" />
          </div>
          <p className="text-blue-600 mb-4">Starting QR scanner...</p>
        </div>
      );
    }

    if (error || hasPermission === false) {
      return (
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <p className="text-red-600 mb-4">{error || "Camera access denied"}</p>
          <button
            onClick={() => {
              setError(null);
              setHasPermission(null);
              startScanner();
            }}
            className="text-purple-600 text-sm underline"
          >
            Try again
          </button>
        </div>
      );
    }

    if (isScanning) {
      return (
        <div className="relative w-full h-full">
          {/* QR Scanner Container - Always render when scanning */}
          <div
            id="qr-reader"
            className="w-full h-full rounded-lg overflow-hidden"
          />

          {/* Scanning overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-purple-500 rounded-lg bg-transparent">
                <div className="w-full h-full border-2 border-dashed border-purple-300 rounded-lg animate-pulse"></div>
              </div>
            </div>

            {/* Corner indicators */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64">
              <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-purple-500 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-purple-500 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-purple-500 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-purple-500 rounded-br-lg"></div>
            </div>
          </div>

          {scanResult && (
            <div className="absolute bottom-4 left-4 right-4 bg-green-500 text-white p-3 rounded-lg text-center">
              <p className="font-medium">QR Code Detected!</p>
              <p className="text-sm opacity-90">
                Redirecting to product details...
              </p>
            </div>
          )}

          {/* Stop button */}
          <button
            onClick={handleStopScan}
            className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      );
    }

    return (
      <div className="text-center">
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
          <Scan className="w-12 h-12 text-purple-600" />
        </div>
        <p className="text-gray-600 mb-4">Tap to start QR scanning</p>
        <div className="w-48 h-48 border-2 border-dashed border-purple-300 rounded-lg mx-auto flex items-center justify-center">
          <QrCode className="w-16 h-16 text-purple-400" />
        </div>
      </div>
    );
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
        <h1 className="text-lg font-semibold text-gray-900">QR Scanner</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Scan QR Code
          </h2>
          <p className="text-gray-600">
            Point your camera at the product's QR code to get details
          </p>
        </div>

        {/* Scanner View */}
        <div className="bg-gray-100 rounded-2xl p-4 mb-8 h-96 flex items-center justify-center relative overflow-hidden">
          {renderScannerView()}
        </div>

        {/* Instructions */}
        <div className="space-y-3 mb-8">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-medium text-gray-900 mb-2">How to scan:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Ensure good lighting</li>
              <li>• Hold device steady</li>
              <li>• Center QR code in frame</li>
              <li>• Wait for automatic detection</li>
            </ul>
          </div>
        </div>

        <Button
          onClick={handleScan}
          disabled={isScanning || isLoading || scanResult !== null}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {isLoading
            ? "Starting Scanner..."
            : isScanning
            ? "Scanning..."
            : error || hasPermission === false
            ? "Try Scanner Again"
            : "Start QR Scanner"}
        </Button>

        {/* Skip & Continue Button */}
        <div className="mt-4 mb-4">
          <Button
            onClick={() => navigate("/store")}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50"
          >
            Skip & Continue
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
