import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, otp } = await req.json();

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

    // Find matching OTP in database
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

    if (!otpRecords || otpRecords.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired OTP' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark OTP as verified
    const { error: updateError } = await supabase
      .from('otp_codes')
      .update({ verified: true })
      .eq('id', otpRecords[0].id);

    if (updateError) {
      console.error('OTP update error:', updateError);
    }

    // Try to create the user first - this is more reliable than checking existence
    console.log('Attempting to create/find user for phone:', phone);
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      phone,
      phone_confirm: true,
      email_confirm: false, // Explicitly disable email to prevent synthetic email creation
      user_metadata: { phone }
    });

    let userId: string;
    let isNewUser = false;

    if (createError) {
      // If phone already exists, this is a sign-in attempt
      if (createError.code === 'phone_exists') {
        console.log('User already exists (sign-in), looking up user ID for phone:', phone);
        
        // Option 1: Try to find in profiles table first (more efficient)
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('full_name', phone)
          .single();
        
        if (!profileError && profile) {
          userId = profile.user_id;
          isNewUser = false;
          console.log('Existing user found via profile:', userId);
        } else {
          // Option 2: Check for users with synthetic email pattern
          const syntheticEmail = `${phone.replace(/\+/g, '')}@phone.auth`;
          console.log('Checking for synthetic email user:', syntheticEmail);
          
          const { data: usersPage, error: listError } = await supabase.auth.admin.listUsers({
            page: 1,
            perPage: 1000
          });
          
          if (!listError && usersPage) {
            const existingSyntheticUser = usersPage.users.find(u => u.email === syntheticEmail && !u.phone);
            
            if (existingSyntheticUser) {
              userId = existingSyntheticUser.id;
              isNewUser = false;
              console.log('Found user with synthetic email, migrating to phone-only:', userId);
              
              // Delete the synthetic email user and create a proper phone-only user
              await supabase.auth.admin.deleteUser(existingSyntheticUser.id);
              console.log('Deleted synthetic email user:', userId);
              
              // The outer createUser call will create a new proper phone-only user
              // So we should return an error to trigger that path
              console.error('Triggering recreation with phone-only');
              return new Response(
                JSON.stringify({ success: false, error: 'Migration needed, please try again' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              );
            }
          }
          
          // Option 3: Fall back to listing users with pagination by phone
          console.log('Profile not found, searching through auth users by phone...');
          let foundUser = null;
          let page = 1;
          const perPage = 1000;
          
          while (!foundUser && page <= 10) { // Limit to 10 pages (10k users) for safety
            const { data: usersPage, error: listError } = await supabase.auth.admin.listUsers({
              page,
              perPage
            });
            
            if (listError) {
              console.error('Failed to list users:', listError);
              break;
            }
            
            foundUser = usersPage.users.find(u => u.phone === phone);
            if (!foundUser && usersPage.users.length < perPage) {
              // Reached last page without finding user
              break;
            }
            page++;
          }
          
          if (!foundUser) {
            console.error('User not found despite phone_exists error');
            return new Response(
              JSON.stringify({ success: false, error: 'User verification failed. Please try again.' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          userId = foundUser.id;
          isNewUser = false;
          console.log('Existing user found via auth listing:', userId);
        }
      } else {
        // Other creation errors
        console.error('User creation error:', createError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create user account' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else if (newUser?.user) {
      // Successfully created new user
      userId = newUser.user.id;
      isNewUser = true;
      console.log('New user created (sign-up):', userId);
      
      // Create profile for new user
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          full_name: phone
        }, {
          onConflict: 'user_id'
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      } else {
        console.log('Profile created for new user');
      }
    } else {
      console.error('Unexpected user creation result');
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to process user' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate a proper session using createSession (not generateLink)
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

    console.log('Session created successfully for user:', userId);

    // Return the properly formatted session
    return new Response(
      JSON.stringify({
        success: true,
        session: sessionData.session,
        isNewUser
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in verify-whatsapp-otp:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
