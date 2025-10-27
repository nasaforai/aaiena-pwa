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

export default function PhoneInput() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { currentBrand } = useBrand();
  
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          {currentBrand?.logo_url && (
            <img
              src={currentBrand.logo_url}
              alt={currentBrand.name}
              className="h-12 mx-auto mb-4"
            />
          )}
          <div className="flex items-center justify-center gap-2 text-primary">
            <Phone className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Enter Phone Number</h1>
          </div>
          <p className="text-muted-foreground">
            Enter your phone number to receive a verification code via WhatsApp
          </p>
        </div>

        {/* Phone Input */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </label>
            <PhoneInputComponent
              international
              defaultCountry="IN"
              value={phone}
              onChange={(value) => setPhone(value || '')}
              className="phone-input"
              placeholder="Enter phone number"
            />
            <p className="text-xs text-muted-foreground">
              Include country code (e.g., +91 for India, +1 for US)
            </p>
          </div>

          <Button
            onClick={handleSendOTP}
            disabled={isLoading || !phone}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Sending...' : 'Send OTP via WhatsApp'}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
