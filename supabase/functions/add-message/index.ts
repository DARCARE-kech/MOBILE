
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
    const { thread_id, content, role } = await req.json();

    if (!thread_id) {
      throw new Error('thread_id is required');
    }

    console.log(`Adding message to thread ${thread_id}: ${content}`);

    // Add a message to the thread using v2 API
    const response = await fetch(`https://api.openai.com/v1/threads/${thread_id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: role || 'user',
        content
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error from OpenAI when adding message:", error);
      throw new Error(error.error?.message || 'Failed to add message');
    }

    const message = await response.json();
    console.log("Message added successfully:", message.id);
    
    return new Response(JSON.stringify(message), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error adding message:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
