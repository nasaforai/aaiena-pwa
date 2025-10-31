import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface QueueMetrics {
  currentUsers: number;
  averageWaitMinutes: number;
  queueLength: number;
  status: "Low" | "Moderate" | "High";
}

export function useQueueStatus() {
  const [metrics, setMetrics] = useState<QueueMetrics>({
    currentUsers: 0,
    averageWaitMinutes: 0,
    queueLength: 0,
    status: "Low",
  });
  const [loading, setLoading] = useState(true);

  const calculateMetrics = async () => {
    try {
      // Get active sessions count
      const { data: sessions, error: sessionsError } = await supabase
        .from("room_sessions")
        .select("*")
        .eq("status", "active");

      if (sessionsError) throw sessionsError;

      // Get waiting queue count
      const { data: queue, error: queueError } = await supabase
        .from("room_queue")
        .select("*")
        .eq("status", "waiting");

      if (queueError) throw queueError;

      const currentUsers = sessions?.length || 0;
      const queueLength = queue?.length || 0;

      // Calculate average wait time based on current sessions
      let averageWaitMinutes = 0;
      if (sessions && sessions.length > 0) {
        const now = new Date();
        const totalRemainingTime = sessions.reduce((acc, session) => {
          const expiresAt = new Date(session.expires_at);
          const remainingMs = Math.max(0, expiresAt.getTime() - now.getTime());
          return acc + remainingMs;
        }, 0);
        
        // Average remaining time per active session
        averageWaitMinutes = Math.ceil(totalRemainingTime / (sessions.length * 60000));
      }

      // If there's a queue, add estimated wait time
      if (queueLength > 0 && currentUsers > 0) {
        // Each person in queue will wait for average session time
        averageWaitMinutes = averageWaitMinutes + Math.ceil(queueLength * 5 / currentUsers);
      }

      // Determine status based on queue and active sessions
      let status: "Low" | "Moderate" | "High";
      if (queueLength === 0 && currentUsers < 3) {
        status = "Low";
      } else if (queueLength <= 2 || currentUsers <= 4) {
        status = "Moderate";
      } else {
        status = "High";
      }

      setMetrics({
        currentUsers,
        averageWaitMinutes,
        queueLength,
        status,
      });
    } catch (error) {
      console.error("Error calculating queue metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateMetrics();

    // Subscribe to room_sessions changes
    const sessionsChannel = supabase
      .channel("room-sessions-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_sessions",
        },
        () => {
          calculateMetrics();
        }
      )
      .subscribe();

    // Subscribe to room_queue changes
    const queueChannel = supabase
      .channel("room-queue-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_queue",
        },
        () => {
          calculateMetrics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sessionsChannel);
      supabase.removeChannel(queueChannel);
    };
  }, []);

  return { metrics, loading };
}
