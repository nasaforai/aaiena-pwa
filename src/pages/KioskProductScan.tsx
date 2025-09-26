import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Scan, CheckCircle, AlertCircle, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "@/hooks/useNavigation";
import { Button } from "@/components/ui/button";
import { useProductByBarcode } from "@/hooks/useProductByBarcode";
import ProductFoundDialog from "@/components/ProductFoundDialog";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function KioskProductScan() {
  const navigate = useNavigate();
  const { navigateBack } = useNavigation();
  const { fetchProductByBarcode, loading, error } = useProductByBarcode();
  const [scannerStatus, setScannerStatus] = useState<
    "permission" | "ready" | "scanning" | "success" | "error" | "no-product"
  >("permission");
  const [scannedProduct, setScannedProduct] = useState<any>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const handleBack = () => {
    navigateBack("/fashion-lane");
  };

  const startScanner = async () => {
    try {
      // Request camera permission
      await navigator.mediaDevices.getUserMedia({ video: true });
      setPermissionGranted(true);
      setScannerStatus("ready");
      
      // Initialize scanner after permission is granted
      setTimeout(() => {
        initializeScanner();
      }, 500);
    } catch (err) {
      console.error("Camera permission denied:", err);
      setScannerStatus("error");
    }
  };

  const initializeScanner = () => {
    setScannerStatus("scanning");

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 300, height: 200 },
        aspectRatio: 1.0,
        supportedScanTypes: [0, 1], // QR Code and barcode
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        console.log("Barcode scanned:", decodedText);
        scanner.clear();
        setScannerStatus("success");
        
        // Look up product by barcode
        const product = await fetchProductByBarcode(decodedText);
        
        if (product) {
          setScannedProduct(product);
          setShowProductDialog(true);
        } else {
          setScannerStatus("no-product");
        }
      },
      (error) => {
        // Ignore scanning errors - they happen continuously while scanning
      }
    );

    scannerRef.current = scanner;
  };

  const handleProductDialogClose = () => {
    setShowProductDialog(false);
    setScannedProduct(null);
    setScannerStatus("ready");
    // Restart scanner
    setTimeout(() => {
      initializeScanner();
    }, 500);
  };

  const handleGoToProduct = () => {
    if (scannedProduct) {
      navigate(`/product-details`, { state: { product: scannedProduct } });
    }
  };

  const handleRetry = () => {
    setScannerStatus("ready");
    setScannedProduct(null);
    setTimeout(() => {
      initializeScanner();
    }, 500);
  };

  useEffect(() => {
    // Auto-start scanner when component mounts
    startScanner();

    return () => {
      // Cleanup scanner on unmount
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  const renderScannerContent = () => {
    switch (scannerStatus) {
      case "permission":
        return (
          <div className="text-center">
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Camera className="w-16 h-16 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Camera Permission Required
            </h3>
            <p className="text-gray-600 mb-4">Allow camera access to scan barcodes</p>
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2 animate-pulse"></div>
            <p className="text-sm text-blue-600">Requesting Permission</p>
          </div>
        );

      case "ready":
        return (
          <div className="text-center">
            <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Scan className="w-16 h-16 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Scanner Ready
            </h3>
            <p className="text-gray-600 mb-4">Initializing scanner...</p>
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2 animate-pulse"></div>
            <p className="text-sm text-blue-600">Preparing Scanner</p>
          </div>
        );

      case "scanning":
        return (
          <div className="text-center">
            <div id="qr-reader" className="w-full max-w-sm mx-auto mb-4"></div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Scanner Active
            </h3>
            <p className="text-gray-600 mb-4">
              Point the camera at the product barcode
            </p>
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
            <p className="text-sm text-green-600">Scanning for Barcode</p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Scan Successful!
            </h3>
            <p className="text-gray-600 mb-4">Product found and loaded</p>
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-green-600">Scan Complete</p>
          </div>
        );

      case "no-product":
        return (
          <div className="text-center">
            <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <AlertCircle className="w-16 h-16 text-yellow-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Product Not Found
            </h3>
            <p className="text-gray-600 mb-4">This barcode is not in our system</p>
            <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-yellow-600">Barcode Not Recognized</p>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <AlertCircle className="w-16 h-16 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Scanner Error
            </h3>
            <p className="text-gray-600 mb-4">
              {error || "Camera access denied or scanner failed"}
            </p>
            <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-red-600">Scanner Error</p>
          </div>
        );

      default:
        return null;
    }
  };

  const renderActionButton = () => {
    switch (scannerStatus) {
      case "success":
        return null; // Product dialog handles actions
      case "no-product":
      case "error":
        return (
          <Button
            onClick={handleRetry}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800"
          >
            Try Again
          </Button>
        );
      case "permission":
        return (
          <Button
            onClick={startScanner}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800"
          >
            Grant Camera Permission
          </Button>
        );
      default:
        return (
          <Button
            disabled
            className="w-full bg-gray-400 text-white py-3 rounded-xl font-medium opacity-50"
          >
            {scannerStatus === "ready" ? "Initializing..." : "Scanning..."}
          </Button>
        );
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
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Scan Product Barcode
          </h1>
          <p className="text-gray-600">
            Point the camera at the product barcode to scan
          </p>
        </div>

        {/* Scanner Area */}
        <div className="bg-purple-50 rounded-2xl p-8 mb-8 min-h-96 flex items-center justify-center">
          {renderScannerContent()}
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8">
          <h3 className="font-medium text-gray-900 mb-2">Instructions:</h3>
          <p className="text-sm text-gray-600 mb-1">
            1. Allow camera permission when prompted
          </p>
          <p className="text-sm text-gray-600 mb-1">
            2. Point the camera at the product barcode
          </p>
          <p className="text-sm text-gray-600">3. Hold steady until scan completes</p>
        </div>

        {renderActionButton()}
      </div>

      {/* Product Found Dialog */}
      <ProductFoundDialog
        open={showProductDialog}
        product={scannedProduct}
        onClose={handleProductDialogClose}
        onGoToProduct={handleGoToProduct}
      />
    </div>
  );
}
