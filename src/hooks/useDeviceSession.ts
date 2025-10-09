import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SessionCleanup } from '@/utils/sessionCleanup';

interface DeviceSession {
  id: string;
  kiosk_session_id: string;
  user_id: string | null;
  status: 'pending' | 'authenticated' | 'expired';
  created_at: string;
  expires_at: string;
}

export const useDeviceSession = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createDeviceSession = useCallback(async (sessionId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('device_sessions')
        .insert({
          kiosk_session_id: sessionId,
          status: 'pending'
        });

      if (error) {
        console.error('Error creating device session:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error creating device session:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateDeviceSession = useCallback(async (
    sessionId: string, 
    userId: string
  ): Promise<boolean> => {
    setIsLoading(true);
    let retries = 3;
    
    console.log('Starting device session update process:', { sessionId, userId });
    
    // First, check if the session exists and is still pending
    try {
      const { data: existingSession, error: checkError } = await supabase
        .from('device_sessions')
        .select('*')
        .eq('kiosk_session_id', sessionId)
        .single();

      if (checkError || !existingSession) {
        console.error('Session not found or error checking session:', checkError);
        setIsLoading(false);
        return false;
      }

      console.log('Found existing session:', existingSession);

      if (existingSession.status === 'authenticated') {
        console.log('Session already authenticated');
        setIsLoading(false);
        return true;
      }

      // Check if session is expired
      const now = new Date();
      const expiresAt = new Date(existingSession.expires_at);
      if (now > expiresAt) {
        console.log('Session has expired');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Error checking existing session:', error);
      setIsLoading(false);
      return false;
    }
    
    while (retries > 0) {
      try {
        console.log(`Updating device session (${retries} retries left):`, sessionId, userId);
        
        const { data, error } = await supabase
          .from('device_sessions')
          .update({
            user_id: userId,
            status: 'authenticated'
          })
          .eq('kiosk_session_id', sessionId)
          .select();

        if (error) {
          console.error('Error updating device session:', error);
          retries--;
          if (retries > 0) {
            console.log('Retrying device session update...');
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
            continue;
          }
          return false;
        }
        
        console.log('Device session updated successfully:', data);
        console.log('Kiosk should now detect the authentication via real-time subscription');
        setIsLoading(false);
        return true;
      } catch (error) {
        console.error('Error updating device session:', error);
        retries--;
        if (retries > 0) {
          console.log('Retrying device session update...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    console.error('All retries exhausted for device session update');
    toast({
      title: "Connection Error",
      description: "Failed to sync with kiosk after multiple attempts",
      variant: "destructive",
    });
    setIsLoading(false);
    return false;
  }, [toast]);

  const cleanupDeviceSession = useCallback(async (sessionId: string): Promise<void> => {
    try {
      await SessionCleanup.cleanupSession(sessionId);
    } catch (error) {
      console.error('Error cleaning up device session:', error);
    }
  }, []);

  const subscribeToDeviceSession = useCallback((
    sessionId: string,
    onAuthenticated: (userId: string) => void
  ) => {
    console.log('Setting up device session subscription for:', sessionId);
    
    const channel = supabase
      .channel(`device-auth-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'device_sessions',
          filter: `kiosk_session_id=eq.${sessionId}`
        },
        async (payload) => {
          console.log('Device session updated:', payload);
          if (payload.new.status === 'authenticated' && payload.new.user_id) {
            console.log('User authenticated via mobile device:', payload.new.user_id);
            onAuthenticated(payload.new.user_id);
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to device session changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to device session changes');
          // Retry subscription after a delay
          setTimeout(() => {
            console.log('Retrying subscription...');
            subscribeToDeviceSession(sessionId, onAuthenticated);
          }, 2000);
        }
      });

    // Set up session timeout with enhanced cleanup
    const timeoutId = setTimeout(() => {
      console.log('Device session timeout, cleaning up...');
      SessionCleanup.cleanupSession(sessionId);
      supabase.removeChannel(channel);
    }, 10 * 60 * 1000); // 10 minutes timeout

    return () => {
      clearTimeout(timeoutId);
      supabase.removeChannel(channel);
    };
  }, [cleanupDeviceSession]);

  // Clean up expired sessions
  const cleanupExpiredSessions = useCallback(async (): Promise<void> => {
    try {
      const { error } = await supabase
        .from('device_sessions')
        .delete()
        .lt('expires_at', new Date().toISOString());

      if (error) {
        console.error('Error cleaning up expired sessions:', error);
      }
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error);
    }
  }, []);

  // Create authenticated session transfer for switching devices
  const createAuthenticatedSessionTransfer = useCallback(async (
    sessionId: string, 
    userId: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('device_sessions')
        .insert({
          kiosk_session_id: sessionId,
          user_id: userId,
          status: 'authenticated',
          expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes expiry
        });

      if (error) {
        console.error('Error creating authenticated session transfer:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error creating authenticated session transfer:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    createDeviceSession,
    updateDeviceSession,
    cleanupDeviceSession,
    subscribeToDeviceSession,
    cleanupExpiredSessions,
    createAuthenticatedSessionTransfer,
  };
};