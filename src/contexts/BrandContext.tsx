import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import type { ReactNode } from 'react';

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
  children: ReactNode;
}

export const BrandProvider = ({ children }: BrandProviderProps) => {
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const detectBrandFromURL = (): string | null => {
    // PRIMARY: Try to detect from subdomain (e.g., hm.yourapp.com, ucb.yourapp.com)
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    
    // Skip Lovable project IDs, Lovable preview hosts, and development environments
    const isLovableProjectId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(subdomain);
    const isDevelopment = ['localhost', 'www', '127', '192'].some(dev => subdomain.startsWith(dev));
    
    // Enhanced Lovable host detection - catches all Lovable domains
    const isLovableHost = hostname.includes('lovable.app') || 
                          hostname.includes('lovable.dev') || 
                          hostname.includes('lovable.site') ||
                          hostname.includes('lovableproject.com');
    
    console.debug('Brand Detection Debug:', {
      hostname,
      subdomain,
      isLovableProjectId,
      isDevelopment,
      isLovableHost,
      pathname: window.location.pathname,
      search: window.location.search
    });
    
    // If we're in a development/preview environment, default to 'ucb' immediately
    if (isDevelopment || isLovableHost || isLovableProjectId) {
      console.debug('Using default brand "ucb" for development/preview environment');
      return 'ucb';
    }
    
    // For production: try to detect from subdomain
    if (subdomain) {
      console.debug('Detected brand from subdomain:', subdomain);
      return subdomain;
    }

    // FALLBACK 1: Try to detect brand from URL path (e.g., /brand/hm)
    const pathMatch = window.location.pathname.match(/^\/brand\/([^\/]+)/);
    if (pathMatch && pathMatch[1] && !pathMatch[1].startsWith(':')) {
      console.debug('Detected brand from path:', pathMatch[1]);
      return pathMatch[1];
    }

    // FALLBACK 2: Try to detect from query parameter (e.g., ?brand=hm)
    const urlParams = new URLSearchParams(window.location.search);
    const brandParam = urlParams.get('brand');
    if (brandParam) {
      console.debug('Detected brand from query param:', brandParam);
      return brandParam;
    }

    // No brand detected - this should only happen in production with misconfigured domain
    console.warn('No brand detected - returning null');
    return null;
  };

  const setBrandBySlug = async (slug: string | null) => {
    try {
      setLoading(true);
      setError(null);

      if (!slug) {
        setError('No brand specified. Please access this app through a valid brand domain.');
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('brands')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (fetchError || !data) {
        console.error(`Brand not found or inactive: ${slug}`);
        setError(`Brand "${slug}" not found or inactive. Please contact support.`);
        setCurrentBrand(null);
      } else {
        setCurrentBrand(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load brand');
      console.error('Error loading brand:', err);
      setCurrentBrand(null);
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