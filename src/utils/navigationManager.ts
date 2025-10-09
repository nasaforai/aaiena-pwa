import { User } from '@supabase/supabase-js';
import { DeviceType } from '@/types/auth';

export class NavigationManager {
  /**
   * Determines the correct redirect path after authentication
   */
  static redirectAfterAuth(
    user: User, 
    hasProfile: boolean | null, 
    deviceType: DeviceType,
    sessionId?: string
  ): string {
    // If user doesn't have a profile, redirect to profile creation
    if (hasProfile === false) {
      return '/fit-profile';
    }
    
    // If we have a session ID, we're in a kiosk flow
    if (sessionId) {
      return `/device-connected?session_id=${sessionId}`;
    }
    
    // Default redirect based on device type
    switch (deviceType) {
      case 'kiosk':
        return '/store';
      case 'mobile':
        return '/';
      default:
        return '/';
    }
  }

  /**
   * Handles kiosk-specific navigation flow
   */
  static handleKioskFlow(sessionId?: string): string {
    if (!sessionId) {
      // Generate new session for kiosk
      const newSessionId = crypto.randomUUID();
      return `/signup-options?session_id=${newSessionId}`;
    }
    
    return `/signup-options?session_id=${sessionId}`;
  }

  /**
   * Handles mobile-specific navigation flow
   */
  static handleMobileFlow(fromKiosk: boolean = false): string {
    if (fromKiosk) {
      return '/signup';
    }
    
    return '/welcome';
  }

  /**
   * Determines sign-in redirect based on context
   */
  static getSignInRedirect(
    deviceType: DeviceType,
    sessionId?: string,
    returnTo?: string
  ): string {
    // Use returnTo if provided
    if (returnTo && !returnTo.includes('signin') && !returnTo.includes('signup')) {
      return returnTo;
    }

    // Session-based redirect
    if (sessionId) {
      return `/signin?session_id=${sessionId}`;
    }

    // Device-specific defaults
    switch (deviceType) {
      case 'kiosk':
        return '/signup-options';
      case 'mobile':
        return '/signin';
      default:
        return '/signin';
    }
  }

  /**
   * Validates and cleans navigation URLs
   */
  static validateRedirectUrl(url: string, allowedPaths: string[] = []): string {
    const defaultPaths = ['/', '/store', '/profile', '/cart', '/wishlist'];
    const allowed = [...defaultPaths, ...allowedPaths];
    
    // Remove query params for validation
    const pathOnly = url.split('?')[0];
    
    if (allowed.includes(pathOnly)) {
      return url;
    }
    
    // Return safe default
    return '/';
  }

  /**
   * Handles navigation errors and provides fallback routes
   */
  static handleNavigationError(error: Error, deviceType: DeviceType): string {
    console.error('Navigation error:', error);
    
    // Provide safe fallbacks based on device type
    switch (deviceType) {
      case 'kiosk':
        return '/store';
      case 'mobile':
        return '/';
      default:
        return '/';
    }
  }

  /**
   * Checks if current route requires authentication
   */
  static requiresAuth(pathname: string): boolean {
    const publicRoutes = [
      '/',
      '/welcome', 
      '/signin',
      '/signup',
      '/signup-options',
      '/device-connect-flow'
    ];
    
    return !publicRoutes.some(route => pathname.startsWith(route));
  }

  /**
   * Gets the appropriate welcome route based on device and context
   */
  static getWelcomeRoute(deviceType: DeviceType, isFirstTime: boolean = true): string {
    if (!isFirstTime) {
      return NavigationManager.redirectAfterAuth({} as User, true, deviceType);
    }

    switch (deviceType) {
      case 'kiosk':
        return '/signup-options';
      case 'mobile':
        return '/welcome';
      default:
        return '/welcome';
    }
  }
}