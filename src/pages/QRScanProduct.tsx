
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from "@/hooks/useNavigation";
import QRScanScreen from '@/components/QRScanScreen';

export default function QRScanProduct() {
  const navigate = useNavigate();
  const { navigateBack } = useNavigation();

  const handleBack = () => {
    navigateBack('/fashion-lane');
  };

  const handleContinue = () => {
    // Mobile flow - go to product scan screen
    navigate('/product-scan');
  };

  const handleBackToPhysical = () => {
    // Kiosk flow - go to code input or kiosk scan
    navigate('/code-input', { state: { isProductScan: true } });
  };

  return (
    <QRScanScreen
      title="Scan QR Or Enter This Code On Your Phone To Continue Shopping."
      onBack={handleBack}
      onContinue={handleContinue}
      onBackToPhysical={handleBackToPhysical}
    />
  );
}
