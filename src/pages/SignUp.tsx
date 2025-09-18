import React, { useState, useEffect } from "react";
import { ArrowLeft, Phone, Loader2 } from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUp() {
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Get session ID from URL parameters
  useEffect(() => {
    const sessionParam = searchParams.get('session_id');
    if (sessionParam) {
      setSessionId(sessionParam);
      console.log('Device session ID detected:', sessionParam);
    }
  }, [searchParams]);

  // Redirect authenticated users
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // If this is a cross-device signup, update the device session
      if (sessionId) {
        updateDeviceSession(sessionId, user.id);
      }
      
      const from = location.state?.from?.pathname || "/store";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location, sessionId, user]);

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

  const updateDeviceSession = async (sessionId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('device_sessions')
        .update({
          user_id: userId,
          status: 'authenticated'
        })
        .eq('kiosk_session_id', sessionId);

      if (error) {
        console.error('Error updating device session:', error);
      } else {
        console.log('Device session updated successfully for kiosk login');
      }
    } catch (error) {
      console.error('Error updating device session:', error);
    }
  };

  const handleBack = () => {
    navigate("/signup-options");
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
      const redirectUrl = `${window.location.origin}/measurement-profile`;
      
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
          "Account created! Redirecting to kiosk..." : 
          "Please check your email to verify your account.",
      });

      // If this is a cross-device signup, we'll handle the redirect differently
      if (sessionId) {
        // Wait a moment for the auth state to update, then the useEffect will handle the device session update
        setTimeout(() => {
          if (user) {
            updateDeviceSession(sessionId, user.id);
          }
        }, 1000);
      }

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
      const redirectUrl = sessionId ? 
        `${window.location.origin}/sign-up?session_id=${sessionId}` :
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

  const handleLogin = () => {
    navigate("/signup-options");
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
        {/* H&M Logo */}
        <div className="flex justify-center mb-8">
          <img src="/images/hm.png" alt="h&m logo" width={82} height={54} />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Get Full Access
          </h1>
        </div>

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
          <button className="w-full border border-gray-300 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors">
            <Phone className="text-gray-800 w-5" />
            <span className="text-gray-700">Continue with Phone Number</span>
          </button>
        </div>

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
