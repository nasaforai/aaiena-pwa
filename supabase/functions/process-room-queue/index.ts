import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Processing room queue...');

    // Step 1: Expire old sessions
    const { data: expiredSessions, error: expireError } = await supabaseAdmin
      .from('room_sessions')
      .update({ status: 'expired' })
      .eq('status', 'active')
      .lt('expires_at', new Date().toISOString())
      .select('id, room_id, rooms(room_number)');

    if (expireError) {
      console.error('Error expiring sessions:', expireError);
    } else {
      console.log(`Expired ${expiredSessions?.length || 0} sessions`);
    }

    // Step 2: For each expired session, process the queue
    if (expiredSessions && expiredSessions.length > 0) {
      for (const session of expiredSessions) {
        console.log(`Processing queue for room ${session.room_id}`);

        // Get next person in queue
        const { data: nextInQueue, error: queueError } = await supabaseAdmin
          .from('room_queue')
          .select('*')
          .eq('room_id', session.room_id)
          .eq('status', 'waiting')
          .order('position', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (queueError) {
          console.error('Error fetching queue:', queueError);
          continue;
        }

        if (nextInQueue) {
          console.log(`Found next in queue:`, nextInQueue);

          // Create session for next person
          const { data: newSession, error: sessionError } = await supabaseAdmin
            .from('room_sessions')
            .insert({
              room_id: nextInQueue.room_id,
              phone_number: nextInQueue.phone_number,
              user_id: nextInQueue.user_id,
              status: 'active',
            })
            .select()
            .single();

          if (sessionError) {
            console.error('Error creating session for queue:', sessionError);
            continue;
          }

          // Update queue entry to notified
          await supabaseAdmin
            .from('room_queue')
            .update({ 
              status: 'notified',
              notified_at: new Date().toISOString()
            })
            .eq('id', nextInQueue.id);

          console.log(`Created session for queued user:`, newSession);

          // Send WhatsApp notification
          try {
            const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
            const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
            const twilioWhatsAppNumber = Deno.env.get('TWILIO_WHATSAPP_NUMBER');

            if (twilioAccountSid && twilioAuthToken && twilioWhatsAppNumber) {
              const roomNumber = (session.rooms as any)?.room_number || 'your room';
              const message = `Great news! Room ${roomNumber} is now available. Your 5-minute session has started. Please proceed to the room.`;
              
              const twilioResponse = await fetch(
                `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
                {
                  method: 'POST',
                  headers: {
                    'Authorization': 'Basic ' + btoa(`${twilioAccountSid}:${twilioAuthToken}`),
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
                  body: new URLSearchParams({
                    From: `whatsapp:${twilioWhatsAppNumber}`,
                    To: `whatsapp:${nextInQueue.phone_number}`,
                    Body: message,
                  }),
                }
              );

              if (twilioResponse.ok) {
                console.log('WhatsApp notification sent successfully');
              } else {
                console.error('Failed to send WhatsApp:', await twilioResponse.text());
              }
            }
          } catch (notifyError) {
            console.error('Error sending notification:', notifyError);
          }
        }
      }
    }

    // Step 3: Clean up old expired queue entries (older than 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    await supabaseAdmin
      .from('room_queue')
      .update({ status: 'expired' })
      .eq('status', 'waiting')
      .lt('created_at', oneHourAgo);

    return new Response(
      JSON.stringify({ 
        success: true,
        expiredSessions: expiredSessions?.length || 0,
        message: 'Queue processed successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-room-queue:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
