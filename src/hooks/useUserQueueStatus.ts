import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface QueueStatus {
  roomId: string;
  roomNumber: string;
  position: number;
  queueId: string;
}

export function useUserQueueStatus(userId?: string) {
  const [queueStatuses, setQueueStatuses] = useState<QueueStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setQueueStatuses([]);
      setLoading(false);
      return;
    }

    const fetchQueueStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("room_queue")
          .select(`
            id,
            position,
            room_id,
            rooms (
              room_number
            )
          `)
          .eq("user_id", userId)
          .eq("status", "waiting")
          .order("created_at", { ascending: true });

        if (error) throw error;

        const statuses: QueueStatus[] = (data || []).map((entry: any) => ({
          queueId: entry.id,
          roomId: entry.room_id,
          roomNumber: entry.rooms?.room_number || "",
          position: entry.position,
        }));

        setQueueStatuses(statuses);
      } catch (error) {
        console.error("Error fetching queue status:", error);
        setQueueStatuses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQueueStatus();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("user-queue-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_queue",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchQueueStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { queueStatuses, loading };
}
