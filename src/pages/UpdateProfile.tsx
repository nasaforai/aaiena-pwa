import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Camera, Clock, X, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "@/hooks/useNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthState } from "@/hooks/useAuthState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { extractMeasurementsFromUrls, UserMeasurements } from "@/lib/sizingApi";
import { MeasurementResultsDialog } from "@/components/MeasurementResultsDialog";

export default function UpdateProfile() {
  const navigate = useNavigate();
  const { navigateBack } = useNavigation();
  const { user } = useAuth();
  const { isKiosk } = useAuthState();
  const isMobile = useIsMobile();
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
  const [hip, setHip] = useState("");
  const [shoulder, setShoulder] = useState("");
  const [neck, setNeck] = useState("");
  const [inseam, setInseam] = useState("");
  const [bodyLength, setBodyLength] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [stylePreferences, setStylePreferences] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "size-guide" | "style-rating">("profile");
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [sideImage, setSideImage] = useState<string | null>(null);
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingSide, setUploadingSide] = useState(false);
  const [isCalculatingSize, setIsCalculatingSize] = useState(false);
  const [resultsModalOpen, setResultsModalOpen] = useState(false);
  const [calculatedMeasurements, setCalculatedMeasurements] = useState<UserMeasurements | null>(null);
  
  // Camera capture states
  const [showCamera, setShowCamera] = useState(false);
  const [currentCaptureType, setCurrentCaptureType] = useState<'front' | 'side' | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraLoading, setCameraLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      setSelectedGender(profile.gender || "Male");
      setSelectedShirtSize(profile.shirt_size || "XL");
      setHeight(profile.height?.toString() || "");
      setWeight(profile.weight?.toString() || "");
      // Fields like chest/waist are now shown in the modal, not as inputs
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

  const handleCalculateSize = async () => {
    if (!profile) {
      toast({ title: "Error", description: "Profile not loaded yet.", variant: "destructive" });
      return;
    }
    if (!frontImage || !sideImage) {
      toast({ title: "Error", description: "Please upload both front and side photos.", variant: "destructive" });
      return;
    }

    setIsCalculatingSize(true);
    toast({ title: "AI Size Calculation", description: "Analyzing your photos to extract measurements. This may take a moment." });

    try {
      const measurements = await extractMeasurementsFromUrls(profile);
      setCalculatedMeasurements(measurements);
      setResultsModalOpen(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "Calculation Failed",
        description: `Could not extract measurements: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsCalculatingSize(false);
    }
  };

  const handleSaveFromModal = async () => {
    if (!calculatedMeasurements) return;

    setIsSaving(true);
    try {
      const updates = {
        chest_inches: calculatedMeasurements.chest,
        waist_inches: calculatedMeasurements.waist,
        hip_inches: calculatedMeasurements.Butt,
        shoulder_inches: calculatedMeasurements.shoulder_width,
        neck_inches: calculatedMeasurements.neck,
        inseam_inches: calculatedMeasurements.inseam,
        body_length_inches: calculatedMeasurements.body_length,
        height: profile?.height || calculatedMeasurements.height,
      };

      const { error } = await updateProfile(updates);
      if (error) throw new Error(error);

      toast({ title: "Success!", description: "Your new measurements have been saved." });
      setResultsModalOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save measurements.";
      toast({ title: "Save Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

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

  // Camera functions
  const startCamera = async (captureType: 'front' | 'side') => {
    try {
      setCameraLoading(true);
      setCurrentCaptureType(captureType);
      
      // Check for camera support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }
      
      console.log('Opening camera modal...');
      // Show camera modal FIRST so videoRef gets mounted
      setShowCamera(true);
      
      // Wait for the video element to be mounted in the DOM
      const waitForVideoElement = async (maxWaitMs = 5000) => {
        const startTime = Date.now();
        while (!videoRef.current) {
          if (Date.now() - startTime > maxWaitMs) {
            throw new Error('Timeout waiting for video element to mount');
          }
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        console.log(`Video element became available after ${Date.now() - startTime}ms`);
      };

      await waitForVideoElement();
      
      console.log('Requesting camera access...');
      
      // Try multiple constraint configurations with fallbacks
      let stream: MediaStream | null = null;
      const constraintOptions = [
        // Try environment camera first for kiosk (back camera)
        { video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } },
        // Fallback to user camera (front camera)
        { video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } },
        // Fallback to basic video
        { video: true }
      ];
      
      for (const constraints of constraintOptions) {
        try {
          console.log('Trying constraints:', constraints);
          stream = await navigator.mediaDevices.getUserMedia(constraints);
          console.log('Camera stream received with constraints:', constraints);
          break;
        } catch (err) {
          console.log('Failed with constraints:', constraints, err);
          if (constraints === constraintOptions[constraintOptions.length - 1]) {
            throw err;
          }
        }
      }
      
      if (!stream) {
        throw new Error('Unable to access camera');
      }
      
      setCameraStream(stream);
      
      // Wait for video element to be ready
      if (!videoRef.current) {
        throw new Error('Video element not available');
      }
      
      videoRef.current.srcObject = stream;
      
      // Wait for video metadata to load
      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current) {
          reject(new Error('Video element lost'));
          return;
        }
        
        const timeout = setTimeout(() => {
          reject(new Error('Video metadata load timeout'));
        }, 10000);
        
        videoRef.current.onloadedmetadata = () => {
          clearTimeout(timeout);
          console.log('Video metadata loaded');
          resolve();
        };
      });
      
      // Try to play and handle any errors
      try {
        if (!videoRef.current) {
          throw new Error('Video element lost');
        }
        await videoRef.current.play();
        console.log('Video playing successfully');
      } catch (playError) {
        console.error('Video play error:', playError);
        throw new Error('Failed to start video playback');
      }
    } catch (error) {
      console.error("Camera access error:", error);
      
      let errorMessage = "Unable to access camera. Please check permissions.";
      if (error instanceof Error) {
        if (error.message.includes('Permission denied') || error.name === 'NotAllowedError') {
          errorMessage = "Camera permission denied. Please allow camera access.";
        } else if (error.message.includes('not found') || error.name === 'NotFoundError') {
          errorMessage = "No camera found on this device.";
        } else if (error.message.includes('in use') || error.name === 'NotReadableError') {
          errorMessage = "Camera is already in use by another application.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Cleanup if failed
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
      setShowCamera(false);
    } finally {
      setCameraLoading(false);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || !currentCaptureType) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      
      const file = new File([blob], `${currentCaptureType}-${Date.now()}.jpg`, { 
        type: 'image/jpeg' 
      });
      
      stopCamera();
      
      await handleImageUpload(file, currentCaptureType);
      
      if (currentCaptureType === 'front' && isKiosk) {
        setTimeout(() => {
          startCamera('side');
        }, 500);
      }
    }, 'image/jpeg', 0.9);
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
    setCurrentCaptureType(null);
    setCameraLoading(false);
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

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
                  <div className="space-y-2">
                    {/* Camera Button - Hidden on Mobile */}
                    {!isMobile && (
                      <button
                        onClick={() => startCamera('front')}
                        disabled={cameraLoading}
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg ${
                          cameraLoading 
                            ? 'border-gray-200 cursor-not-allowed bg-gray-50 opacity-50' 
                            : 'border-gray-300 cursor-pointer hover:bg-gray-50'
                        }`}
                      >
                        <Camera className={`w-6 h-6 mb-1 ${cameraLoading ? 'text-gray-300' : 'text-gray-400'}`} />
                        <span className={`text-xs ${cameraLoading ? 'text-gray-400' : 'text-gray-500'}`}>
                          {cameraLoading ? 'Starting camera...' : 'Take Photo'}
                        </span>
                      </button>
                    )}
                    
                    {/* File Upload Button - Hidden on Kiosk */}
                    {!isKiosk && (
                      <label className="flex flex-col items-center justify-center w-full h-14 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 bg-white">
                        <div className="flex items-center space-x-2">
                          <Upload className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">Choose from folder</span>
                        </div>
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
                  </div>
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
                  <div className="space-y-2">
                    {/* Camera Button - Hidden on Mobile */}
                    {!isMobile && (
                      <button
                        onClick={() => startCamera('side')}
                        disabled={cameraLoading}
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg ${
                          cameraLoading 
                            ? 'border-gray-200 cursor-not-allowed bg-gray-50 opacity-50' 
                            : 'border-gray-300 cursor-pointer hover:bg-gray-50'
                        }`}
                      >
                        <Camera className={`w-6 h-6 mb-1 ${cameraLoading ? 'text-gray-300' : 'text-gray-400'}`} />
                        <span className={`text-xs ${cameraLoading ? 'text-gray-400' : 'text-gray-500'}`}>
                          {cameraLoading ? 'Starting camera...' : 'Take Photo'}
                        </span>
                      </button>
                    )}
                    
                    {/* File Upload Button - Hidden on Kiosk */}
                    {!isKiosk && (
                      <label className="flex flex-col items-center justify-center w-full h-14 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 bg-white">
                        <div className="flex items-center space-x-2">
                          <Upload className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">Choose from folder</span>
                        </div>
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
                  </div>
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

        <Button
          onClick={handleCalculateSize}
          disabled={!frontImage || !sideImage || isCalculatingSize}
          className="w-full bg-purple-600 text-white py-4 rounded-xl font-medium hover:bg-purple-700 disabled:bg-gray-300 mb-6"
        >
          {isCalculatingSize ? "Calculating..." : "Calculate My Size with AI"}
        </Button>

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
            <div>
              <label className="block text-sm text-gray-600 mb-1">Chest (in)</label>
              <input value={chest} onChange={(e) => setChest(e.target.value)} type="number" className="w-full p-2 border border-gray-300 rounded-lg" placeholder="38" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Waist (in)</label>
              <input value={waist} onChange={(e) => setWaist(e.target.value)} type="number" className="w-full p-2 border border-gray-300 rounded-lg" placeholder="32" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Hip (in)</label>
              <input value={hip} onChange={(e) => setHip(e.target.value)} type="number" className="w-full p-2 border border-gray-300 rounded-lg" placeholder="40" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Shoulder (in)</label>
              <input value={shoulder} onChange={(e) => setShoulder(e.target.value)} type="number" className="w-full p-2 border border-gray-300 rounded-lg" placeholder="18" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Neck (in)</label>
              <input value={neck} onChange={(e) => setNeck(e.target.value)} type="number" className="w-full p-2 border border-gray-300 rounded-lg" placeholder="15.5" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Inseam (in)</label>
              <input value={inseam} onChange={(e) => setInseam(e.target.value)} type="number" className="w-full p-2 border border-gray-300 rounded-lg" placeholder="32" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Body Length (in)</label>
              <input value={bodyLength} onChange={(e) => setBodyLength(e.target.value)} type="number" className="w-full p-2 border border-gray-300 rounded-lg" placeholder="25" />
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

      <MeasurementResultsDialog
        isOpen={resultsModalOpen}
        onClose={() => setResultsModalOpen(false)}
        onSave={handleSaveFromModal}
        measurements={calculatedMeasurements}
        isSaving={isSaving}
      />

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-black/50">
            <button
              onClick={stopCamera}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <h2 className="text-white font-medium">
              {currentCaptureType === 'front' ? 'Capture Front Photo' : 'Capture Side Photo'}
            </h2>
            <div className="w-10"></div>
          </div>

          {/* Camera View */}
          <div className="flex-1 relative flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="max-w-full max-h-full object-contain"
              style={{ transform: 'scaleX(-1)' }}
            />
            
            {/* Loading Overlay */}
            {cameraLoading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
                  <p className="text-white text-lg">Starting camera...</p>
                </div>
              </div>
            )}
            
            {/* Overlay Guide */}
            {!cameraLoading && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-96 border-2 border-white/50 rounded-lg"></div>
              </div>
            )}
          </div>

          {/* Instructions & Capture Button */}
          <div className="p-6 bg-black/50">
            <p className="text-white text-center mb-4">
              {currentCaptureType === 'front' 
                ? 'Stand facing the camera with arms slightly away from your body' 
                : 'Turn to your side and stand naturally'}
            </p>
            <button
              onClick={capturePhoto}
              disabled={cameraLoading}
              className={`w-full py-4 rounded-xl font-medium ${
                cameraLoading 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {cameraLoading ? 'Initializing...' : 'Capture Photo'}
            </button>
          </div>

          {/* Hidden canvas for photo capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}
