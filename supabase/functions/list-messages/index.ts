
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || "sk-proj-AKfihkIbBcjeXHTTiq83T3BlbkFJcrUxEJK09t4xmjVWUERx";

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
    const { thread_id } = await req.json();

    if (!thread_id) {
      throw new Error('thread_id is required');
    }

    console.log(`Listing messages for thread ${thread_id}`);

    // Fetch messages from the thread using v2 API with include_citations=false
    const response = await fetch(`https://api.openai.com/v1/threads/${thread_id}/messages?limit=100&include_citations=false`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error from OpenAI when listing messages:", error);
      throw new Error(error.error?.message || 'Failed to fetch messages');
    }

    const { data } = await response.json();
    console.log(`Successfully retrieved ${data.length} messages`);

    if (data?.length) {
      const latest = data.find((msg) => msg.role === 'assistant');
      if (latest) {
        console.log("Dernier message assistant brut :", JSON.stringify(latest, null, 2));
      }
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
