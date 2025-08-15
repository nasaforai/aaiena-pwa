import React, { useState } from "react";
import { ArrowLeft, Camera, Edit, Pen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function UpdateProfile() {
  const navigate = useNavigate();
  const [selectedGender, setSelectedGender] = useState("Male");
  const [selectedShirtSize, setSelectedShirtSize] = useState("XL");
  const [height, setHeight] = useState("177");
  const [weight, setWeight] = useState("60");
  const [chest, setChest] = useState("96");
  const [waist, setWaist] = useState("81");
  const [pantsSize, setPantsSize] = useState("32");
  const profileImage = "/images/profile.png";
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
          <div
            className="w-28 h-28 bg-gray-200 rounded-full mx-auto mb-2 relative"
            style={{
              backgroundImage: `url(${profileImage})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute bottom-0 right-0 w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
              <Camera className="w-5 h-5 text-black" />
            </div>
          </div>
          <h2 className="font-bold text-lg flex items-center justify-center">
            <span>Jiya Raghav </span>
            <Pen className="h-4" />
          </h2>
          <button className="bg-purple-200 text-black px-16 py-4 rounded-xl text-m mt-2">
            Upgrade your Plan
          </button>
        </div>

        {/* Current Photos */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Your Current Photos</h3>
          <div className="flex space-x-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className=" w-20 h-20 overflow-hidden bg-blue-200 rounded-lg relative"
              >
                <img
                  src="/images/dress.jpg"
                  alt=""
                  className="absolute object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-100 my-8 py-1 w-full"></div>

        {/* Gender */}
        <div className="mb-10">
          <h3 className="font-medium mb-3">Gender</h3>
          <div className="flex space-x-3">
            {["Male", "Female"].map((gender) => (
              <button
                key={gender}
                onClick={() => setSelectedGender(gender)}
                className={`px-10 py-2 rounded-xl font-medium ${
                  selectedGender === gender
                    ? "bg-gray-900 text-white"
                    : "border border-gray-200 text-gray-700"
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
          <div className="bg-gray-200 py-px mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Height</label>
              <input
                defaultValue={height}
                type="number"
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              ></input>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Weight</label>
              <input
                defaultValue={weight}
                type="number"
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              ></input>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Chest</label>
              <input
                defaultValue={chest}
                type="number"
                onChange={(e) => setChest(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              ></input>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Waist</label>
              <input
                defaultValue={waist}
                type="number"
                onChange={(e) => setWaist(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              ></input>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 my-8 py-1 w-full"></div>

        {/* Sizing Information */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Sizing Information</h3>
          <div className="bg-gray-200 py-px mb-4"></div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">
              Shirt Size
            </label>
            <div className="flex space-x-2">
              {shirtSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedShirtSize(size)}
                  className={`w-12  h-10 rounded-lg font-medium ${
                    selectedShirtSize === size
                      ? "bg-gray-900 text-white"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-100"
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
            <input
              defaultValue={pantsSize}
              type="number"
              onChange={(e) => setPantsSize(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            ></input>
          </div>
        </div>

        <div className="bg-gray-100 my-8 py-1 w-full"></div>

        {/* Style Preferences */}
        <div className="mb-8">
          <h3 className="font-medium mb-3">Style Preferences</h3>
          <div className="bg-gray-200 py-px mb-4"></div>
          <div className="grid grid-cols-2 gap-3">
            {styles.map((style) => (
              <div className="flex items-center gap-2">
                <Checkbox key={style}>{style}</Checkbox>
                <label className="block text-md text-gray-600">{style}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-medium hover:bg-gray-800 mb-4"
        >
          Save Profile
        </Button>

        {/* Footer */}
        <div className="text-center mt-20">
          <p className="text-gray-400 font-bold text-lg">Aaiena</p>
        </div>
      </div>
    </div>
  );
}
