import { supabase } from '@/integrations/supabase/client';

export interface SessionCleanupConfig {
  maxAge: number; // in milliseconds
  cleanupInterval: number; // in milliseconds
  batchSize: number; // number of sessions to clean at once
  retryAttempts: number;
}

/**
 * Aggressive session cleanup utility for managing device sessions efficiently
 */
export class SessionCleanup {
  private static config: SessionCleanupConfig = {
    maxAge: 10 * 60 * 1000, // 10 minutes
    cleanupInterval: 2 * 60 * 1000, // 2 minutes
    batchSize: 50,
    retryAttempts: 3
  };

  private static cleanupIntervalId: NodeJS.Timeout | null = null;
  private static visibilityChangeHandler: (() => void) | null = null;
  private static beforeUnloadHandler: (() => void) | null = null;

  /**
   * Initialize aggressive cleanup with multiple triggers
   */
  static initialize(config?: Partial<SessionCleanupConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }

    // Set up periodic cleanup
    this.startPeriodicCleanup();

    // Set up event-based cleanup
    this.setupEventCleanup();

    // Set up visibility change cleanup
    this.setupVisibilityCleanup();

    console.log('Session cleanup initialized with config:', this.config);
  }

  /**
   * Start periodic cleanup interval
   */
  private static startPeriodicCleanup() {
    if (this.cleanupIntervalId) {
      clearInterval(this.cleanupIntervalId);
    }

    this.cleanupIntervalId = setInterval(async () => {
      await this.cleanupExpiredSessions();
    }, this.config.cleanupInterval);
  }

  /**
   * Setup cleanup on page unload/visibility change
   */
  private static setupEventCleanup() {
    this.beforeUnloadHandler = () => {
      // Synchronous cleanup on page unload
      this.emergencyCleanup();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.beforeUnloadHandler);
      window.addEventListener('pagehide', this.beforeUnloadHandler);
    }
  }

  /**
   * Setup cleanup when page becomes hidden
   */
  private static setupVisibilityCleanup() {
    this.visibilityChangeHandler = () => {
      if (document.hidden) {
        // Page is hidden, schedule cleanup
        setTimeout(() => {
          this.cleanupExpiredSessions();
        }, 1000);
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    }
  }

  /**
   * Clean up expired sessions with retry logic
   */
  static async cleanupExpiredSessions(): Promise<number> {
    let attempts = 0;
    
    while (attempts < this.config.retryAttempts) {
      try {
        const cutoffTime = new Date(Date.now() - this.config.maxAge);
        
        const { data, error } = await supabase
          .from('device_sessions')
          .delete()
          .lt('expires_at', cutoffTime.toISOString())
          .select('id');

        if (error) {
          throw error;
        }

        const cleanedCount = data?.length || 0;
        if (cleanedCount > 0) {
          console.log(`Cleaned up ${cleanedCount} expired sessions`);
        }

        return cleanedCount;
      } catch (error) {
        attempts++;
        console.error(`Session cleanup attempt ${attempts} failed:`, error);
        
        if (attempts < this.config.retryAttempts) {
          // Wait before retry with exponential backoff
          await new Promise(resolve => 
            setTimeout(resolve, Math.pow(2, attempts) * 1000)
          );
        }
      }
    }

    console.error('All session cleanup attempts failed');
    return 0;
  }

  /**
   * Clean up sessions for specific session ID immediately
   */
  static async cleanupSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('device_sessions')
        .delete()
        .eq('kiosk_session_id', sessionId);

      if (error) {
        console.error('Error cleaning up specific session:', error);
        return false;
      }

      console.log(`Cleaned up session: ${sessionId}`);
      return true;
    } catch (error) {
      console.error('Error cleaning up specific session:', error);
      return false;
    }
  }

  /**
   * Clean up sessions by status
   */
  static async cleanupByStatus(status: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('device_sessions')
        .delete()
        .eq('status', status)
        .select('id');

      if (error) {
        throw error;
      }

      const cleanedCount = data?.length || 0;
      if (cleanedCount > 0) {
        console.log(`Cleaned up ${cleanedCount} sessions with status: ${status}`);
      }

      return cleanedCount;
    } catch (error) {
      console.error(`Error cleaning up sessions by status ${status}:`, error);
      return 0;
    }
  }

  /**
   * Emergency synchronous cleanup (for page unload)
   */
  private static emergencyCleanup() {
    // Use sendBeacon for reliable cleanup on page unload
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      // Use the public Supabase URL for emergency cleanup
      const cleanupUrl = 'https://mpvcadyicshblhleoyob.supabase.co/rest/v1/device_sessions';
      const cutoffTime = new Date(Date.now() - this.config.maxAge);
      
      navigator.sendBeacon(cleanupUrl, JSON.stringify({
        expires_at: `lt.${cutoffTime.toISOString()}`
      }));
    }
  }

  /**
   * Clean up all orphaned sessions (sessions without active subscriptions)
   */
  static async cleanupOrphanedSessions(): Promise<number> {
    try {
      // Get all pending sessions older than 5 minutes
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      const { data, error } = await supabase
        .from('device_sessions')
        .delete()
        .eq('status', 'pending')
        .lt('created_at', fiveMinutesAgo.toISOString())
        .select('id');

      if (error) {
        throw error;
      }

      const cleanedCount = data?.length || 0;
      if (cleanedCount > 0) {
        console.log(`Cleaned up ${cleanedCount} orphaned sessions`);
      }

      return cleanedCount;
    } catch (error) {
      console.error('Error cleaning up orphaned sessions:', error);
      return 0;
    }
  }

  /**
   * Get cleanup statistics
   */
  static async getCleanupStats(): Promise<{
    totalSessions: number;
    expiredSessions: number;
    pendingSessions: number;
    authenticatedSessions: number;
  }> {
    try {
      const { data: allSessions } = await supabase
        .from('device_sessions')
        .select('status, expires_at');

      if (!allSessions) {
        return { totalSessions: 0, expiredSessions: 0, pendingSessions: 0, authenticatedSessions: 0 };
      }

      const now = new Date();
      const stats = {
        totalSessions: allSessions.length,
        expiredSessions: 0,
        pendingSessions: 0,
        authenticatedSessions: 0
      };

      allSessions.forEach(session => {
        if (new Date(session.expires_at) < now) {
          stats.expiredSessions++;
        } else if (session.status === 'pending') {
          stats.pendingSessions++;
        } else if (session.status === 'authenticated') {
          stats.authenticatedSessions++;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting cleanup stats:', error);
      return { totalSessions: 0, expiredSessions: 0, pendingSessions: 0, authenticatedSessions: 0 };
    }
  }

  /**
   * Shutdown cleanup processes
   */
  static shutdown() {
    if (this.cleanupIntervalId) {
      clearInterval(this.cleanupIntervalId);
      this.cleanupIntervalId = null;
    }

    if (typeof window !== 'undefined' && this.beforeUnloadHandler) {
      window.removeEventListener('beforeunload', this.beforeUnloadHandler);
      window.removeEventListener('pagehide', this.beforeUnloadHandler);
    }

    if (typeof document !== 'undefined' && this.visibilityChangeHandler) {
      document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
    }

    console.log('Session cleanup shutdown complete');
  }
}