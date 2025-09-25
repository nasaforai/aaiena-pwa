import React, { useState, useEffect } from "react";
import { ArrowLeft, Phone, Eye, EyeOff } from "lucide-react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useNavigation } from "@/hooks/useNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useDeviceSession } from "@/hooks/useDeviceSession";
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

export default function SignIn() {
  const navigate = useNavigate();
  const { navigateBack } = useNavigation();
  const { isAuthenticated, loading, user, deviceType } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [queryParams] = useSearchParams();
  const backRoute = queryParams.get("back");
  const sessionId = queryParams.get("session_id");
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { updateDeviceSession } = useDeviceSession();

  // Handle authenticated users with session_id
  useEffect(() => {
    if (!loading && isAuthenticated && user && sessionId) {
      console.log('User already authenticated, updating device session:', sessionId, user.id);
      
      const handleDeviceUpdate = async () => {
        try {
          const success = await updateDeviceSession(sessionId, user.id);
          if (success) {
            toast({
              title: "Device Connected",
              description: "Successfully connected to kiosk!",
            });
            // Brief delay to show toast, then redirect
            setTimeout(() => {
              navigate("/store", { replace: true });
            }, 1500);
          } else {
            console.log('Device session update failed, proceeding normally');
            navigate("/store", { replace: true });
          }
        } catch (error) {
          console.error('Error updating device session:', error);
          navigate("/store", { replace: true });
        }
      };
      
      handleDeviceUpdate();
    } else if (!loading && isAuthenticated && !sessionId) {
      // Normal authenticated user redirect
      const from = location.state?.from?.pathname || "/store";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location, sessionId, user, updateDeviceSession, toast]);

  // Show loading while checking auth state
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

  const handleBack = () => {
    navigateBack(backRoute ? `/${backRoute}` : "/qr-code");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Handle device session update if session_id exists
      if (sessionId) {
        console.log('Updating device session after login:', sessionId, data.user.id);
        try {
          const success = await updateDeviceSession(sessionId, data.user.id);
          if (success) {
            toast({
              title: "Success!",
              description: "Successfully signed in and connected to kiosk!",
            });
            // Brief delay to show toast, then redirect
            setTimeout(() => {
              navigate("/store");
            }, 1500);
            return;
          } else {
            console.log('Device session update failed, proceeding with normal flow');
          }
        } catch (error) {
          console.error('Error updating device session:', error);
        }
      }

      toast({
        title: "Success!",
        description: "You have been signed in successfully.",
      });
      
      // Check if user has a profile to determine navigation
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', data.user.id)
        .maybeSingle();
      
      if (profile) {
        navigate("/store");
      } else {
        navigate("/measurement-profile");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const redirectTo = sessionId 
        ? `${window.location.origin}/sign-in?session_id=${sessionId}&oauth=google`
        : `${window.location.origin}/store`;
        
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo
        }
      });

      if (error) {
        toast({
          title: "Google Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSignIn = async () => {
    if (!phone.trim()) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number
    try {
      if (!isValidPhoneNumber(phone)) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid phone number with country code",
          variant: "destructive",
        });
        return;
      }

      const phoneNumber = parsePhoneNumber(phone);
      const formattedPhone = phoneNumber.format('E.164');
      
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your phone number.",
      });

      // Navigate to OTP verification
      const otpUrl = sessionId 
        ? `/otp-verification?phone=${encodeURIComponent(formattedPhone)}&session_id=${sessionId}&from=signin`
        : `/otp-verification?phone=${encodeURIComponent(formattedPhone)}&from=signin`;
      
      navigate(otpUrl);
    } catch (error) {
      console.error("Phone signin error:", error);
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    // For mobile users, go directly to sign-up
    if (deviceType === 'mobile') {
      const signUpPath = sessionId ? `/sign-up?session_id=${sessionId}` : '/sign-up';
      navigate(signUpPath);
    } else {
      // For kiosk users, go to signup-options
      navigate(sessionId ? `/signup-options?session_id=${sessionId}` : "/signup-options");
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            We are happy to see you again
          </p>
        </div>

        {/* Social Login */}
        <div className="space-y-3 mb-6">
          <button 
            onClick={handleGoogleLogin} 
            disabled={isLoading}
            className={`w-full border border-gray-300 rounded-xl flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              deviceType === 'kiosk' ? 'py-4 text-lg' : 'py-3'
            }`}
          >
            <img
              src="/icons/google.svg"
              alt="google icon"
              width={20}
              height={20}
            />
            <span className="text-gray-700">Continue with Google</span>
          </button>
          <button 
            onClick={handlePhoneSignIn}
            disabled={isLoading}
            className={`w-full border border-gray-300 rounded-xl flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              deviceType === 'kiosk' ? 'py-4 text-lg' : 'py-3'
            }`}
          >
            <Phone className="text-gray-800 w-5" />
            <span className="text-gray-700">Continue with Phone Number</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">Or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-8">
          <div>
            <label className={`block font-medium text-gray-700 mb-2 ${
              deviceType === 'kiosk' ? 'text-lg mb-3' : 'text-sm'
            }`}>
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full ${deviceType === 'kiosk' ? 'h-14 text-lg' : ''}`}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className={`block font-medium text-gray-700 mb-2 ${
              deviceType === 'kiosk' ? 'text-lg mb-3' : 'text-sm'
            }`}>
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pr-10 ${deviceType === 'kiosk' ? 'h-14 text-lg' : ''}`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Login Button */}
        <Button
          onClick={handleLogin}
          disabled={isLoading}
          className={`w-full bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 mb-6 disabled:opacity-50 ${
            deviceType === 'kiosk' ? 'py-4 text-lg' : 'py-3'
          }`}
        >
          {isLoading ? "Signing In..." : "Log In"}
        </Button>


        {/* Sign Up */}
        <p className="text-center text-gray-600">
          Don't Have An Account?{" "}
          <button onClick={handleSignUp} className="text-blue-600 font-medium">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
