import React, { useEffect } from 'react';
import { useBrand } from '@/contexts/BrandContext';

interface BrandThemeProviderProps {
  children: React.ReactNode;
}

export const BrandThemeProvider: React.FC<BrandThemeProviderProps> = ({ children }) => {
  const { currentBrand, loading } = useBrand();

  useEffect(() => {
    if (!currentBrand || loading) return;

    // Apply brand-specific CSS custom properties
    const root = document.documentElement;
    
    // Convert hex colors to HSL for CSS custom properties
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0;
      let s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    // Apply brand colors
    const primaryHsl = hexToHsl(currentBrand.primary_color);
    const secondaryHsl = hexToHsl(currentBrand.secondary_color);

    root.style.setProperty('--brand-primary', primaryHsl);
    root.style.setProperty('--brand-secondary', secondaryHsl);

    // Apply any custom theme config
    if (currentBrand.theme_config && typeof currentBrand.theme_config === 'object' && currentBrand.theme_config !== null) {
      Object.entries(currentBrand.theme_config).forEach(([key, value]) => {
        if (typeof value === 'string') {
          root.style.setProperty(`--brand-${key}`, value);
        }
      });
    }

    // Update document title
    document.title = currentBrand.name;

    // Clean up on unmount
    return () => {
      root.style.removeProperty('--brand-primary');
      root.style.removeProperty('--brand-secondary');
      if (currentBrand.theme_config && typeof currentBrand.theme_config === 'object' && currentBrand.theme_config !== null) {
        Object.keys(currentBrand.theme_config).forEach((key) => {
          root.style.removeProperty(`--brand-${key}`);
        });
      }
    };
  }, [currentBrand, loading]);

  return <>{children}</>;
};