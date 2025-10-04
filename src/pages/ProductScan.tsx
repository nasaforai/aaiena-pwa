import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { ArrowLeft, Camera, X } from 'lucide-react';
import { useNavigation } from "@/hooks/useNavigation";
import { useProductByBarcode } from "@/hooks/useProductByBarcode";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import BottomNavigation from "@/components/BottomNavigation";
import ProductFoundDialog from "@/components/ProductFoundDialog";
import Topbar from "@/components/ui/topbar";

export default function ProductScan() {
  const navigate = useNavigate();
  const { navigateBack } = useNavigation();
  const { fetchProductByBarcode, loading: productLoading, error: productError } = useProductByBarcode();
  
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanResult, setScanResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [foundProduct, setFoundProduct] = useState<any>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);

  const handleBack = () => {
    if (isScanning) {
      stopScanner();
    }
    navigateBack('/fashion-lane');
  };

  const stopScanner = useCallback(() => {
    console.log('Stopping barcode scanner...');
    const html5QrCode = Html5Qrcode.getCameras().then(() => {
      const scannerElement = document.getElementById('qr-reader');
      if (scannerElement) {
        try {
          const scanner = new Html5Qrcode("qr-reader");
          scanner.stop().then(() => {
            console.log('Scanner stopped successfully');
            scannerElement.remove();
          }).catch(err => console.error('Error stopping scanner:', err));
        } catch (err) {
          console.error('Scanner cleanup error:', err);
        }
      }
    });
    
    setIsScanning(false);
    setIsLoading(false);
    setError('');
  }, []);

  const startScanner = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setScanResult('');

    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);

      // Create scanner element if it doesn't exist
      let scannerElement = document.getElementById('qr-reader');
      if (!scannerElement) {
        scannerElement = document.createElement('div');
        scannerElement.id = 'qr-reader';
        scannerElement.style.width = '100%';
        scannerElement.style.maxWidth = '400px';
        scannerElement.style.margin = '0 auto';
        
        const container = document.querySelector('.scanner-container');
        if (container) {
          container.appendChild(scannerElement);
        }
      }

      // Clear any existing content
      scannerElement.innerHTML = '';

      // Initialize scanner with barcode format support
      const html5QrCode = new Html5Qrcode("qr-reader");
      
      // Get available cameras
      const cameras = await Html5Qrcode.getCameras();
      if (cameras.length === 0) {
        throw new Error('No cameras found');
      }

      // Prefer back camera if available
      const backCamera = cameras.find(camera => 
        camera.label.toLowerCase().includes('back') || 
        camera.label.toLowerCase().includes('rear')
      );
      const cameraId = backCamera ? backCamera.id : cameras[0].id;

      const config = {
        fps: 10,
        qrbox: { width: 280, height: 160 }, // Adjusted for barcode scanning
        aspectRatio: 1.0,
        formatsToSupport: [
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.QR_CODE // Keep QR support as fallback
        ]
      };

      await html5QrCode.start(
        cameraId,
        config,
        async (decodedText, decodedResult) => {
          console.log("Barcode scan successful:", decodedText);
          setScanResult(decodedText);
          
          // Stop scanner first
          await html5QrCode.stop();
          setIsScanning(false);
          
          // Look up product by barcode
          const product = await fetchProductByBarcode(decodedText);
          
          if (product) {
            setFoundProduct(product);
            setShowProductDialog(true);
            toast.success("Product found!");
          } else {
            toast.error(productError || "Product not found for this barcode");
          }
        },
        (errorMessage) => {
          // Handle scan failures silently
          console.log("Scan failed:", errorMessage);
        }
      );

      setIsScanning(true);
      
    } catch (err: any) {
      console.error('Scanner error:', err);
      let errorMessage = 'Failed to start camera';
      
      if (err.name === 'NotAllowedError' || err.message.includes('Permission denied')) {
        errorMessage = 'Camera permission denied. Please allow camera access and try again.';
        setHasPermission(false);
      } else if (err.name === 'NotFoundError' || err.message.includes('No cameras found')) {
        errorMessage = 'No camera found on this device.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'Camera not supported on this device.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Camera is being used by another application.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Camera constraints not satisfied.';
      } else if (err.name === 'SecurityError') {
        errorMessage = 'Camera access blocked by security policy.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchProductByBarcode, productError]);

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
        <div className="flex flex-col items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Starting camera...</p>
        </div>
      );
    }

    if (error || hasPermission === false) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <X className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-destructive mb-4">{error || 'Camera access denied'}</p>
          <Button variant="outline" onClick={startScanner}>
            Try Again
          </Button>
        </div>
      );
    }

    if (isScanning) {
      return (
        <div className="relative w-full h-full">
          {/* Scanner container */}
          <div className="scanner-container w-full h-full" />
          
          {/* Scanning overlay frame */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative">
              {/* Scanning frame - adjusted for barcode */}
              <div className="w-80 h-48 border-2 border-primary/50 rounded-lg bg-transparent relative">
                <div className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-lg animate-pulse"></div>
                
                {/* Corner indicators */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-l-4 border-t-4 border-primary rounded-tl-lg"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 border-r-4 border-t-4 border-primary rounded-tr-lg"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-4 border-b-4 border-primary rounded-bl-lg"></div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-4 border-b-4 border-primary rounded-br-lg"></div>
              </div>
              
              {/* Instruction text */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
                <p className="text-sm text-primary font-medium">Position barcode within frame</p>
              </div>
            </div>
          </div>

          {/* Stop button */}
          <Button
            onClick={handleStopScan}
            variant="destructive" 
            size="sm"
            className="absolute top-4 right-4 rounded-full w-10 h-10 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Ready to Scan</h2>
            <p className="text-muted-foreground">
              Position a product barcode within the frame to scan it
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-background flex lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen">
      <Topbar handleBack={handleBack} showBack={true} />

      {/* Content */}
      <div className="flex-1 p-4 pb-20">
        <div className="space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Scan Product Barcode</h1>
            <p className="text-muted-foreground">
              Point your camera at a product barcode to find details
            </p>
          </div>

          {/* Scanner View */}
          <div className="bg-muted/30 rounded-2xl p-4 h-96 relative overflow-hidden">
            {renderScannerView()}
          </div>

          {/* Action Button */}
          <Button
            onClick={handleScan}
            disabled={isLoading || isScanning || productLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Starting Camera...' : 
             isScanning ? 'Scanning...' : 
             productLoading ? 'Looking up product...' : 
             'Start Barcode Scanner'}
          </Button>
        </div>
      </div>
      
      <ProductFoundDialog
        open={showProductDialog}
        product={foundProduct}
        onClose={() => setShowProductDialog(false)}
        onGoToProduct={() => {
          setShowProductDialog(false);
          navigate(`/product-details?id=${foundProduct.product_id}`);
        }}
      />
      
      <BottomNavigation />
    </div>
  );
}