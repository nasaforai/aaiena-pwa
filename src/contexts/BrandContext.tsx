import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  description: string | null;
  theme_config: Json;
  domain: string | null;
  is_active: boolean;
}

interface BrandContextType {
  currentBrand: Brand | null;
  loading: boolean;
  error: string | null;
  setBrandBySlug: (slug: string) => Promise<void>;
  getAllBrands: () => Promise<Brand[]>;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};

interface BrandProviderProps {
  children: React.ReactNode;
}

export const BrandProvider: React.FC<BrandProviderProps> = ({ children }) => {
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const detectBrandFromURL = (): string => {
    // Try to detect brand from URL path (e.g., /brand/hm)
    const pathMatch = window.location.pathname.match(/^\/brand\/([^\/]+)/);
    if (pathMatch) {
      return pathMatch[1];
    }

    // Try to detect from subdomain (e.g., hm.yourapp.com)
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    
    // Skip Lovable project IDs and development environments
    const isLovableProjectId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(subdomain);
    const isDevelopment = ['localhost', 'www', '127', '192'].some(dev => subdomain.startsWith(dev));
    
    if (subdomain && !isLovableProjectId && !isDevelopment) {
      return subdomain;
    }

    // Try to detect from query parameter (e.g., ?brand=hm)
    const urlParams = new URLSearchParams(window.location.search);
    const brandParam = urlParams.get('brand');
    if (brandParam) {
      return brandParam;
    }

    // Default to 'hm' if no brand detected
    return 'hm';
  };

  const setBrandBySlug = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('brands')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (fetchError) {
        console.warn(`Brand not found: ${slug}, using default brand`);
        // Try to fetch any available brand as fallback
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('brands')
          .select('*')
          .eq('is_active', true)
          .limit(1)
          .single();
        
        if (fallbackError || !fallbackData) {
          // Create a default brand object if no brands exist
          setCurrentBrand({
            id: 'default',
            name: 'Fashion Store',
            slug: 'default',
            logo_url: null,
            primary_color: '#000000',
            secondary_color: '#ffffff',
            description: 'Default Fashion Store',
            theme_config: {},
            domain: null,
            is_active: true
          });
        } else {
          setCurrentBrand(fallbackData);
        }
      } else {
        setCurrentBrand(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load brand');
      console.error('Error loading brand:', err);
      // Set a default brand to prevent app from breaking
      setCurrentBrand({
        id: 'default',
        name: 'Fashion Store',
        slug: 'default',
        logo_url: null,
        primary_color: '#000000',
        secondary_color: '#ffffff',
        description: 'Default Fashion Store',
        theme_config: {},
        domain: null,
        is_active: true
      });
    } finally {
      setLoading(false);
    }
  };

  const getAllBrands = async (): Promise<Brand[]> => {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      throw new Error('Failed to fetch brands');
    }

    return data || [];
  };

  useEffect(() => {
    const brandSlug = detectBrandFromURL();
    setBrandBySlug(brandSlug);
  }, []);

  const value: BrandContextType = {
    currentBrand,
    loading,
    error,
    setBrandBySlug,
    getAllBrands,
  };

  return (
    <BrandContext.Provider value={value}>
      {children}
    </BrandContext.Provider>
  );
};