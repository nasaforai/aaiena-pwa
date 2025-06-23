import React, { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, QrCode, Scan, Camera, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ProductScan() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    navigate("/fashion-lane");
  };

  const stopCamera = useCallback(() => {
    console.log("Stopping camera...");
    if (stream) {
      stream.getTracks().forEach((track) => {
        console.log("Stopping track:", track.kind, track.readyState);
        track.stop();
      });
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
    setIsLoading(false);
  }, [stream]);

  const startCamera = async () => {
    try {
      console.log("Requesting camera access...");
      setIsLoading(true);
      setError(null);

      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported on this device/browser");
      }

      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
        },
        audio: false,
      };

      console.log("Getting user media with constraints:", constraints);
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );

      console.log("Media stream obtained:", mediaStream);
      console.log("Video tracks:", mediaStream.getVideoTracks());

      setStream(mediaStream);
      setHasPermission(true);

      if (videoRef.current) {
        console.log("Setting video source...");
        videoRef.current.srcObject = mediaStream;

        // Add event listeners
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded");
          console.log(
            "Video dimensions:",
            videoRef.current?.videoWidth,
            "x",
            videoRef.current?.videoHeight
          );
        };

        videoRef.current.oncanplay = () => {
          console.log("Video can play");
          if (videoRef.current) {
            videoRef.current
              .play()
              .then(() => {
                console.log("Video playing successfully");
                setIsScanning(true);
                setIsLoading(false);
              })
              .catch((playError) => {
                console.error("Error playing video:", playError);
                setError("Failed to start video playback");
                setIsLoading(false);
              });
          }
        };

        videoRef.current.onerror = (e) => {
          console.error("Video error:", e);
          setError("Video playback error");
          setIsLoading(false);
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasPermission(false);
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

  const simulateScan = () => {
    console.log("Simulating scan...");
    setScanResult("PRODUCT_12345");
    setTimeout(() => {
      stopCamera();
      navigate("/product-details");
    }, 1500);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleScan = () => {
    if (!isScanning && !isLoading) {
      startCamera();
    } else if (isScanning) {
      simulateScan();
    }
  };

  const renderCameraView = () => {
    if (isLoading) {
      return (
        <div className="text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <Camera className="w-12 h-12 text-blue-600" />
          </div>
          <p className="text-blue-600 mb-4">Starting camera...</p>
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
              startCamera();
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
          <video
            ref={videoRef}
            className="w-full h-full object-cover rounded-lg"
            playsInline
            muted
            autoPlay
            style={{ transform: "scaleX(-1)" }}
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Scanning overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-32 border-2 border-purple-500 rounded-lg bg-transparent">
              <div className="w-full h-full border-2 border-dashed border-purple-300 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {scanResult && (
            <div className="absolute bottom-4 left-4 right-4 bg-green-500 text-white p-3 rounded-lg text-center">
              <p className="font-medium">Product Found!</p>
              <p className="text-sm opacity-90">
                Redirecting to product details...
              </p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="text-center">
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
          <Scan className="w-12 h-12 text-purple-600" />
        </div>
        <p className="text-gray-600 mb-4">Tap to start scanning</p>
        <div className="w-48 h-32 border-2 border-dashed border-purple-300 rounded-lg mx-auto flex items-center justify-center">
          <QrCode className="w-8 h-8 text-purple-400" />
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
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Scan Product
          </h1>
          <p className="text-gray-600">
            Point your camera at the product's barcode, QR code, or RFID tag
          </p>
        </div>

        {/* Camera/Scanner View */}
        <div className="bg-gray-100 rounded-2xl p-4 mb-8 h-96 flex items-center justify-center relative overflow-hidden">
          {renderCameraView()}
        </div>

        {/* Scan Types */}
        <div className="space-y-3 mb-8">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-medium text-gray-900 mb-1">
              Supported Scan Types:
            </h3>
            <p className="text-sm text-gray-600">• Barcode</p>
            <p className="text-sm text-gray-600">• QR Code</p>
            <p className="text-sm text-gray-600">• RFID Tag</p>
          </div>
        </div>

        <Button
          onClick={handleScan}
          disabled={scanResult !== null || isLoading}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {isLoading
            ? "Starting Camera..."
            : isScanning
            ? "Tap to Scan"
            : error || hasPermission === false
            ? "Try Camera Again"
            : "Start Camera"}
        </Button>
      </div>
    </div>
  );
}
