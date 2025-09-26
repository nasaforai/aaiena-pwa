import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, User, Settings, ShoppingBag, LogOut, Camera, Home, Heart, ChevronDown, ChevronUp, Eye, EyeOff, Smartphone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useAuthState } from "@/hooks/useAuthState";
import Topbar from "@/components/ui/topbar";

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { toast } = useToast();
  const { isKiosk, isDesktop } = useAuthState();
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
    const { deviceType } = useAuth();
    const redirectPath = deviceType === 'mobile' ? '/signin' : '/signup-options';
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
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white flex lg:max-w-sm w-full flex-col mx-auto min-h-screen">
      <Topbar handleBack={() => navigate("/store")} showBack={true} />

      <div className="flex-1 p-4">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile?.avatar_url || ''} alt={displayName} />
                  <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full"
                  onClick={() => navigate('/update-profile')}
                >
                  <Camera className="w-3 h-3" />
                </Button>
              </div>
              
              <h2 className="text-xl font-semibold mb-1">{displayName}</h2>
              <p className="text-sm text-gray-600 mb-3">{user?.email}</p>
              
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

        {/* Body Measurements */}
        {profile && (profile.height || profile.weight || profile.chest || profile.waist) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Body Measurements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
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
                {profile.chest && (
                  <div>
                    <span className="text-gray-600">Chest:</span>
                    <span className="ml-2 font-medium">{profile.chest} cm</span>
                  </div>
                )}
                {profile.waist && (
                  <div>
                    <span className="text-gray-600">Waist:</span>
                    <span className="ml-2 font-medium">{profile.waist} cm</span>
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
            </CardContent>
          </Card>
        )}

        {/* Style Preferences */}
        {profile?.style_preferences && profile.style_preferences.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Style Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.style_preferences.map((style, index) => (
                  <Badge key={index} variant="secondary">
                    {style}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Menu Options */}
        <div className="space-y-2 mb-6">
          <Button
            variant="ghost"
            className="w-full justify-start h-12"
            onClick={() => navigate('/measurement-profile')}
          >
            <User className="w-5 h-5 mr-3" />
            Body Measurements
          </Button>
          
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
            <Card className="ml-8 mr-0">
              <CardHeader>
                <CardTitle className="text-base">Change Password</CardTitle>
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
    </div>
  );
}