import React, { useState } from "react";
import { ArrowLeft, Phone } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignIn() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [queryParams] = useSearchParams();
  const backRoute = queryParams.get("back");

  const handleBack = () => {
    navigate(backRoute ? `/${backRoute}` : "/qr-code");
  };

  const handleLogin = () => {
    navigate("/measurement-profile");
  };

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  const handleQRLogin = () => {
    navigate("/measurement-profile");
  };

  return (
    <div className="bg-white flex lg:lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen">
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">We are happy to see you again</p>
        </div>

        {/* Social Login */}
        <div className="space-y-3 mb-6">
          <button className="w-full border border-gray-300 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors">
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
              Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
              placeholder="Enter your name"
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
            />
          </div>
        </div>

        {/* Login Button */}
        <Button
          onClick={handleLogin}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 mb-6"
        >
          Log In
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
