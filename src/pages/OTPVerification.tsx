import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useNavigation } from "@/hooks/useNavigation";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useDeviceSession } from "@/hooks/useDeviceSession";
import { useBrand } from '@/contexts/BrandContext';

export default function OTPVerification() {
  const navigate = useNavigate();
  const { navigateBack } = useNavigation();
  const { currentBrand } = useBrand();
  const { isAuthenticated, loading, user } = useAuth();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { updateDeviceSession } = useDeviceSession();
  
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const phone = searchParams.get('phone');
  const sessionId = searchParams.get('session_id');
  const fromSignIn = searchParams.get('from') === 'signin';

  // Countdown timer for resend
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Handle authenticated users - simplified navigation logic
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      console.log('User authenticated in OTPVerification:', user.id);
      
      // Handle device session connection (for kiosk flow)
      if (sessionId) {
        console.log('Updating device session:', sessionId);
        
        const handleDeviceUpdate = async () => {
          try {
            const success = await updateDeviceSession(sessionId, user.id);
            if (success) {
              toast({
                title: "Success!",
                description: "Successfully connected to kiosk!",
              });
              setTimeout(() => {
                navigate("/store", { replace: true });
              }, 1000);
            } else {
              navigate("/store", { replace: true });
            }
          } catch (error) {
            console.error('Error updating device session:', error);
            navigate("/store", { replace: true });
          }
        };
        
        handleDeviceUpdate();
      }
      // For normal flow without session_id, check profile
      else {
        console.log('No session_id, checking user profile');
        checkUserProfile();
      }
    }
  }, [isAuthenticated, loading, user]);

  const checkUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (profile) {
        navigate("/store", { replace: true });
      } else {
        navigate("/measurement-profile", { replace: true });
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      navigate("/store", { replace: true });
    }
  };

  const handleBack = () => {
    if (fromSignIn) {
      const fallback = sessionId ? `/sign-in?session_id=${sessionId}` : "/sign-in";
      navigateBack(fallback);
    } else {
      const fallback = sessionId ? `/sign-up?session_id=${sessionId}` : "/sign-up";
      navigateBack(fallback);
    }
  };

  const handleVerifyOTP = async () => {
    if (!phone || !otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const method = searchParams.get('method');
      
      if (method === 'whatsapp') {
        // WhatsApp OTP verification via edge function
        console.log('=== CALLING VERIFY-WHATSAPP-OTP EDGE FUNCTION ===');
        console.log('Phone:', phone);
        console.log('OTP:', otp);
        console.log('OTP length:', otp.length);
        
        const { data, error } = await supabase.functions.invoke('verify-whatsapp-otp', {
          body: { phone, otp }
        });

        console.log('=== EDGE FUNCTION RESPONSE ===');
        console.log('Data:', data);
        console.log('Error:', error);

        if (error) {
          console.error('WhatsApp verification error:', error);
          
          // Check if it's a network error
          if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
            toast({
              title: "Connection Error",
              description: "Could not reach verification service. Please check your connection.",
              variant: "destructive",
            });
            return;
          }
          
          toast({
            title: "Verification Failed",
            description: error.message || "Failed to verify code. Please try again.",
            variant: "destructive",
          });
          return;
        }

        if (!data?.success || !data?.session) {
          console.error('Verification failed - Success:', data?.success, 'Has session:', !!data?.session);
          toast({
            title: "Verification Failed",
            description: data?.error || "Invalid verification code",
            variant: "destructive",
          });
          return;
        }

        console.log('Verification successful! Setting session...');

        // Set the session FIRST and wait for it to complete
        if (data.session) {
          const { error: sessionError } = await supabase.auth.setSession(data.session);
          
          if (sessionError) {
            console.error('Error setting session:', sessionError);
            toast({
              title: "Authentication Error",
              description: "Failed to authenticate. Please try again.",
              variant: "destructive",
            });
            return;
          }
          
          // Wait for auth state to update (give the onAuthStateChange listener time to process)
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        toast({
          title: "Success!",
          description: "Phone number verified successfully!",
        });

        // Navigation will be handled by the useEffect that watches isAuthenticated
        // So we don't need to manually navigate here anymore
      } else {
        // Regular SMS OTP verification
        const { error } = await supabase.auth.verifyOtp({
          phone,
          token: otp,
          type: 'sms'
        });

        if (error) {
          toast({
            title: "Verification Failed",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success!",
          description: "Phone number verified successfully!",
        });

        // Authentication state change will be handled by useEffect
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!phone || timeLeft > 0) return;

    setIsResending(true);
    try {
      const method = searchParams.get('method');
      
      if (method === 'whatsapp') {
        // Resend via WhatsApp
        const { data, error } = await supabase.functions.invoke('send-whatsapp-otp', {
          body: { phone }
        });

        if (error || !data?.success) {
          console.error('Resend WhatsApp OTP error:', error || data?.error);
          toast({
            title: "Resend Failed",
            description: data?.error || error?.message || "Could not resend verification code. Please try again.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "OTP Sent",
          description: "A new verification code has been sent via WhatsApp.",
        });
      } else {
        // Resend via SMS
        const { error } = await supabase.auth.signInWithOtp({
          phone,
        });

        if (error) {
          toast({
            title: "Resend Failed",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "OTP Sent",
          description: "A new verification code has been sent to your phone.",
        });
      }
      
      setTimeLeft(60);
      setOtp("");
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white flex lg:max-w-sm w-full flex-col mx-auto min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
        {/* Brand Logo */}
        {currentBrand?.logo_url && (
          <div className="flex justify-center mb-8">
            <img src={currentBrand.logo_url} alt={`${currentBrand.name} logo`} width={82} height={54} className="object-contain" />
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Verify Your Phone
          </h1>
          <p className="text-gray-600">
            We've sent a 6-digit code to
          </p>
          <p className="text-gray-900 font-medium">{phone}</p>
        </div>

        {/* OTP Input */}
        <div className="flex justify-center mb-8">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerifyOTP}
          disabled={isLoading || otp.length !== 6}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 mb-6 disabled:opacity-50"
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>

        {/* Resend */}
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-2">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResendOTP}
            disabled={timeLeft > 0 || isResending}
            className="text-blue-600 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {isResending 
              ? "Sending..." 
              : timeLeft > 0 
                ? `Resend in ${timeLeft}s` 
                : "Resend Code"
            }
          </button>
        </div>
      </div>
    </div>
  );
}