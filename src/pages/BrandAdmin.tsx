import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBrands } from '@/hooks/useBrands';
import { useBrand } from '@/contexts/BrandContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Topbar from '@/components/ui/topbar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function BrandAdmin() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: brands = [], refetch } = useBrands();
  const { currentBrand, setBrandBySlug } = useBrand();
  const [selectedBrand, setSelectedBrand] = useState<string>('');

  // Redirect if not authenticated (in a real app, add admin role check)
  if (!isAuthenticated) {
    navigate('/sign-in');
    return null;
  }

  const handleBrandSwitch = async () => {
    if (selectedBrand) {
      try {
        await setBrandBySlug(selectedBrand);
        toast.success(`Switched to ${selectedBrand.toUpperCase()}`);
        navigate('/store');
      } catch (error) {
        toast.error('Failed to switch brand');
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-white flex lg:max-w-sm w-full flex-col mx-auto min-h-screen">
      <Topbar handleBack={handleBack} showBack={true} />
      
      <div className="flex-1 p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Brand Administration</h1>
          <p className="text-gray-600 mt-2">Manage multi-brand platform</p>
        </div>

        {/* Current Brand Info */}
        {currentBrand && (
          <Card>
            <CardHeader>
              <CardTitle>Current Brand</CardTitle>
              <CardDescription>Currently active brand context</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                {currentBrand.logo_url && (
                  <img 
                    src={currentBrand.logo_url} 
                    alt={`${currentBrand.name} logo`}
                    className="w-12 h-12 object-contain"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-lg">{currentBrand.name}</h3>
                  <p className="text-sm text-gray-600">Slug: {currentBrand.slug}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" style={{ backgroundColor: currentBrand.primary_color, color: currentBrand.secondary_color }}>
                      Primary
                    </Badge>
                    <Badge variant="outline" style={{ borderColor: currentBrand.secondary_color, color: currentBrand.secondary_color }}>
                      Secondary
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Brand Switcher */}
        <Card>
          <CardHeader>
            <CardTitle>Switch Brand</CardTitle>
            <CardDescription>Change the active brand context</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="brand-select">Select Brand</Label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a brand..." />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.slug}>
                      <div className="flex items-center space-x-2">
                        {brand.logo_url && (
                          <img 
                            src={brand.logo_url} 
                            alt={`${brand.name} logo`}
                            className="w-5 h-5 object-contain"
                          />
                        )}
                        <span>{brand.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleBrandSwitch} 
              disabled={!selectedBrand || selectedBrand === currentBrand?.slug}
              className="w-full"
            >
              Switch to {selectedBrand ? selectedBrand.toUpperCase() : 'Selected Brand'}
            </Button>
          </CardContent>
        </Card>

        {/* All Brands List */}
        <Card>
          <CardHeader>
            <CardTitle>Available Brands</CardTitle>
            <CardDescription>All brands in the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {brand.logo_url && (
                      <img 
                        src={brand.logo_url} 
                        alt={`${brand.name} logo`}
                        className="w-8 h-8 object-contain"
                      />
                    )}
                    <div>
                      <h4 className="font-medium">{brand.name}</h4>
                      <p className="text-sm text-gray-600">{brand.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={brand.is_active ? "default" : "secondary"}
                    >
                      {brand.is_active ? "Active" : "Inactive"}
                    </Badge>
                    {currentBrand?.id === brand.id && (
                      <Badge variant="outline">Current</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={() => navigate('/store')}>
            View Store
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/store?brand=hm'}>
            Test H&M
          </Button>
        </div>

        {/* URL Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Brand URL Examples</CardTitle>
            <CardDescription>How to access different brands</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <p className="font-medium">Query Parameter:</p>
              <code className="text-xs bg-gray-100 p-1 rounded">?brand=hm</code>
            </div>
            <div className="text-sm">
              <p className="font-medium">Path Based:</p>
              <code className="text-xs bg-gray-100 p-1 rounded">/brand/hm</code>
            </div>
            <div className="text-sm">
              <p className="font-medium">Subdomain:</p>
              <code className="text-xs bg-gray-100 p-1 rounded">hm.yourapp.com</code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}