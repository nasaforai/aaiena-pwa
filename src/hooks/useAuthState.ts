import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DeviceType, CartItem, WishlistItem } from '@/types/auth';

/**
 * Enhanced auth state hook that provides centralized access to all auth-related state
 * and eliminates direct localStorage access throughout the app
 */
export const useAuthState = () => {
  const auth = useAuth();

  // Device detection utilities
  const getDeviceType = useCallback((): DeviceType => {
    if (typeof window === 'undefined') return 'desktop';
    
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isKiosk = window.location.search.includes('kiosk=true') || 
                   localStorage.getItem('deviceType') === 'kiosk';
    
    if (isKiosk) return 'kiosk';
    if (isMobile) return 'mobile';
    return 'desktop';
  }, []);

  // Legacy localStorage migration utilities
  const migrateLegacyFlags = useCallback(() => {
    // Clean up old localStorage flags that are now managed by AuthContext
    const flagsToRemove = [
      'isLoggedIn',
      'hasMeasurements', 
      'fromKiosk',
      'cart',
      'wishlist'
    ];
    
    flagsToRemove.forEach(flag => {
      if (localStorage.getItem(flag)) {
        localStorage.removeItem(flag);
      }
    });
  }, []);

  // State validation utilities
  const validateAuthState = useCallback(() => {
    // Ensure consistency between auth state and localStorage
    if (auth.isAuthenticated) {
      migrateLegacyFlags();
      return true;
    }
    return false;
  }, [auth.isAuthenticated, migrateLegacyFlags]);

  return {
    ...auth,
    deviceType: auth.deviceType,
    getDeviceType,
    validateAuthState,
    migrateLegacyFlags,
    
    // Computed properties for common checks
    isKiosk: auth.deviceType === 'kiosk',
    isMobile: auth.deviceType === 'mobile',
    isDesktop: auth.deviceType === 'desktop',
    
    // Cart utilities
    cartTotal: auth.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    cartCount: auth.cartItems.reduce((sum, item) => sum + item.quantity, 0),
    
    // Wishlist utilities  
    wishlistCount: auth.wishlistItems.length,
    isInWishlist: (itemId: string) => auth.wishlistItems.some(item => item.id === itemId),
    isInCart: (itemId: string) => auth.cartItems.some(item => item.id === itemId),
  };
};