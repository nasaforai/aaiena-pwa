import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('=== VERIFY-WHATSAPP-OTP EDGE FUNCTION INVOKED ===');
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, otp } = await req.json();
    console.log('Request body parsed - Phone:', phone, 'OTP length:', otp?.length);

    if (!phone || !otp) {
      return new Response(
        JSON.stringify({ success: false, error: 'Phone number and OTP are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Verifying OTP for phone:', phone);

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Hash the provided OTP
    const encoder = new TextEncoder();
    const data = encoder.encode(otp);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const otpHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    console.log('OTP hashed successfully');

    // Find matching OTP in database
    console.log('Looking up OTP in database for phone:', phone);
    const { data: otpRecords, error: otpError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('phone_number', phone)
      .eq('otp_hash', otpHash)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (otpError) {
      console.error('OTP lookup error:', otpError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to verify OTP' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('OTP lookup results:', otpRecords?.length || 0, 'records found');

    if (!otpRecords || otpRecords.length === 0) {
      console.log('No valid OTP found - invalid or expired');
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired OTP' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Valid OTP found, marking as verified');

    // Mark OTP as verified
    const { error: updateError } = await supabase
      .from('otp_codes')
      .update({ verified: true })
      .eq('id', otpRecords[0].id);

    if (updateError) {
      console.error('OTP update error:', updateError);
    }

    // Try to create the user - simpler approach
    console.log('=== USER CREATION PHASE ===');
    console.log('Attempting to create user for phone:', phone);
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      phone,
      phone_confirm: true,
      user_metadata: { phone }
    });
    console.log('CreateUser response - Data:', !!newUser, 'Error:', createError?.code || 'none');

    let userId: string;
    let isNewUser = false;

    if (createError?.code === 'phone_exists') {
      // EXISTING USER - Sign In
      console.log('=== EXISTING USER PATH ===');
      console.log('Phone exists, finding user by phone:', phone);
      
      // Find user by phone in auth.users
      console.log('Fetching all users to find by phone...');
      const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        console.error('Failed to list users:', listError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to find user' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log('Total users in system:', usersData.users.length);
      const existingUser = usersData.users.find(u => u.phone === phone);
      
      if (!existingUser) {
        console.error('User not found despite phone_exists error - this should not happen!');
        return new Response(
          JSON.stringify({ success: false, error: 'User not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      userId = existingUser.id;
      isNewUser = false;
      console.log('Existing user found - User ID:', userId);
      
    } else if (createError) {
      // Other creation errors
      console.error('User creation error:', createError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create user account' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      
    } else if (newUser?.user) {
      // NEW USER - Sign Up
      console.log('=== NEW USER PATH ===');
      userId = newUser.user.id;
      isNewUser = true;
      console.log('New user created - User ID:', userId);
      
      // Create profile for new user with phone as temporary name
      console.log('Creating profile for new user...');
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          full_name: phone // User can update this later
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Continue anyway - profile can be created later
      } else {
        console.log('Profile created successfully for new user');
      }
      
    } else {
      console.error('Unexpected user creation result');
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to process user' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate a proper session using createSession (not generateLink)
    console.log('=== SESSION CREATION PHASE ===');
    console.log('Creating session for user:', userId);
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.createSession({
      user_id: userId
    });

    if (sessionError || !sessionData?.session) {
      console.error('Session creation error:', sessionError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Session created successfully!');
    console.log('Session ID:', sessionData.session.access_token.substring(0, 20) + '...');
    console.log('Is new user:', isNewUser);

    // Return the properly formatted session
    console.log('=== RETURNING SUCCESS RESPONSE ===');
    return new Response(
      JSON.stringify({
        success: true,
        session: sessionData.session,
        isNewUser
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('=== CRITICAL ERROR IN VERIFY-WHATSAPP-OTP ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
