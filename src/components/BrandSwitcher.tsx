import React from 'react';
import { useBrand } from '@/contexts/BrandContext';
import { useBrands } from '@/hooks/useBrands';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BrandSwitcherProps {
  className?: string;
}

export const BrandSwitcher: React.FC<BrandSwitcherProps> = ({ className }) => {
  const { currentBrand, setBrandBySlug } = useBrand();
  const { data: brands = [] } = useBrands();

  const handleBrandChange = (brandSlug: string) => {
    setBrandBySlug(brandSlug);
  };

  if (brands.length <= 1) {
    return null; // Don't show switcher if there's only one brand
  }

  return (
    <Select value={currentBrand?.slug || ''} onValueChange={handleBrandChange}>
      <SelectTrigger className={className}>
        <SelectValue>
          <div className="flex items-center space-x-2">
            {currentBrand?.logo_url && (
              <img 
                src={currentBrand.logo_url} 
                alt={`${currentBrand.name} logo`}
                className="w-5 h-5 object-contain"
              />
            )}
            <span>{currentBrand?.name || 'Select Brand'}</span>
          </div>
        </SelectValue>
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
  );
};