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
    console.log('Starting duplicate user cleanup...');

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all users
    const { data: allUsersData, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Failed to list users:', listError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to list users' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const allUsers = allUsersData.users;
    console.log(`Found ${allUsers.length} total users`);

    const duplicates = [];
    const deletedUsers = [];

    // Find users with synthetic email pattern
    for (const user of allUsers) {
      if (user.email?.endsWith('@phone.auth') && !user.phone) {
        const phone = '+' + user.email.replace('@phone.auth', '');
        
        // Check if there's a user with actual phone
        const phoneUser = allUsers.find(u => u.phone === phone && u.id !== user.id);
        
        if (phoneUser) {
          duplicates.push({
            syntheticUserId: user.id,
            syntheticEmail: user.email,
            realUserId: phoneUser.id,
            phone
          });
          
          console.log(`Found duplicate: ${user.email} (${user.id}) vs phone user ${phoneUser.id}`);
          
          // Delete the synthetic user
          const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
          
          if (deleteError) {
            console.error(`Failed to delete synthetic user ${user.id}:`, deleteError);
          } else {
            deletedUsers.push(user.id);
            console.log(`Deleted duplicate user ${user.id} for phone ${phone}`);
          }
        }
      }
    }

    console.log(`Cleanup complete. Found ${duplicates.length} duplicates, deleted ${deletedUsers.length} users`);

    return new Response(
      JSON.stringify({
        success: true,
        totalUsers: allUsers.length,
        duplicatesFound: duplicates.length,
        usersDeleted: deletedUsers.length,
        duplicates,
        deletedUsers
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in cleanup-duplicate-users:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
