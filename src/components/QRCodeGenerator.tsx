import React, { useState, useEffect } from 'react';
import { QRGenerator, QRCodeOptions } from '@/utils/qrGenerator';
import { Loader2 } from 'lucide-react';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
  options?: QRCodeOptions;
  fallbackMessage?: string;
  onError?: (error: Error) => void;
  onGenerated?: (dataUrl: string) => void;
}

/**
 * QR Code Generator component that replaces external API dependency
 * with internal generation using the qrcode library
 */
export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  value,
  size = 200,
  className = '',
  options = {},
  fallbackMessage = 'Failed to generate QR code',
  onError,
  onGenerated
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setError('No value provided for QR code generation');
      setIsLoading(false);
      return;
    }

    const generateQR = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const dataUrl = await QRGenerator.generateSafe(value, {
          size,
          ...options
        });

        if (dataUrl) {
          setQrDataUrl(dataUrl);
          onGenerated?.(dataUrl);
        } else {
          throw new Error('QR generation returned null');
        }
      } catch (err) {
        const error = err as Error;
        console.error('QR Code generation error:', error);
        setError(error.message);
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    };

    generateQR();
  }, [value, size, options, onError, onGenerated]);

  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ width: size, height: size }}
      >
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !qrDataUrl) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg p-4 ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="text-center">
          <div className="text-sm text-gray-500">
            {fallbackMessage}
          </div>
          {error && (
            <div className="text-xs text-red-500 mt-1">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <img
      src={qrDataUrl}
      alt="QR Code"
      className={`rounded-lg ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

// Branded QR Code component for signup flows
export const SignupQRCode: React.FC<{
  signupUrl: string;
  size?: number;
  className?: string;
}> = ({ signupUrl, size = 200, className = '' }) => {
  return (
    <QRCodeGenerator
      value={signupUrl}
      size={size}
      className={className}
      options={{
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M'
      }}
      fallbackMessage="Unable to generate signup QR code"
    />
  );
};

export default QRCodeGenerator;