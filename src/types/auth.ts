import { User, Session } from '@supabase/supabase-js';

export type DeviceType = 'mobile' | 'kiosk' | 'desktop';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  size?: string;
  color?: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasProfile: boolean | null;
  deviceType: DeviceType;
  fromKiosk: boolean;
  hasMeasurements: boolean;
  cartItems: CartItem[];
  wishlistItems: WishlistItem[];
}

export interface AuthContextType extends AuthState {
  signOut: () => Promise<{ error: any }>;
  checkProfile: () => Promise<void>;
  // Cart management
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  // Wishlist management
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (itemId: string) => void;
  clearWishlist: () => void;
  // Device/measurement management
  setFromKiosk: (value: boolean) => void;
  setHasMeasurements: (value: boolean) => void;
}