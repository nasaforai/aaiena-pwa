import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateSessionRequest {
  roomId: string;
  phoneNumber?: string;
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

    const { roomId, phoneNumber = '', userId }: CreateSessionRequest = await req.json();

    console.log('Creating room session:', { roomId, phoneNumber: phoneNumber || 'none', userId });

    // Check if room is available (no active session)
    const { data: existingSession, error: checkError } = await supabaseClient
      .from('room_sessions')
      .select('*')
      .eq('room_id', roomId)
      .eq('status', 'active')
      .maybeSingle();

    if (checkError) {
      console.error('Error checking room availability:', checkError);
      return new Response(
        JSON.stringify({ error: 'Failed to check room availability' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (existingSession) {
      console.log('Room is occupied:', existingSession);
      return new Response(
        JSON.stringify({ 
          error: 'Room is occupied',
          occupiedUntil: existingSession.expires_at 
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create new session
    const { data: newSession, error: insertError } = await supabaseClient
      .from('room_sessions')
      .insert({
        room_id: roomId,
        phone_number: phoneNumber,
        user_id: userId || null,
        status: 'active',
      })
      .select('*, rooms(*)')
      .single();

    if (insertError) {
      console.error('Error creating session:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to create session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Session created successfully:', newSession);

    return new Response(
      JSON.stringify({ 
        session: newSession,
        message: 'Room booked successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in create-room-session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
