
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    // Initialize Supabase Admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { user_id, thread_id, title } = await req.json();

    if (!user_id || !thread_id) {
      throw new Error('User ID and Thread ID are required');
    }

    console.log(`Saving thread ${thread_id} for user ${user_id} with title ${title || 'New Conversation'}`);

    // Insert or update the thread
    const { data, error } = await supabase
      .from('chat_threads')
      .upsert({
        user_id,
        thread_id,
        title: title || `Conversation ${new Date().toLocaleDateString()}`
      });

    if (error) {
      console.error("Error saving thread to database:", error);
      throw error;
    }

    console.log("Thread saved successfully to database");
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error saving user thread:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
