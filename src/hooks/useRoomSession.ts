import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useRoomSession() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createSession = async (roomId: string, phoneNumber: string, userId?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-room-session', {
        body: { roomId, phoneNumber, userId },
      });

      if (error) throw error;

      if (data.error) {
        if (data.error === 'Room is occupied') {
          return { success: false, error: data.error, occupiedUntil: data.occupiedUntil };
        }
        throw new Error(data.error);
      }

      toast({
        title: 'Room Booked!',
        description: `You have 5 minutes in room ${data.session.rooms.room_number}`,
      });

      return { success: true, session: data.session };
    } catch (error: any) {
      console.error('Error creating session:', error);
      toast({
        title: 'Booking Failed',
        description: error.message || 'Failed to book room',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const joinQueue = async (roomId: string, phoneNumber: string, userId?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('join-room-queue', {
        body: { roomId, phoneNumber, userId },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: 'Joined Queue',
        description: `You're #${data.position} in line. Estimated wait: ${data.estimatedWaitMinutes} minutes`,
      });

      return { success: true, queueEntry: data.queueEntry, position: data.position };
    } catch (error: any) {
      console.error('Error joining queue:', error);
      toast({
        title: 'Queue Join Failed',
        description: error.message || 'Failed to join queue',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    createSession,
    joinQueue,
    loading,
  };
}
