import { useEffect, useCallback, useRef } from 'react';
import { SessionCleanup } from '@/utils/sessionCleanup';
import { useDeviceSession } from '@/hooks/useDeviceSession';
import { useToast } from '@/hooks/use-toast';

interface SessionManagerConfig {
  enableAggressiveCleanup?: boolean;
  cleanupInterval?: number;
  sessionTimeout?: number;
  enableHeartbeat?: boolean;
  heartbeatInterval?: number;
}

/**
 * Enhanced session manager hook with aggressive cleanup and proactive session management
 */
export const useSessionManager = (config: SessionManagerConfig = {}) => {
  const {
    enableAggressiveCleanup = true,
    cleanupInterval = 2 * 60 * 1000, // 2 minutes
    sessionTimeout = 10 * 60 * 1000, // 10 minutes
    enableHeartbeat = true,
    heartbeatInterval = 30 * 1000 // 30 seconds
  } = config;

  const { cleanupExpiredSessions } = useDeviceSession();
  const { toast } = useToast();

  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  /**
   * Initialize session manager with aggressive cleanup
   */
  useEffect(() => {
    if (enableAggressiveCleanup) {
      SessionCleanup.initialize({
        maxAge: sessionTimeout,
        cleanupInterval,
        batchSize: 50,
        retryAttempts: 3
      });
    }

    return () => {
      SessionCleanup.shutdown();
    };
  }, [enableAggressiveCleanup, cleanupInterval, sessionTimeout]);

  /**
   * Track user activity for inactivity-based cleanup
   */
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    // Reset inactivity timer
    if (inactivityRef.current) {
      clearTimeout(inactivityRef.current);
    }
    
    inactivityRef.current = setTimeout(() => {
      console.log('User inactive, triggering session cleanup');
      SessionCleanup.cleanupExpiredSessions();
    }, sessionTimeout);
  }, [sessionTimeout]);

  /**
   * Set up activity tracking
   */
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Initial activity update
    updateActivity();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
      
      if (inactivityRef.current) {
        clearTimeout(inactivityRef.current);
      }
    };
  }, [updateActivity]);

  /**
   * Heartbeat mechanism for active session monitoring
   */
  useEffect(() => {
    if (!enableHeartbeat) return;

    const startHeartbeat = () => {
      heartbeatRef.current = setInterval(async () => {
        const timeSinceActivity = Date.now() - lastActivityRef.current;
        
        // Only send heartbeat if user is active
        if (timeSinceActivity < heartbeatInterval * 2) {
          try {
            await SessionCleanup.cleanupOrphanedSessions();
          } catch (error) {
            console.error('Heartbeat cleanup error:', error);
          }
        }
      }, heartbeatInterval);
    };

    startHeartbeat();

    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
    };
  }, [enableHeartbeat, heartbeatInterval]);

  /**
   * Manual session cleanup with user feedback
   */
  const triggerCleanup = useCallback(async () => {
    try {
      const cleanedCount = await SessionCleanup.cleanupExpiredSessions();
      
      if (cleanedCount > 0) {
        toast({
          title: "Sessions Cleaned",
          description: `Cleaned up ${cleanedCount} expired sessions`,
        });
      }
      
      return cleanedCount;
    } catch (error) {
      console.error('Manual cleanup error:', error);
      toast({
        title: "Cleanup Error",
        description: "Failed to clean up sessions",
        variant: "destructive",
      });
      return 0;
    }
  }, [toast]);

  /**
   * Clean up specific session with retry logic
   */
  const cleanupSession = useCallback(async (sessionId: string): Promise<boolean> => {
    try {
      const success = await SessionCleanup.cleanupSession(sessionId);
      
      if (success) {
        console.log(`Successfully cleaned up session: ${sessionId}`);
      }
      
      return success;
    } catch (error) {
      console.error(`Failed to cleanup session ${sessionId}:`, error);
      return false;
    }
  }, []);

  /**
   * Get session statistics for monitoring
   */
  const getSessionStats = useCallback(async () => {
    try {
      return await SessionCleanup.getCleanupStats();
    } catch (error) {
      console.error('Error getting session stats:', error);
      return {
        totalSessions: 0,
        expiredSessions: 0,
        pendingSessions: 0,
        authenticatedSessions: 0
      };
    }
  }, []);

  /**
   * Force cleanup of all pending sessions
   */
  const forceCleanupPending = useCallback(async () => {
    try {
      const cleanedCount = await SessionCleanup.cleanupByStatus('pending');
      
      if (cleanedCount > 0) {
        toast({
          title: "Pending Sessions Cleared",
          description: `Force cleaned ${cleanedCount} pending sessions`,
        });
      }
      
      return cleanedCount;
    } catch (error) {
      console.error('Force cleanup error:', error);
      return 0;
    }
  }, [toast]);

  /**
   * Schedule session cleanup for a specific delay
   */
  const scheduleCleanup = useCallback((sessionId: string, delay: number) => {
    setTimeout(() => {
      cleanupSession(sessionId);
    }, delay);
  }, [cleanupSession]);

  return {
    triggerCleanup,
    cleanupSession,
    getSessionStats,
    forceCleanupPending,
    scheduleCleanup,
    
    // Session state
    lastActivity: lastActivityRef.current,
    isActive: Date.now() - lastActivityRef.current < heartbeatInterval * 2,
    
    // Legacy compatibility
    cleanupExpiredSessions: triggerCleanup,
  };
};