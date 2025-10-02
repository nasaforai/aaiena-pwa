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

  // Handle authenticated users with session_id (for kiosk flow)
  useEffect(() => {
    if (!loading && isAuthenticated && user && sessionId) {
      console.log('User authenticated via OTP, updating device session:', sessionId, user.id);
      
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
            }, 1500);
          } else {
            navigate("/store", { replace: true });
          }
        } catch (error) {
          console.error('Error updating device session:', error);
          navigate("/store", { replace: true });
        }
      };
      
      handleDeviceUpdate();
    } else if (!loading && isAuthenticated && !sessionId) {
      // Check if user has profile
      checkUserProfile();
    }
  }, [isAuthenticated, loading, navigate, sessionId, user, updateDeviceSession, toast]);

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