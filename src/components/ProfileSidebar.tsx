import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Eye, EyeOff, LogOut, Edit, Ruler, Palette } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useProfileSidebar } from '@/contexts/ProfileSidebarContext';
import { useAuthState } from '@/hooks/useAuthState';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function ProfileSidebar() {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { isOpen, closeSidebar } = useProfileSidebar();
  const { deviceType } = useAuthState();
  const navigate = useNavigate();

  const [showSettings, setShowSettings] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSignOut = async () => {
    await signOut();
    closeSidebar();
    navigate('/store');
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowSettings(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update password",
        variant: "destructive",
      });
    }
  };

  const userInitials = user?.email?.substring(0, 2).toUpperCase() || 'U';

  // Device-specific configuration
  const getDeviceConfig = () => {
    switch (deviceType) {
      case 'kiosk':
        return {
          containerClass: 'max-w-2xl w-full mx-auto',
          heightClass: 'h-[90vh]',
          textSize: 'text-xl',
          avatarSize: 'w-20 h-20',
          buttonSize: 'default' as const,
          spacing: 'space-y-8 p-8'
        };
      case 'desktop':
        return {
          containerClass: 'max-w-lg w-full mx-auto',
          heightClass: 'h-[88vh]',
          textSize: 'text-lg',
          avatarSize: 'w-16 h-16',
          buttonSize: 'default' as const,
          spacing: 'space-y-6 p-6'
        };
      default: // mobile
        return {
          containerClass: 'max-w-md mx-auto',
          heightClass: 'h-[85vh]',
          textSize: 'text-base',
          avatarSize: 'w-16 h-16',
          buttonSize: 'default' as const,
          spacing: 'space-y-6 p-6'
        };
    }
  };

  const config = getDeviceConfig();

  // Profile content component (shared between Dialog and Drawer)
  const ProfileContent = () => (
    <div className={`${config.spacing} overflow-y-auto`}>
      {/* Profile Header */}
      <div className="flex items-center space-x-4">
        <Avatar className={config.avatarSize}>
          <AvatarImage src={profile?.avatar_url || ''} />
          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className={`${config.textSize} font-semibold`}>{profile?.full_name || 'User'}</h2>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {/* Body Measurements */}
      {(profile?.height || profile?.weight || profile?.chest || profile?.waist) && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className={`${config.textSize} flex items-center gap-2`}>
              <Ruler className="w-5 h-5 text-primary" />
              Body Measurements
            </CardTitle>
            <Button
              variant="ghost"
              size={deviceType === 'kiosk' ? 'default' : 'sm'}
              onClick={() => {
                closeSidebar();
                navigate('/measurement-profile');
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {profile.height && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Height:</span>
                <span>{profile.height} cm</span>
              </div>
            )}
            {profile.weight && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weight:</span>
                <span>{profile.weight} kg</span>
              </div>
            )}
            {profile.chest && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chest:</span>
                <span>{profile.chest} cm</span>
              </div>
            )}
            {profile.waist && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Waist:</span>
                <span>{profile.waist} cm</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Style Preferences */}
      {profile?.style_preferences && profile.style_preferences.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className={`${config.textSize} flex items-center gap-2`}>
              <Palette className="w-5 h-5 text-primary" />
              Style Preferences
            </CardTitle>
            <Button
              variant="ghost"
              size={deviceType === 'kiosk' ? 'default' : 'sm'}
              onClick={() => {
                closeSidebar();
                navigate('/fit-profile');
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.style_preferences.map((style) => (
                <span
                  key={style}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {style}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings */}
      <Collapsible open={showSettings} onOpenChange={setShowSettings}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-start" size={config.buttonSize}>
            <Settings className="w-4 h-4 mr-2" />
            Account Settings
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className={config.textSize}>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>
              <Button onClick={handlePasswordChange} className="w-full" size={config.buttonSize}>
                Update Password
              </Button>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Sign Out */}
      <Button
        variant="destructive"
        onClick={handleSignOut}
        className="w-full justify-start"
        size={config.buttonSize}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );

  // Conditional rendering based on device type
  if (deviceType === 'mobile') {
    return (
      <Drawer open={isOpen} onOpenChange={closeSidebar}>
        <DrawerContent className={`${config.heightClass} ${config.containerClass}`}>
          <DrawerHeader>
            <DrawerTitle>Profile</DrawerTitle>
          </DrawerHeader>
          <ProfileContent />
        </DrawerContent>
      </Drawer>
    );
  }

  // Kiosk and Desktop use Dialog
  return (
    <Dialog open={isOpen} onOpenChange={closeSidebar}>
      <DialogContent className={`${config.containerClass} ${config.heightClass} flex flex-col`}>
        <DialogHeader>
          <DialogTitle className={config.textSize}>Profile</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <ProfileContent />
        </div>
      </DialogContent>
    </Dialog>
  );
}