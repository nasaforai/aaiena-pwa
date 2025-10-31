import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Room {
  id: string;
  room_number: string;
  brand_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoomSession {
  id: string;
  room_id: string;
  user_id: string | null;
  phone_number: string;
  status: 'active' | 'completed' | 'expired';
  started_at: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [sessions, setSessions] = useState<RoomSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    const { data: roomsData, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .eq('is_active', true)
      .order('room_number');

    if (roomsError) {
      console.error('Error fetching rooms:', roomsError);
      return;
    }

    const { data: sessionsData, error: sessionsError } = await supabase
      .from('room_sessions')
      .select('*')
      .eq('status', 'active');

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
      return;
    }

    setRooms(roomsData || []);
    setSessions((sessionsData || []) as RoomSession[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('room-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_sessions',
        },
        (payload) => {
          console.log('Room session changed:', payload);
          fetchRooms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const isRoomOccupied = (roomId: string) => {
    return sessions.some(session => session.room_id === roomId && session.status === 'active');
  };

  const getRoomSession = (roomId: string) => {
    return sessions.find(session => session.room_id === roomId && session.status === 'active');
  };

  const getTimeRemaining = (roomId: string) => {
    const session = getRoomSession(roomId);
    if (!session) return 0;
    
    const expiresAt = new Date(session.expires_at).getTime();
    const now = Date.now();
    return Math.max(0, expiresAt - now);
  };

  return {
    rooms,
    sessions,
    loading,
    isRoomOccupied,
    getRoomSession,
    getTimeRemaining,
    refetch: fetchRooms,
  };
}
