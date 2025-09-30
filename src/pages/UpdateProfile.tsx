import React, { useState, useEffect } from "react";
import { ArrowLeft, Camera, Edit, Pen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "@/hooks/useNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export default function UpdateProfile() {
  const navigate = useNavigate();
  const { navigateBack } = useNavigation();
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const { toast } = useToast();
  
  const [selectedGender, setSelectedGender] = useState("Male");
  const [selectedShirtSize, setSelectedShirtSize] = useState("XL");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [pantsSize, setPantsSize] = useState("");
  const [fullName, setFullName] = useState("");
  const [stylePreferences, setStylePreferences] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      setSelectedGender(profile.gender || "Male");
      setSelectedShirtSize(profile.shirt_size || "XL");
      setHeight(profile.height?.toString() || "");
      setWeight(profile.weight?.toString() || "");
      setChest(profile.chest?.toString() || "");
      setWaist(profile.waist?.toString() || "");
      setPantsSize(profile.pants_size?.toString() || "");
      setFullName(profile.full_name || user?.email || "");
      setStylePreferences(profile.style_preferences || []);
    }
  }, [profile, user]);

  const handleBack = () => {
    navigateBack("/profile");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = {
        full_name: fullName,
        gender: selectedGender,
        height: height ? parseInt(height) : null,
        weight: weight ? parseInt(weight) : null,
        chest: chest ? parseInt(chest) : null,
        waist: waist ? parseInt(waist) : null,
        pants_size: pantsSize ? parseInt(pantsSize) : null,
        shirt_size: selectedShirtSize,
        style_preferences: stylePreferences,
      };

      const { error } = await updateProfile(updates);

      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
        navigate("/profile");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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

  const displayName = fullName || user?.email || 'User';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (loading) {
    return (
      <div className="bg-white flex lg:max-w-sm w-full flex-col mx-auto min-h-screen items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

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
          <div className="relative inline-block">
            <Avatar className="w-28 h-28 mx-auto">
              <AvatarImage src={profile?.avatar_url || ''} alt={displayName} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300">
              <Camera className="w-5 h-5 text-black" />
            </div>
          </div>
          <div className="mt-3">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="text-center font-bold text-lg border-b-2 border-transparent hover:border-gray-300 focus:border-purple-600 focus:outline-none px-2"
              placeholder="Enter your name"
            />
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
              <label className="block text-sm text-gray-600 mb-1">Height (cm)</label>
              <input
                value={height}
                type="number"
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="177"
              ></input>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Weight (kg)</label>
              <input
                value={weight}
                type="number"
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="60"
              ></input>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Chest (cm)</label>
              <input
                value={chest}
                type="number"
                onChange={(e) => setChest(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="96"
              ></input>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Waist (cm)</label>
              <input
                value={waist}
                type="number"
                onChange={(e) => setWaist(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="81"
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
              value={pantsSize}
              type="number"
              onChange={(e) => setPantsSize(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="32"
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
              <div key={style} className="flex items-center gap-2">
                <Checkbox
                  checked={stylePreferences.includes(style)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setStylePreferences([...stylePreferences, style]);
                    } else {
                      setStylePreferences(stylePreferences.filter(s => s !== style));
                    }
                  }}
                />
                <label className="block text-md text-gray-600">{style}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-medium hover:bg-gray-800 mb-4"
        >
          {isSaving ? "Saving..." : "Save Profile"}
        </Button>

        {/* Footer */}
        <div className="text-center mt-20">
          <p className="text-gray-400 font-bold text-lg">Aaiena</p>
        </div>
      </div>
    </div>
  );
}
