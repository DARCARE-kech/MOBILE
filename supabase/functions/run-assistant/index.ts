
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

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
    const { thread_id, assistant_id } = await req.json();

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    if (!thread_id) {
      throw new Error('thread_id is required');
    }

    const effective_assistant_id = assistant_id || 'asst_5KqcDXQaMYqTDLKQxbQmrSBy';

    console.log(`Running assistant ${effective_assistant_id} on thread ${thread_id}`);

    // Run the assistant on the thread using v2 API
    const response = await fetch(`https://api.openai.com/v1/threads/${thread_id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: effective_assistant_id
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error from OpenAI when running assistant:", error);
      throw new Error(error.error?.message || 'Failed to run assistant');
    }

    const run = await response.json();
    console.log("Assistant run created successfully:", run.id);
    
    return new Response(JSON.stringify(run), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error running assistant:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
