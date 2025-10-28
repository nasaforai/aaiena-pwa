import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { DeviceType, CartItem, WishlistItem, AuthContextType } from '@/types/auth';

// Device detection utility
const getDeviceType = (): DeviceType => {
  if (typeof window === 'undefined') return 'desktop';
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isKiosk = window.location.search.includes('kiosk=true') || 
                 localStorage.getItem('deviceType') === 'kiosk';
  
  if (isKiosk) return 'kiosk';
  if (isMobile) return 'mobile';
  return 'desktop';
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  
  // Enhanced state management
  const [deviceType] = useState<DeviceType>(getDeviceType);
  const [fromKiosk, setFromKiosk] = useState<boolean>(() => 
    Boolean(localStorage.getItem('fromKiosk')) || window.location.search.includes('session_id=')
  );
  const [hasMeasurements, setHasMeasurements] = useState<boolean>(() => 
    Boolean(localStorage.getItem('hasMeasurements'))
  );
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const checkProfile = async () => {
    if (!user) {
      setHasProfile(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking profile:', error);
        setHasProfile(false);
        return;
      }

      setHasProfile(!!data);
    } catch (error) {
      console.error('Error checking profile:', error);
      setHasProfile(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change event:', event, 'Session:', !!session, 'User:', !!session?.user);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check profile when user changes
        if (session?.user) {
          console.log('User authenticated, checking profile for:', session.user.id);
          setTimeout(() => {
            checkProfile();
          }, 0);
        } else {
          console.log('No user in session, clearing profile state');
          setHasProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', !!session, 'User:', !!session?.user);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      // Check profile for existing session
      if (session?.user) {
        console.log('Existing session found, checking profile for:', session.user.id);
        setTimeout(() => {
          checkProfile();
        }, 0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Cart management functions
  const addToCart = useCallback((item: CartItem) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(cartItem => cartItem.id === item.id);
      let newCart;
      if (existingIndex >= 0) {
        newCart = [...prev];
        newCart[existingIndex].quantity += item.quantity;
      } else {
        newCart = [...prev, item];
      }
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prev => {
      const newCart = prev.filter(item => item.id !== itemId);
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  }, []);

  const updateCartQuantity = useCallback((itemId: string, quantity: number) => {
    setCartItems(prev => {
      const newCart = prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('cart');
  }, []);

  // Wishlist management functions
  const addToWishlist = useCallback((item: WishlistItem) => {
    setWishlistItems(prev => {
      if (prev.some(wishItem => wishItem.id === item.id)) {
        return prev; // Already in wishlist
      }
      const newWishlist = [...prev, item];
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  }, []);

  const removeFromWishlist = useCallback((itemId: string) => {
    setWishlistItems(prev => {
      const newWishlist = prev.filter(item => item.id !== itemId);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
    localStorage.removeItem('wishlist');
  }, []);

  // Device/measurement management
  const setFromKioskCallback = useCallback((value: boolean) => {
    setFromKiosk(value);
    if (value) {
      localStorage.setItem('fromKiosk', 'true');
    } else {
      localStorage.removeItem('fromKiosk');
    }
  }, []);

  const setHasMeasurementsCallback = useCallback((value: boolean) => {
    setHasMeasurements(value);
    if (value) {
      localStorage.setItem('hasMeasurements', 'true');
    } else {
      localStorage.removeItem('hasMeasurements');
    }
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      // Clean up all localStorage flags and data
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('hasMeasurements');
      localStorage.removeItem('fromKiosk');
      localStorage.removeItem('cart');
      localStorage.removeItem('wishlist');
      
      // Reset state
      setHasProfile(null);
      setFromKiosk(false);
      setHasMeasurements(false);
      setCartItems([]);
      setWishlistItems([]);
    }
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signOut,
        isAuthenticated: !!user,
        hasProfile,
        checkProfile,
        deviceType,
        fromKiosk,
        hasMeasurements,
        cartItems,
        wishlistItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        setFromKiosk: setFromKioskCallback,
        setHasMeasurements: setHasMeasurementsCallback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}