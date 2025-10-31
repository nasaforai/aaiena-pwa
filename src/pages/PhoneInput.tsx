import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Phone } from 'lucide-react';
import PhoneInputComponent from 'react-phone-number-input';
import { isValidPhoneNumber } from 'libphonenumber-js';
import 'react-phone-number-input/style.css';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useBrand } from '@/contexts/BrandContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

export default function PhoneInput() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { currentBrand } = useBrand();
  const isMobile = useIsMobile();
  const { deviceType } = useAuth();
  
  const [phone, setPhone] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const sessionId = searchParams.get('session_id');
  const fromPage = searchParams.get('from');

  const handleBack = () => {
    if (fromPage === 'signin') {
      navigate(sessionId ? `/sign-in?session_id=${sessionId}` : '/sign-in');
    } else {
      navigate(sessionId ? `/sign-up?session_id=${sessionId}` : '/sign-up');
    }
  };

  const handleSendOTP = async () => {
    if (!phone) {
      toast({
        title: "Phone Required",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    if (!isValidPhoneNumber(phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number with country code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp-otp', {
        body: { phone }
      });

      if (error) {
        console.error('Error sending OTP:', error);
        toast({
          title: "Failed to Send OTP",
          description: error.message || "Could not send verification code. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!data.success) {
        toast({
          title: "Failed to Send OTP",
          description: data.error || "Could not send verification code. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "OTP Sent",
        description: "Check your WhatsApp for the verification code",
      });

      // Navigate to OTP verification
      const params = new URLSearchParams({
        phone,
        method: 'whatsapp'
      });
      
      if (sessionId) params.append('session_id', sessionId);
      if (fromPage) params.append('from', fromPage);

      navigate(`/otp-verification?${params.toString()}`);
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white flex lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen">
      {/* Header */}
      {!isMobile && (
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="text-center mb-8">
          {currentBrand?.logo_url && (
            <img
              src={currentBrand.logo_url}
              alt={currentBrand.name}
              className="h-12 mx-auto mb-6"
            />
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Enter Phone Number
          </h1>
          <p className="text-gray-600">
            We'll send you a verification code via WhatsApp
          </p>
        </div>

        {/* Phone Input Form */}
        <div className="space-y-6">
          <div>
            <label className={`block font-medium text-gray-700 mb-2 ${
              deviceType === 'kiosk' ? 'text-lg mb-3' : 'text-sm'
            }`}>
              Phone Number
            </label>
            <PhoneInputComponent
              international
              defaultCountry="IN"
              value={phone}
              onChange={(value) => setPhone(value || '')}
              className={`phone-input w-full ${deviceType === 'kiosk' ? 'text-lg' : ''}`}
              placeholder="Enter phone number"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-2">
              Include country code (e.g., +91 for India, +1 for US)
            </p>
          </div>

          <Button
            onClick={handleSendOTP}
            disabled={isLoading || !phone}
            className={`w-full bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 ${
              deviceType === 'kiosk' ? 'py-4 text-lg' : 'py-3'
            }`}
          >
            {isLoading ? 'Sending...' : 'Send OTP via WhatsApp'}
          </Button>

          {isMobile && (
            <button
              onClick={handleBack}
              className="w-full text-center text-gray-600 text-sm"
            >
              Back to Sign In
            </button>
          )}

          <p className="text-xs text-center text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
