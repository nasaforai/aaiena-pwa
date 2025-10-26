import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, User, Settings, ShoppingBag, LogOut, Camera, Home, Heart, ChevronDown, ChevronUp, Eye, EyeOff, Smartphone, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BottomNavigation from "@/components/BottomNavigation";
import MobileSwitchQRDialog from "@/components/MobileSwitchQRDialog";
import { MeasurementResultsDialog } from "@/components/MeasurementResultsDialog";
import { useAuthState } from "@/hooks/useAuthState";
import Topbar from "@/components/ui/topbar";
import { extractMeasurementsFromUrls } from '@/lib/sizingApi';

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { toast } = useToast();
  const { isKiosk, isDesktop, isMobile } = useAuthState();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showMobileSwitchDialog, setShowMobileSwitchDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Measurement calculation states
  const [isCalculating, setIsCalculating] = useState(false);
  const [measurementResultsOpen, setMeasurementResultsOpen] = useState(false);
  const [calculatedMeasurements, setCalculatedMeasurements] = useState<any>(null);

  const loading = authLoading || profileLoading;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const { error } = await signOut();
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      });
      navigate('/store');
    }
    setIsSigningOut(false);
  };

  const handleCalculateMeasurements = async () => {
    if (!profile) {
      toast({
        title: "Error",
        description: "Profile not loaded. Please try again.",
        variant: "destructive"
      });
      return;
    }

    // Check if user has uploaded photos
    if (!profile.photos || profile.photos.length < 2) {
      toast({
        title: "Photos Required",
        description: "Please upload front and side photos first to calculate measurements.",
        variant: "destructive"
      });
      navigate('/update-profile');
      return;
    }

    setIsCalculating(true);
    try {
      console.log("Calling extractMeasurementsFromUrls with profile:", profile);
      const measurements = await extractMeasurementsFromUrls(profile);
      console.log("Received measurements:", measurements);
      
      // Save measurements to database
      const updates = {
        chest_inches: measurements.chest || measurements.measurements?.chest,
        waist_inches: measurements.waist || measurements.measurements?.waist,
        hip_inches: measurements.hip || measurements.measurements?.hip,
        shoulder_inches: measurements.shoulder || measurements.measurements?.shoulder,
      };

      // Store additional measurements in localStorage for display
      if (measurements.neck || measurements.measurements?.neck) {
        localStorage.setItem('neck_inches', String(measurements.neck || measurements.measurements?.neck));
      }
      if (measurements.inseam || measurements.measurements?.inseam) {
        localStorage.setItem('inseam_inches', String(measurements.inseam || measurements.measurements?.inseam));
      }
      if (measurements.body_length || measurements.measurements?.body_length) {
        localStorage.setItem('body_length_inches', String(measurements.body_length || measurements.measurements?.body_length));
      }

      const { error } = await updateProfile(updates);

      if (error) {
        throw new Error(error);
      }

      setCalculatedMeasurements(measurements);
      setMeasurementResultsOpen(true);
      
      toast({
        title: "Success",
        description: "Measurements calculated and saved successfully!",
      });
    } catch (error: any) {
      console.error("Error calculating measurements:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to calculate measurements. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };


  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword) {
      toast({
        title: "Error",
        description: "Please enter your current password.",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (!user?.email) {
      toast({
        title: "Error",
        description: "No email found for this account.",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      // Re-authenticate with current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordForm.currentPassword,
      });

      if (signInError) {
        throw new Error("Current password is incorrect.");
      }

      // Now update to the new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Success",
        description: "Password changed successfully.",
      });

      // Reset form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsSettingsExpanded(false);
    } catch (error) {
      const raw = error instanceof Error ? error.message : "Failed to change password.";
      const friendly = /same password|New password should be different/i.test(raw)
        ? "New password must be different from the current password."
        : raw;

      toast({
        title: "Error",
        description: friendly,
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user && !loading) {
    // Device-aware navigation - mobile users go to sign-in, kiosk users go to signup-options
    const redirectPath = isMobile ? '/sign-in' : '/signup-options';
    navigate(redirectPath);
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white flex lg:max-w-sm w-full flex-col mx-auto min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  const displayName = profile?.full_name || user?.email || 'User';

  return (
    <div className="bg-white flex lg:max-w-sm w-full flex-col mx-auto min-h-screen">
      <Topbar handleBack={() => navigate("/store")} showBack={true} />

      <div className="flex-1 p-4">
        {/* Profile Header with Body Photos */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-xl font-semibold mb-1">{displayName}</h2>
              <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
              
              {/* Body Photos Grid */}
              <div className="w-full mb-4">
                <h3 className="text-sm font-medium text-foreground mb-3">Body Photos</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Front Photo */}
                  <div>
                    <label className="block text-xs text-muted-foreground mb-2">Front</label>
                    {profile?.photos?.[0] ? (
                      <div className="w-full h-48 rounded-lg overflow-hidden border-2 border-border">
                        <img 
                          src={profile.photos[0]} 
                          alt="Front view" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center bg-muted">
                        <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground">No photo</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Side Photo */}
                  <div>
                    <label className="block text-xs text-muted-foreground mb-2">Side</label>
                    {profile?.photos?.[1] ? (
                      <div className="w-full h-48 rounded-lg overflow-hidden border-2 border-border">
                        <img 
                          src={profile.photos[1]} 
                          alt="Side view" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center bg-muted">
                        <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground">No photo</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Edit Profile Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/update-profile')}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Sizing Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>AI Body Measurements</span>
              <Badge 
                className={profile?.chest_inches ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
              >
                {profile?.chest_inches ? "Calculated" : "Needs Calculation"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.chest_inches ? (
              <>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Chest:</span>
                    <span className="ml-2 font-medium">{profile.chest_inches}"</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Waist:</span>
                    <span className="ml-2 font-medium">{profile.waist_inches}"</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Hip:</span>
                    <span className="ml-2 font-medium">{profile.hip_inches}"</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Shoulder:</span>
                    <span className="ml-2 font-medium">{profile.shoulder_inches}"</span>
                  </div>
                  {/* Display neck measurement from localStorage if available */}
                  {(localStorage.getItem('neck_inches') || (profile as any)?.neck_inches) && (
                    <div>
                      <span className="text-gray-600">Neck:</span>
                      <span className="ml-2 font-medium">{localStorage.getItem('neck_inches') || (profile as any)?.neck_inches}"</span>
                    </div>
                  )}
                  {/* Display inseam measurement from localStorage if available */}
                  {(localStorage.getItem('inseam_inches') || (profile as any)?.inseam_inches) && (
                    <div>
                      <span className="text-gray-600">Inseam:</span>
                      <span className="ml-2 font-medium">{localStorage.getItem('inseam_inches') || (profile as any)?.inseam_inches}"</span>
                    </div>
                  )}
                  {/* Display body length measurement from localStorage if available */}
                  {(localStorage.getItem('body_length_inches') || (profile as any)?.body_length_inches) && (
                    <div>
                      <span className="text-gray-600">Body Length:</span>
                      <span className="ml-2 font-medium">{localStorage.getItem('body_length_inches') || (profile as any)?.body_length_inches}"</span>
                    </div>
                  )}
                  {profile.height && (
                    <div>
                      <span className="text-gray-600">Height:</span>
                      <span className="ml-2 font-medium">{profile.height} cm</span>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="mt-4 space-y-3">
                  {/* Last updated timestamp */}
                  {profile.updated_at && (
                    <div className="text-xs text-gray-500 text-center">
                      Last updated: {new Date(profile.updated_at).toLocaleString()}
                    </div>
                  )}
                  
                  {/* Recalculate Button - Centered */}
                  <div className="flex justify-center">
                    <Button 
                      onClick={handleCalculateMeasurements}
                      disabled={isCalculating}
                      className="bg-black hover:bg-gray-800 text-white px-8 py-2 rounded-xl"
                    >
                      {isCalculating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Calculating...
                        </>
                      ) : (
                        'Recalculate with AI'
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-4">
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Get precise body measurements using our AI. Upload your photos and let us do the rest!
                </p>
                <Button
                  onClick={handleCalculateMeasurements}
                  disabled={isCalculating}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    'Calculate My Size with AI'
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Body Measurements */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Body Measurements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile && (profile.height || profile.weight || profile.gender) ? (
              <>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {profile.gender && (
                    <div>
                      <span className="text-gray-600">Gender:</span>
                      <span className="ml-2 font-medium">{profile.gender}</span>
                    </div>
                  )}
                  {profile.height && (
                    <div>
                      <span className="text-gray-600">Height:</span>
                      <span className="ml-2 font-medium">{profile.height} cm</span>
                    </div>
                  )}
                  {profile.weight && (
                    <div>
                      <span className="text-gray-600">Weight:</span>
                      <span className="ml-2 font-medium">{profile.weight} kg</span>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {profile.shirt_size && (
                    <div>
                      <span className="text-gray-600">Shirt Size:</span>
                      <span className="ml-2 font-medium">{profile.shirt_size}</span>
                    </div>
                  )}
                  {profile.pants_size && (
                    <div>
                      <span className="text-gray-600">Pants Size:</span>
                      <span className="ml-2 font-medium">{profile.pants_size}</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Add your body measurements to get personalized size recommendations
                </p>
                <Button
                  onClick={() => navigate('/fit-profile')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Complete Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>


        {/* Menu Options */}
        <div className="space-y-2 mb-6">
          {/* Switch to Mobile - Only show on kiosk/desktop */}
          {(isKiosk || isDesktop) && (
            <Button
              variant="ghost"
              className="w-full justify-start h-12"
              onClick={() => setShowMobileSwitchDialog(true)}
            >
              <Smartphone className="w-5 h-5 mr-3" />
              Switch to Mobile
            </Button>
          )}
          
          <Button
            variant="ghost"
            className="w-full justify-between h-12"
            onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
          >
            <div className="flex items-center">
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </div>
            {isSettingsExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
          
          {/* Expanded Settings Section */}
          {isSettingsExpanded && (
            <Card className="mx-auto max-w-md">
              <CardHeader>
                <CardTitle className="text-base text-center">Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handlePasswordChange}
                    disabled={
                      isChangingPassword ||
                      !passwordForm.currentPassword ||
                      !passwordForm.newPassword ||
                      !passwordForm.confirmPassword
                    }
                    className="flex-1"
                  >
                    {isChangingPassword ? "Changing..." : "Change Password"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPasswordForm({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                      setIsSettingsExpanded(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator className="mb-6" />

        {/* Sign Out */}
        <Button
          variant="ghost"
          className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50 mb-20"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOut className="w-5 h-5 mr-3" />
          {isSigningOut ? 'Signing out...' : 'Sign Out'}
        </Button>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
      
      {/* Mobile Switch QR Dialog */}
      <MobileSwitchQRDialog
        open={showMobileSwitchDialog}
        onClose={() => setShowMobileSwitchDialog(false)}
      />

      {/* Measurement Results Dialog */}
      <MeasurementResultsDialog
        isOpen={measurementResultsOpen}
        onClose={() => setMeasurementResultsOpen(false)}
        onSave={() => {
          setMeasurementResultsOpen(false);
          toast({
            title: "Success",
            description: "Measurements have been saved to your profile!",
          });
        }}
        measurements={calculatedMeasurements}
        isSaving={false}
        recommendedSize={null}
        fitScore={null}
        alternativeSizes={null}
      />
    </div>
  );
}