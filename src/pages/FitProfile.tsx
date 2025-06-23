import React from "react";
import { ArrowLeft, User, Activity, Shirt, Ruler, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function FitProfile() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/update-profile");
  };

  const handleContinue = () => {
    navigate("/device-connected");
  };

  const handleEditProfile = () => {
    navigate("/update-profile");
  };

  return (
    <div className="bg-white flex lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold">MY FIT PROFILE</h1>
        <div className="w-10"></div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        {/* Profile Image */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3 relative">
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded"></div>
            </div>
          </div>
          <h2 className="font-bold text-lg mb-2">Jiya Raghav</h2>
          <button className="bg-purple-100 text-purple-600 px-4 py-1 rounded-full text-sm">
            Upgrade your Plan
          </button>
        </div>

        {/* Profile Details */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <User className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium">Your Gender</p>
              <p className="text-sm text-gray-600">Male</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <Activity className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium">Body Measurement</p>
              <p className="text-sm text-gray-600">Height: 177 , Weight: 60</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <Shirt className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium">Sizing Information</p>
              <p className="text-sm text-gray-600">XL</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <Ruler className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium">Additional Measurements</p>
              <p className="text-sm text-gray-600">Pants size: 32</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <Star className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium">Dress Style Rating</p>
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <Star className="w-4 h-4 text-gray-300" />
                <span className="text-sm text-gray-600 ml-2">8/10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleContinue}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800"
          >
            Continue
          </Button>
          <button
            onClick={handleEditProfile}
            className="w-full text-gray-600 py-2 font-medium"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
