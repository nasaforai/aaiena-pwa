import React from "react";
import {
  ArrowLeft,
  User,
  Activity,
  Shirt,
  Ruler,
  Star,
  Camera,
  Pen,
  UserPen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function FitProfile() {
  const profileImage = "/images/profile.png";
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
    <div className="bg-white flex lg:lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen">
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
          <div
            className="w-28 h-28 bg-gray-200 rounded-full mx-auto mb-2 relative"
            style={{
              backgroundImage: `url(${profileImage})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute bottom-0 right-0 w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
              <UserPen className="w-5 h-5 text-black" />
            </div>
          </div>
          <h2 className="font-bold text-lg flex items-center justify-center">
            <span>Jiya Raghav </span>
            {/* <Pen className="h-4" /> */}
          </h2>
          <button className="bg-purple-200 text-black px-16 py-4 rounded-xl text-m mt-2">
            Upgrade your Plan
          </button>
        </div>

        {/* Profile Details */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-4 px-3 pt-3 pb-6 border-b border-gray-200">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <img src="/icons/user.svg" alt="" width={24} height={24} />
            </div>
            <div>
              <p className="font-medium">Your Gender</p>
              <p className="text-sm text-gray-600">Male</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 px-3 pt-3 pb-6 border-b border-gray-200">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <img src="/icons/measure.svg" alt="" width={28} height={28} />
            </div>{" "}
            <div>
              <p className="font-medium">Body Measurement</p>
              <p className="text-sm text-gray-600">Height: 177 , Weight: 60</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 px-3 pt-3 pb-6 border-b border-gray-200">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <img src="/icons/shirt.svg" alt="" width={20} height={20} />
            </div>
            <div>
              <p className="font-medium">Sizing Information</p>
              <p className="text-sm text-gray-600">XL</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 px-3 pt-3 pb-6 border-b border-gray-200">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <img src="/icons/reel.png" alt="" width={28} height={28} />
            </div>
            <div>
              <p className="font-medium">Additional Measurements</p>
              <p className="text-sm text-gray-600">Pants size: 32</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 px-3 pt-3 pb-6  border-b border-gray-200">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <img src="/icons/start.svg" alt="" width={24} height={24} />
            </div>
            <div>
              <p className="font-medium">Dress Style Rating</p>
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-black" />
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
            className="w-full bg-gray-900 text-white py-6 rounded-xl font-medium hover:bg-gray-800"
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
