import React, { useState, useEffect } from "react";
import { ArrowLeft, Phone, Eye, EyeOff } from "lucide-react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function SignIn() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [queryParams] = useSearchParams();
  const backRoute = queryParams.get("back");
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Redirect authenticated users
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const from = location.state?.from?.pathname || "/store";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

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
    navigate(backRoute ? `/${backRoute}` : "/qr-code");
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/store`
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

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  const handleQRLogin = () => {
    navigate("/measurement-profile");
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
          <p className="text-gray-600">We are happy to see you again</p>
        </div>

        {/* Social Login */}
        <div className="space-y-3 mb-6">
          <button 
            onClick={handleGoogleLogin} 
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10"
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
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 mb-6 disabled:opacity-50"
        >
          {isLoading ? "Signing In..." : "Log In"}
        </Button>

        {/* QR Login */}
        <button
          onClick={handleQRLogin}
          className="w-full text-gray-700 py-2 mb-8"
        >
          Login Via QR Code
        </button>

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
