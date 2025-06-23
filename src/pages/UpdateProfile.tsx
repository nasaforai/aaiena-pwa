import React, { useState } from "react";
import { ArrowLeft, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UpdateProfile() {
  const navigate = useNavigate();
  const [selectedGender, setSelectedGender] = useState("Male");
  const [selectedShirtSize, setSelectedShirtSize] = useState("XL");
  const [height, setHeight] = useState("177");
  const [weight, setWeight] = useState("60");
  const [chest, setChest] = useState("96");
  const [waist, setWaist] = useState("81");
  const [pantsSize, setPantsSize] = useState("32");
  const [stylePreferences, setStylePreferences] = useState([
    "Smart",
    "Streetwear",
    "Athletic",
  ]);

  const handleBack = () => {
    navigate("/image-guide");
  };

  const handleSave = () => {
    navigate("/fit-profile");
  };

  const toggleStylePreference = (style: string) => {
    setStylePreferences((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const shirtSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const styles = [
    "Smart",
    "Business",
    "Casual",
    "Vintage",
    "Formal",
    "Streetwear",
    "Athletic",
  ];

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
        <h1 className="text-lg font-bold">UPDATE PROFILE</h1>
        <div className="w-10"></div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b">
        <button className="flex-1 py-3 px-4 text-center border-b-2 border-purple-600 font-medium">
          Profile
        </button>
        <button className="flex-1 py-3 px-4 text-center text-gray-500">
          Size Guide
        </button>
        <button className="flex-1 py-3 px-4 text-center text-gray-500">
          Style Rating
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {/* Profile Image */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-2 relative">
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </div>
          <h2 className="font-bold text-lg">Jiya Raghav ✏️</h2>
          <button className="bg-purple-100 text-purple-600 px-4 py-1 rounded-full text-sm mt-2">
            Upgrade your Plan
          </button>
        </div>

        {/* Current Photos */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Your Current Photos</h3>
          <div className="flex space-x-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-16 h-16 bg-blue-200 rounded-lg"></div>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Gender</h3>
          <div className="flex space-x-3">
            {["Male", "Female"].map((gender) => (
              <button
                key={gender}
                onClick={() => setSelectedGender(gender)}
                className={`px-6 py-2 rounded-full font-medium ${
                  selectedGender === gender
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        {/* Body Measurements */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Body Measurement (cm)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Height</label>
              <select
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="177">177</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Weight</label>
              <select
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="60">60</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Chest</label>
              <select
                value={chest}
                onChange={(e) => setChest(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="96">96</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Waist</label>
              <select
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="81">81</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sizing Information */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Sizing Information</h3>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">
              Shirt Size
            </label>
            <div className="flex space-x-2">
              {shirtSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedShirtSize(size)}
                  className={`px-3 py-2 rounded-lg font-medium ${
                    selectedShirtSize === size
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Pants Size
            </label>
            <select
              value={pantsSize}
              onChange={(e) => setPantsSize(e.target.value)}
              className="w-20 p-2 border border-gray-300 rounded-lg"
            >
              <option value="32">32</option>
            </select>
          </div>
        </div>

        {/* Style Preferences */}
        <div className="mb-8">
          <h3 className="font-medium mb-3">Style Preferences</h3>
          <div className="grid grid-cols-2 gap-3">
            {styles.map((style) => (
              <button
                key={style}
                onClick={() => toggleStylePreference(style)}
                className={`p-3 rounded-lg border text-left ${
                  stylePreferences.includes(style)
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-4 h-4 rounded border ${
                      stylePreferences.includes(style)
                        ? "bg-white border-white"
                        : "border-gray-400"
                    }`}
                  >
                    {stylePreferences.includes(style) && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-900 rounded"></div>
                      </div>
                    )}
                  </div>
                  <span>{style}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 mb-4"
        >
          Save Profile
        </Button>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-400 font-bold text-lg">Aaiena</p>
        </div>
      </div>
    </div>
  );
}
