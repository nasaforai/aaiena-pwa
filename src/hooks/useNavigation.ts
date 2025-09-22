import { useCallback } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { NavigationManager } from '@/utils/navigationManager';
import { useAuthState } from '@/hooks/useAuthState';

/**
 * Enhanced navigation hook that provides intelligent routing based on auth state and device type
 */
export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, hasProfile, deviceType, isAuthenticated } = useAuthState();

  const sessionId = searchParams.get('session_id');
  const returnTo = searchParams.get('returnTo');

  /**
   * Navigate after successful authentication
   */
  const navigateAfterAuth = useCallback(() => {
    if (!user) return;
    
    const redirectPath = NavigationManager.redirectAfterAuth(
      user, 
      hasProfile, 
      deviceType, 
      sessionId || undefined
    );
    
    navigate(redirectPath, { replace: true });
  }, [user, hasProfile, deviceType, sessionId, navigate]);

  /**
   * Navigate to sign in with proper context
   */
  const navigateToSignIn = useCallback((customReturnTo?: string) => {
    const redirectPath = NavigationManager.getSignInRedirect(
      deviceType,
      sessionId || undefined,
      customReturnTo || returnTo || undefined
    );
    
    navigate(redirectPath);
  }, [deviceType, sessionId, returnTo, navigate]);

  /**
   * Navigate to sign up with proper context
   */
  const navigateToSignUp = useCallback(() => {
    if (deviceType === 'kiosk') {
      const kioskPath = NavigationManager.handleKioskFlow(sessionId || undefined);
      navigate(kioskPath);
    } else {
      const mobilePath = NavigationManager.handleMobileFlow(!!sessionId);
      navigate(mobilePath);
    }
  }, [deviceType, sessionId, navigate]);

  /**
   * Navigate back with intelligent fallback
   */
  const navigateBack = useCallback((fallbackPath?: string) => {
    // Check if we can go back in history
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    
    // Use provided fallback or determine based on context
    const fallback = fallbackPath || 
      NavigationManager.getWelcomeRoute(deviceType, false);
    
    navigate(fallback);
  }, [navigate, deviceType]);

  /**
   * Protected navigation - requires authentication
   */
  const navigateProtected = useCallback((path: string) => {
    if (!isAuthenticated) {
      navigateToSignIn(path);
      return;
    }
    
    const validatedPath = NavigationManager.validateRedirectUrl(path);
    navigate(validatedPath);
  }, [isAuthenticated, navigateToSignIn, navigate]);

  /**
   * Navigate with error handling
   */
  const navigateSafe = useCallback((path: string) => {
    try {
      const safePath = NavigationManager.validateRedirectUrl(path);
      navigate(safePath);
    } catch (error) {
      const errorPath = NavigationManager.handleNavigationError(error as Error, deviceType);
      navigate(errorPath);
    }
  }, [navigate, deviceType]);

  /**
   * Check if current route requires authentication
   */
  const requiresAuth = useCallback(() => {
    return NavigationManager.requiresAuth(location.pathname);
  }, [location.pathname]);

  /**
   * Get current route context
   */
  const getRouteContext = useCallback(() => {
    return {
      pathname: location.pathname,
      search: location.search,
      sessionId,
      returnTo,
      isAuthRequired: requiresAuth(),
      deviceType,
      isAuthenticated
    };
  }, [location, sessionId, returnTo, requiresAuth, deviceType, isAuthenticated]);

  return {
    navigate: navigateSafe,
    navigateAfterAuth,
    navigateToSignIn,
    navigateToSignUp,
    navigateBack,
    navigateProtected,
    requiresAuth,
    getRouteContext,
    
    // Direct access to underlying hooks for advanced usage
    rawNavigate: navigate,
    location,
    searchParams
  };
};