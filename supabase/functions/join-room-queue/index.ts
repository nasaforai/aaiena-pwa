import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JoinQueueRequest {
  roomId: string;
  phoneNumber: string;
  userId?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { roomId, phoneNumber, userId }: JoinQueueRequest = await req.json();

    console.log('Joining queue:', { roomId, phoneNumber, userId });

    // Get current queue count for this room
    const { count, error: countError } = await supabaseClient
      .from('room_queue')
      .select('*', { count: 'exact', head: true })
      .eq('room_id', roomId)
      .eq('status', 'waiting');

    if (countError) {
      console.error('Error counting queue:', countError);
      return new Response(
        JSON.stringify({ error: 'Failed to check queue' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const position = (count || 0) + 1;

    // Get current session to calculate estimated wait time
    const { data: currentSession } = await supabaseClient
      .from('room_sessions')
      .select('expires_at')
      .eq('room_id', roomId)
      .eq('status', 'active')
      .maybeSingle();

    let estimatedWaitMinutes = 0;
    if (currentSession) {
      const expiresAt = new Date(currentSession.expires_at);
      const now = new Date();
      estimatedWaitMinutes = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / 60000));
      // Add 5 minutes for each person ahead in queue
      estimatedWaitMinutes += (position - 1) * 5;
    }

    // Add to queue
    const { data: queueEntry, error: insertError } = await supabaseClient
      .from('room_queue')
      .insert({
        room_id: roomId,
        phone_number: phoneNumber,
        user_id: userId || null,
        position: position,
        status: 'waiting',
      })
      .select('*, rooms(*)')
      .single();

    if (insertError) {
      console.error('Error joining queue:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to join queue' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Added to queue:', queueEntry);

    return new Response(
      JSON.stringify({ 
        queueEntry,
        position,
        estimatedWaitMinutes,
        message: `You're #${position} in line`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in join-room-queue:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
