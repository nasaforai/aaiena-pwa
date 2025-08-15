import React, { useState, useEffect } from "react";
import { ArrowLeft, Camera, Edit, Pen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useProfile, useUpdateProfile, useCreateProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

export default function UpdateProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: profile, isLoading, error } = useProfile();
  const updateProfile = useUpdateProfile();
  const createProfile = useCreateProfile();

  const [formData, setFormData] = useState({
    full_name: "",
    gender: "Male",
    height: "",
    weight: "",
    chest: "",
    waist: "",
    shirt_size: "XL",
    pants_size: "",
    style_preferences: ["Smart", "Streetwear", "Athletic"],
  });

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        gender: profile.gender || "Male",
        height: profile.height?.toString() || "",
        weight: profile.weight?.toString() || "",
        chest: profile.chest?.toString() || "",
        waist: profile.waist?.toString() || "",
        shirt_size: profile.shirt_size || "XL",
        pants_size: profile.pants_size?.toString() || "",
        style_preferences: profile.style_preferences || ["Smart", "Streetwear", "Athletic"],
      });
    }
  }, [profile]);

  const handleBack = () => {
    navigate("/image-guide");
  };

  const handleSave = async () => {
    try {
      const profileUpdateData = {
        full_name: formData.full_name,
        gender: formData.gender,
        height: formData.height ? parseInt(formData.height) : null,
        weight: formData.weight ? parseInt(formData.weight) : null,
        chest: formData.chest ? parseInt(formData.chest) : null,
        waist: formData.waist ? parseInt(formData.waist) : null,
        shirt_size: formData.shirt_size,
        pants_size: formData.pants_size ? parseInt(formData.pants_size) : null,
        style_preferences: formData.style_preferences,
      };

      if (profile) {
        await updateProfile.mutateAsync(profileUpdateData);
      } else {
        await createProfile.mutateAsync(profileUpdateData);
      }
      
      navigate("/fit-profile");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleStylePreference = (style: string) => {
    const currentPreferences = formData.style_preferences;
    const updatedPreferences = currentPreferences.includes(style) 
      ? currentPreferences.filter((s) => s !== style) 
      : [...currentPreferences, style];
    updateFormData('style_preferences', updatedPreferences);
  };

  const shirtSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const profileImage = profile?.avatar_url || "/images/profile.png";
  const styles = [
    "Smart",
    "Business",
    "Casual",
    "Vintage",
    "Formal",
    "Streetwear",
    "Athletic",
  ];

  if (isLoading) {
    return (
      <div className="bg-white flex lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen items-center justify-center">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

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
            <Input
              value={formData.full_name}
              onChange={(e) => updateFormData('full_name', e.target.value)}
              placeholder="Enter your name"
              className="border-none text-center bg-transparent font-bold text-lg"
            />
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
                onClick={() => updateFormData('gender', gender)}
                className={`px-10 py-2 rounded-xl font-medium ${
                  formData.gender === gender
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
                value={formData.height}
                type="number"
                placeholder="177"
                onChange={(e) => updateFormData('height', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Weight</label>
              <input
                value={formData.weight}
                type="number"
                placeholder="60"
                onChange={(e) => updateFormData('weight', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Chest</label>
              <input
                value={formData.chest}
                type="number"
                placeholder="96"
                onChange={(e) => updateFormData('chest', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Waist</label>
              <input
                value={formData.waist}
                type="number"
                placeholder="81"
                onChange={(e) => updateFormData('waist', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
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
                  onClick={() => updateFormData('shirt_size', size)}
                  className={`w-12 h-10 rounded-lg font-medium ${
                    formData.shirt_size === size
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
              value={formData.pants_size}
              type="number"
              placeholder="32"
              onChange={(e) => updateFormData('pants_size', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="bg-gray-100 my-8 py-1 w-full"></div>

        {/* Style Preferences */}
        <div className="mb-8">
          <h3 className="font-medium mb-3">Style Preferences</h3>
          <div className="bg-gray-200 py-px mb-4"></div>
          <div className="grid grid-cols-2 gap-3">
            {styles.map((style) => (
              <div key={style} className="flex items-center gap-2">
                <Checkbox 
                  checked={formData.style_preferences.includes(style)}
                  onCheckedChange={() => toggleStylePreference(style)}
                />
                <label className="block text-md text-gray-600">{style}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={updateProfile.isPending || createProfile.isPending}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-medium hover:bg-gray-800 mb-4"
        >
          {updateProfile.isPending || createProfile.isPending ? "Saving..." : "Save Profile"}
        </Button>

        {/* Footer */}
        <div className="text-center mt-20">
          <p className="text-gray-400 font-bold text-lg">Aaiena</p>
        </div>
      </div>
    </div>
  );
}
