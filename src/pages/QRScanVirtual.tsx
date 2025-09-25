
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from "@/hooks/useNavigation";
import QRScanScreen from '@/components/QRScanScreen';

export default function QRScanVirtual() {
  const navigate = useNavigate();
  const { navigateBack } = useNavigation();

  const handleBack = () => {
    navigateBack('/fashion-lane');
  };

  const handleContinue = () => {
    // Mobile flow - go to sign up directly
    navigate('/sign-up');
  };

  const handleBackToPhysical = () => {
    // Kiosk flow - go to code input
    navigate('/code-input', { state: { isProductScan: false } });
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
