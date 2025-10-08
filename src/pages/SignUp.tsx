import React, { useState, useEffect } from "react";
import { ArrowLeft, Phone, Loader2 } from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useNavigation } from "@/hooks/useNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useDeviceSession } from "@/hooks/useDeviceSession";
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { useBrand } from '@/contexts/BrandContext';

export default function SignUp() {
  const navigate = useNavigate();
  const { navigateBack } = useNavigation();
  const { currentBrand } = useBrand();
  const { isAuthenticated, loading, user, deviceType } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { updateDeviceSession } = useDeviceSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Get session ID from URL parameters
  useEffect(() => {
    const sessionParam = searchParams.get('session_id');
    const isVerified = searchParams.get('verified');
    const isOAuth = searchParams.get('oauth');
    
    console.log('SignUp URL params check:', { sessionParam, isVerified, isOAuth, isAuthenticated, loading });
    
    if (sessionParam) {
      setSessionId(sessionParam);
      console.log('Device session ID detected:', sessionParam);
      
      // If user comes back verified or via OAuth and is authenticated, 
      // the redirect useEffect will handle the device session update
      if ((isVerified || isOAuth) && isAuthenticated) {
        console.log('User returned from verification/OAuth with session_id - will trigger device session update');
      }
    }
  }, [searchParams, isAuthenticated, loading]);

  // Handle authenticated users with device session
  const [deviceSessionUpdated, setDeviceSessionUpdated] = useState(false);
  const [updatingSession, setUpdatingSession] = useState(false);
  const [sessionValidated, setSessionValidated] = useState(false);

  // Validate session ID before attempting to update
  const validateSession = async (sessionId: string): Promise<boolean> => {
    try {
      console.log('[Mobile Flow] Validating device session:', sessionId);
      const { data, error } = await supabase
        .from('device_sessions')
        .select('*')
        .eq('kiosk_session_id', sessionId)
        .single();

      if (error) {
        console.error('[Mobile Flow] Session validation error:', error);
        return false;
      }

      if (!data) {
        console.log('[Mobile Flow] Session not found in database');
        return false;
      }

      const now = new Date();
      const expiresAt = new Date(data.expires_at);
      
      if (now > expiresAt) {
        console.log('[Mobile Flow] Session has expired');
        return false;
      }

      console.log('[Mobile Flow] Session is valid:', data);
      return true;
    } catch (error) {
      console.error('[Mobile Flow] Session validation failed:', error);
      return false;
    }
  };

  // Effect to handle device session update after authentication
  useEffect(() => {
    console.log('[Mobile Flow] Auth state:', { 
      loading, 
      isAuthenticated, 
      hasUser: !!user,
      userId: user?.id,
      sessionId, 
      deviceSessionUpdated, 
      updatingSession,
      sessionValidated,
      url: window.location.href
    });

    if (!loading && isAuthenticated && user && sessionId && !deviceSessionUpdated && !updatingSession) {
      console.log('[Mobile Flow] Starting device session update process...');
      setUpdatingSession(true);
      
      // First validate the session
      validateSession(sessionId).then((isValid) => {
        if (!isValid) {
          console.log('[Mobile Flow] Session is invalid or expired');
          setUpdatingSession(false);
          toast({
            title: "Session Expired",
            description: "The kiosk session has expired. Please scan the QR code again.",
            variant: "destructive",
          });
          return;
        }

        setSessionValidated(true);
        console.log('[Mobile Flow] Session validated, updating device session...');
        
        // Add a small delay to ensure all states are properly set
        setTimeout(() => {
          console.log('[Mobile Flow] Calling updateDeviceSession with:', { sessionId, userId: user.id });
          updateDeviceSession(sessionId, user.id).then((success) => {
            console.log('[Mobile Flow] updateDeviceSession result:', success);
            setUpdatingSession(false);
            setDeviceSessionUpdated(true);
            
            if (success) {
              console.log('[Mobile Flow] ✓ Device session updated successfully - kiosk should now receive realtime update');
              toast({
                title: "Success!",
                description: "Successfully connected to kiosk. You can now close this page.",
                variant: "default",
              });
              // Redirect after a short delay to let the kiosk sync
              setTimeout(() => {
                navigate("/store", { replace: true });
              }, 2000);
            } else {
              console.log('[Mobile Flow] ✗ Device session update failed');
              toast({
                title: "Connection Failed",
                description: "Failed to connect to kiosk. Please try the QR code again.",
                variant: "destructive",
              });
            }
          }).catch((error) => {
            console.error('[Mobile Flow] Device session update error:', error);
            setUpdatingSession(false);
            toast({
              title: "Connection Error",
              description: "There was an error connecting to the kiosk. Please try again.",
              variant: "destructive",
            });
          });
        }, 500);
      });
    } else if (!loading && isAuthenticated && user && !sessionId) {
      // Regular authenticated user without session ID
      console.log('[Mobile Flow] Regular authenticated user, redirecting to store');
      const from = location.state?.from?.pathname || "/store";
      navigate(from, { replace: true });
    } else if (sessionId && !isAuthenticated && !loading) {
      console.log('[Mobile Flow] ⚠ User has session_id but is not authenticated yet - waiting for email verification');
    }
  }, [isAuthenticated, loading, navigate, location, sessionId, user, updateDeviceSession, deviceSessionUpdated, updatingSession, toast]);

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

  // Show device session sync for authenticated users with session ID
  if (isAuthenticated && sessionId && (updatingSession || deviceSessionUpdated)) {
    return (
      <div className="bg-white flex lg:max-w-sm w-full flex-col mx-auto min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-6 p-6 text-center">
          {currentBrand?.logo_url && (
            <div className="flex justify-center mb-4">
              <img src={currentBrand.logo_url} alt={`${currentBrand.name} logo`} width={82} height={54} className="object-contain" />
            </div>
          )}
          
          {updatingSession ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <h2 className="text-xl font-semibold text-gray-900">Connecting to Kiosk...</h2>
              <p className="text-gray-600">Please wait while we sync your account</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Successfully Connected!</h2>
              <p className="text-gray-600">Your account has been synced with the kiosk. You can now close this page or continue shopping.</p>
              <Button 
                onClick={() => navigate("/store")} 
                className="bg-gray-900 text-white px-6 py-2 rounded-xl hover:bg-gray-800"
              >
                Continue Shopping
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }


  const handleBack = () => {
    // Device-aware back navigation with intelligent fallback
    const fallback = deviceType === 'mobile' ? '/welcome' : "/signup-options";
    navigateBack(fallback);
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return false;
    }

    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email",
        variant: "destructive",
      });
      return false;
    }

    if (!password.trim()) {
      toast({
        title: "Error",
        description: "Please enter a password",
        variant: "destructive",
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Preserve session_id in redirect URL for mobile flow
      const redirectUrl = sessionId ? 
        `${window.location.origin}/sign-up?session_id=${sessionId}&verified=true` :
        `${window.location.origin}/measurement-profile`;
      
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: name.trim(),
          }
        }
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Error",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "Success!",
        description: sessionId ? 
          "Account created! Please check your email to verify and connect to kiosk." : 
          "Please check your email to verify your account.",
      });

      // For mobile flow, the email verification will bring them back with session_id
      // The useEffect will handle the device session update when they return authenticated

    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    
    try {
      // For Google OAuth, preserve session_id in redirect URL for mobile flow
      const redirectUrl = sessionId ? 
        `${window.location.origin}/sign-up?session_id=${sessionId}&oauth=google` :
        `${window.location.origin}/measurement-profile`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Google signup error:", error);
      toast({
        title: "Error",
        description: "Failed to sign up with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSignUp = async () => {
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
        ? `/otp-verification?phone=${encodeURIComponent(formattedPhone)}&session_id=${sessionId}`
        : `/otp-verification?phone=${encodeURIComponent(formattedPhone)}`;
      
      navigate(otpUrl);
    } catch (error) {
      console.error("Phone signup error:", error);
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    // For mobile users with session_id, go directly to sign-in
    if (deviceType === 'mobile' && sessionId) {
      navigate(`/sign-in?session_id=${sessionId}`);
    } else if (deviceType === 'mobile') {
      // Mobile users without session go to sign-in
      navigate('/sign-in');
    } else {
      // For kiosk users, go to signup-options
      navigate("/signup-options");
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
        {/* Brand Logo */}
        {currentBrand?.logo_url && (
          <div className="flex justify-center mb-8">
            <img src={currentBrand.logo_url} alt={`${currentBrand.name} logo`} width={82} height={54} className="object-contain" />
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {deviceType === 'kiosk' ? 'Quick Kiosk Access' : 'Get Full Access'}
          </h1>
          {deviceType === 'kiosk' && (
            <p className="text-gray-600">Sign up with your phone number</p>
          )}
        </div>

        {/* Render different forms based on device type */}
        {deviceType === 'kiosk' ? (
          // Kiosk-only phone signup
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Phone Number
              </label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-14 text-lg"
                placeholder="+1 (555) 123-4567"
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500 mt-2">
                Include country code (e.g., +1 for US)
              </p>
            </div>

            <Button
              onClick={handlePhoneSignUp}
              disabled={isLoading}
              className="w-full bg-gray-900 text-white py-4 text-lg rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending Code...
                </>
              ) : (
                "Continue with Phone"
              )}
            </Button>
          </div>
        ) : (
          // Mobile/Desktop - All signup options
          <>
            {/* Form */}
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                  placeholder="Enter your name"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Sign Up Button */}
            <Button
              onClick={handleSignUp}
              disabled={isLoading}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 mb-6 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

            {/* Divider */}
            <div className="flex items-center mb-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">Or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Social Login */}
            <div className="space-y-3 mb-8">
              <button 
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors disabled:opacity-50"
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
                onClick={handlePhoneSignUp}
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Phone className="text-gray-800 w-5" />
                <span className="text-gray-700">Continue with Phone Number</span>
              </button>
            </div>
          </>
        )}

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center mb-8">
          By continuing, you agree to the{" "}
          <button className="underline">Terms of Service</button> and
          acknowledge you've read our{" "}
          <button className="underline">Privacy Policy</button>.
        </p>

        {/* Login */}
        <p className="text-center text-gray-600">
          Already Have An Account?{" "}
          <button onClick={handleLogin} className="text-blue-600 font-medium">
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}
