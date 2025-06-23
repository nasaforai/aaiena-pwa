import React, { useState } from "react";
import { ArrowLeft, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleBack = () => {
    navigate("/welcome-back");
  };

  const handleSignUp = () => {
    navigate("/measurement-profile");
  };

  const handleLogin = () => {
    navigate("/welcome-back");
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
        {/* H&M Logo */}
        <div className="flex justify-center mb-8">
          <div className="text-red-600 text-4xl font-bold">H&M</div>
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

        {/* Sign Up Button */}
        <Button
          onClick={handleSignUp}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 mb-6"
        >
          Sign Up
        </Button>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">Or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Social Login */}
        <div className="space-y-3 mb-8">
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
