import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, User, Settings, ShoppingBag, LogOut, Camera, Home, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

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

  if (!user && !loading) {
    navigate('/sign-in');
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
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/store')}
          className="mr-3"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Profile</h1>
      </div>

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
          
          <Button
            variant="ghost"
            className="w-full justify-start h-12"
            onClick={() => navigate('/wishlist')}
          >
            <ShoppingBag className="w-5 h-5 mr-3" />
            My Orders
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start h-12"
            onClick={() => navigate('/wishlist')}
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Button>
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
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 lg:max-w-sm w-full bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex justify-around">
          <button 
            className="flex flex-col items-center space-y-1"
            onClick={() => navigate('/store')}
          >
            <Home className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Home</span>
          </button>
          <button 
            className="flex flex-col items-center space-y-1"
            onClick={() => navigate('/cart')}
          >
            <ShoppingBag className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Cart</span>
          </button>
          <button 
            className="flex flex-col items-center space-y-1"
            onClick={() => navigate('/product-scan')}
          >
            <Camera className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Scan</span>
          </button>
          <button 
            className="flex flex-col items-center space-y-1"
            onClick={() => navigate('/wishlist')}
          >
            <Heart className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Wishlist</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <User className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}