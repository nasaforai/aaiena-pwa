import React, { useState, useEffect } from "react";
import { ArrowLeft, Camera, Clock, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "@/hooks/useNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [bodyType, setBodyType] = useState("");
  const [stylePreferences, setStylePreferences] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "size-guide" | "style-rating">("profile");
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [sideImage, setSideImage] = useState<string | null>(null);
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingSide, setUploadingSide] = useState(false);

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
      setBodyType(profile.body_type || "");
      setStylePreferences(profile.style_preferences || []);
      
      // Load existing images
      if (profile.photos && profile.photos.length > 0) {
        setFrontImage(profile.photos[0] || null);
        setSideImage(profile.photos[1] || null);
      }
    }
  }, [profile, user]);

  const handleBack = () => {
    navigateBack("/profile");
  };

  const handleImageUpload = async (
    file: File, 
    imageType: 'front' | 'side'
  ) => {
    const setUploading = imageType === 'front' ? setUploadingFront : setUploadingSide;
    const setImageUrl = imageType === 'front' ? setFrontImage : setSideImage;
    
    try {
      setUploading(true);
      
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${imageType}-${Date.now()}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      setImageUrl(publicUrl);
      
      toast({
        title: "Success",
        description: `${imageType === 'front' ? 'Front' : 'Side'} image uploaded successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to upload ${imageType} image`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = {
        full_name: fullName,
        gender: selectedGender,
        height: height ? parseFloat(height) : null,
        weight: weight ? parseFloat(weight) : null,
        chest: chest ? parseFloat(chest) : null,
        waist: waist ? parseFloat(waist) : null,
        pants_size: pantsSize ? parseFloat(pantsSize) : null,
        shirt_size: selectedShirtSize,
        body_type: bodyType || null,
        style_preferences: stylePreferences,
        photos: [frontImage, sideImage].filter(Boolean) as string[],
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
        <button 
          onClick={() => setActiveTab("profile")}
          className={`flex-1 py-3 px-4 text-center border-b-2 font-medium transition-colors ${
            activeTab === "profile" 
              ? "border-purple-600 text-gray-900" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Profile
        </button>
        <button 
          onClick={() => setActiveTab("size-guide")}
          className={`flex-1 py-3 px-4 text-center border-b-2 font-medium transition-colors ${
            activeTab === "size-guide" 
              ? "border-purple-600 text-gray-900" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Size Guide
        </button>
        <button 
          onClick={() => setActiveTab("style-rating")}
          className={`flex-1 py-3 px-4 text-center border-b-2 font-medium transition-colors ${
            activeTab === "style-rating" 
              ? "border-purple-600 text-gray-900" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Style Rating
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {/* Profile Tab Content */}
        {activeTab === "profile" && (
          <>
        {/* Name Section */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Name</h3>
          <div className="bg-gray-200 py-px mb-4"></div>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Enter your full name"
          />
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
                step="0.1"
                inputMode="decimal"
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
                step="0.1"
                inputMode="decimal"
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="60"
              ></input>
            </div>
          </div>
          
          {/* Body Type - Only for Female */}
          {selectedGender === "Female" && (
            <div className="mt-4">
              <label className="block text-sm text-gray-600 mb-2">Body Type</label>
              <Select value={bodyType} onValueChange={setBodyType}>
                <SelectTrigger className="w-full bg-white border-gray-300 rounded-lg">
                  <SelectValue placeholder="Select body type" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="rectangle">Rectangle</SelectItem>
                  <SelectItem value="triangle">Triangle</SelectItem>
                  <SelectItem value="inverted">Inverted Triangle</SelectItem>
                  <SelectItem value="diamond">Diamond</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="bg-gray-100 my-8 py-1 w-full"></div>

        {/* Body Photos Section */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Body Photos</h3>
          <div className="bg-gray-200 py-px mb-4"></div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Front Image */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Front Image</label>
              <div className="relative">
                {frontImage ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-300">
                    <img 
                      src={frontImage} 
                      alt="Front view" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setFrontImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload Front</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'front');
                      }}
                      disabled={uploadingFront}
                    />
                  </label>
                )}
                {uploadingFront && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <span className="text-white">Uploading...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Side Image */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Side Image</label>
              <div className="relative">
                {sideImage ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-300">
                    <img 
                      src={sideImage} 
                      alt="Side view" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setSideImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload Side</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'side');
                      }}
                      disabled={uploadingSide}
                    />
                  </label>
                )}
                {uploadingSide && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <span className="text-white">Uploading...</span>
                  </div>
                )}
              </div>
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
              step="0.1"
              inputMode="decimal"
              onChange={(e) => setPantsSize(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="32"
            ></input>
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
        <div className="text-center mt-20 mb-20">
          <p className="text-gray-400 font-bold text-lg">Aaiena</p>
        </div>
        </>
        )}

        {/* Size Guide Tab Content */}
        {activeTab === "size-guide" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-6">
              <Clock className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Coming Soon!</h2>
            <p className="text-gray-600 max-w-md">
              Our comprehensive size guide is currently under development and will be available soon to help you find the perfect fit.
            </p>
          </div>
        )}

        {/* Style Rating Tab Content */}
        {activeTab === "style-rating" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-6">
              <Clock className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Coming Soon!</h2>
            <p className="text-gray-600 max-w-md">
              Style rating feature is currently under development and will help you discover your unique style preferences.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
