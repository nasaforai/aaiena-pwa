import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { sessionId } = await req.json()
    console.log('Kiosk auth request for session:', sessionId)

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'Session ID is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the device session to find the authenticated user
    const { data: deviceSession, error: sessionError } = await supabaseAdmin
      .from('device_sessions')
      .select('user_id, status')
      .eq('kiosk_session_id', sessionId)
      .eq('status', 'authenticated')
      .maybeSingle()

    if (sessionError) {
      console.error('Error fetching device session:', sessionError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch device session' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!deviceSession || !deviceSession.user_id) {
      console.log('Device session not found or not authenticated:', deviceSession)
      return new Response(
        JSON.stringify({ error: 'Device session not authenticated' }), 
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Found authenticated device session for user:', deviceSession.user_id)

    // Get user email to generate proper magic link
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(deviceSession.user_id)

    if (userError || !userData.user) {
      console.error('Error fetching user data:', userError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user data' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate a proper session token for the user
    const { data: tokenData, error: tokenError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: userData.user.email!,
      options: {
        redirectTo: `${req.headers.get('origin') || 'http://localhost:3000'}/store`
      }
    })

    if (tokenError) {
      console.error('Error generating token:', tokenError)
      return new Response(
        JSON.stringify({ error: 'Failed to generate session token' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Generated session token for kiosk authentication')

    // Clean up the device session
    await supabaseAdmin
      .from('device_sessions')
      .delete()
      .eq('kiosk_session_id', sessionId)

    return new Response(
      JSON.stringify({ 
        success: true,
        authUrl: tokenData.properties?.action_link,
        user: {
          id: userData.user.id,
          email: userData.user.email,
          user_metadata: userData.user.user_metadata
        }
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Kiosk auth error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})