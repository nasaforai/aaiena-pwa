import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
    try {
      const { error } = await supabase
        .from('device_sessions')
        .update({
          user_id: userId,
          status: 'authenticated'
        })
        .eq('kiosk_session_id', sessionId);

      if (error) {
        console.error('Error updating device session:', error);
        return false;
      }
      console.log('Device session updated successfully for kiosk login');
      return true;
    } catch (error) {
      console.error('Error updating device session:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cleanupDeviceSession = useCallback(async (sessionId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('device_sessions')
        .delete()
        .eq('kiosk_session_id', sessionId);

      if (error) {
        console.error('Error cleaning up device session:', error);
      }
    } catch (error) {
      console.error('Error cleaning up device session:', error);
    }
  }, []);

  const subscribeToDeviceSession = useCallback((
    sessionId: string,
    onAuthenticated: (userId: string) => void
  ) => {
    const channel = supabase
      .channel('device-auth-changes')
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
            onAuthenticated(payload.new.user_id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  return {
    isLoading,
    createDeviceSession,
    updateDeviceSession,
    cleanupDeviceSession,
    subscribeToDeviceSession,
    cleanupExpiredSessions,
  };
};