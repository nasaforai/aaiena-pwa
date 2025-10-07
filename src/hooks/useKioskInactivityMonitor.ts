import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const INACTIVITY_WARNING_TIME = 15000; // 15 seconds
const INACTIVITY_LOGOUT_TIME = 30000; // 30 seconds
const COUNTDOWN_DURATION = 15; // 15 seconds for countdown

export const useKioskInactivityMonitor = () => {
  const { isAuthenticated, deviceType, signOut } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(COUNTDOWN_DURATION);
  
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const isKioskActive = isAuthenticated && deviceType === 'kiosk';

  // Log state changes for debugging
  useEffect(() => {
    console.log('[KioskInactivity] State:', { 
      isAuthenticated, 
      deviceType, 
      isKioskActive,
      showWarning 
    });
  }, [isAuthenticated, deviceType, isKioskActive, showWarning]);

  const clearAllTimers = useCallback(() => {
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  const startCountdown = useCallback(() => {
    setRemainingSeconds(COUNTDOWN_DURATION);
    
    countdownTimerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const forceLogout = useCallback(async () => {
    console.log('[KioskInactivity] Force logout triggered');
    clearAllTimers();
    setShowWarning(false);
    await signOut();
  }, [clearAllTimers, signOut]);

  const resetTimers = useCallback(() => {
    clearAllTimers();
    setShowWarning(false);
    lastActivityRef.current = Date.now();

    if (!isKioskActive) {
      console.log('[KioskInactivity] Not resetting timers - kiosk not active');
      return;
    }

    console.log('[KioskInactivity] Resetting timers - starting new inactivity countdown');

    // Set warning timer (15 seconds)
    warningTimerRef.current = setTimeout(() => {
      console.log('[KioskInactivity] Warning triggered - showing dialog');
      setShowWarning(true);
      startCountdown();
    }, INACTIVITY_WARNING_TIME);

    // Set logout timer (30 seconds)
    logoutTimerRef.current = setTimeout(() => {
      console.log('[KioskInactivity] Logout timer expired - forcing logout');
      forceLogout();
    }, INACTIVITY_LOGOUT_TIME);
  }, [isKioskActive, startCountdown, forceLogout, clearAllTimers]);

  const handleActivity = useCallback(() => {
    if (!isKioskActive) return;
    
    // If warning is showing, ignore activity - user must click a button
    if (showWarning) return;
    
    const now = Date.now();
    // Debounce activity events (minimum 100ms between resets)
    if (now - lastActivityRef.current < 100) return;
    
    resetTimers();
  }, [isKioskActive, showWarning, resetTimers]);

  const handleKeepLoggedIn = useCallback(() => {
    resetTimers();
  }, [resetTimers]);

  const handleSwitchToMobile = useCallback(() => {
    console.log('[KioskInactivity] User switched to mobile');
    clearAllTimers();
    setShowWarning(false);
  }, [clearAllTimers]);

  // Set up activity listeners
  useEffect(() => {
    if (!isKioskActive) {
      console.log('[KioskInactivity] Kiosk not active - clearing timers');
      clearAllTimers();
      setShowWarning(false);
      return;
    }

    console.log('[KioskInactivity] Kiosk active - setting up activity listeners');

    const activityEvents = [
      'mousedown',
      'mousemove', 
      'keypress',
      'keydown',
      'scroll',
      'touchstart',
      'touchmove',
      'click',
      'wheel'
    ];

    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Start initial timers
    resetTimers();

    // Cleanup function
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      clearAllTimers();
    };
  }, [isKioskActive, handleActivity, resetTimers, clearAllTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  return {
    showWarning,
    remainingSeconds,
    resetTimers: handleKeepLoggedIn,
    forceLogout,
    handleSwitchToMobile,
  };
};