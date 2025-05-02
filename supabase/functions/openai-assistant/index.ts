
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// OpenAI API key from environment variables
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || "sk-proj-AKfihkIbBcjeXHTTiq83T3BlbkFJcrUxEJK09t4xmjVWUERx";
const OPENAI_ASSISTANT_ID = Deno.env.get('OPENAI_ASSISTANT_ID') || "asst_PFKqwI2J6PD7ymvDNtftLHEd";

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
    const { action, threadId, message, userId } = await req.json();

    if (!action) {
      throw new Error('Action is required');
    }

    // Create a new thread
    if (action === 'createThread') {
      const response = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v1'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error(`Error creating thread: ${await response.text()}`);
      }

      const thread = await response.json();
      return new Response(JSON.stringify(thread), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Add message to thread
    if (action === 'addMessage' && threadId && message) {
      const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v1'
        },
        body: JSON.stringify({
          role: 'user',
          content: message
        })
      });

      if (!response.ok) {
        throw new Error(`Error adding message: ${await response.text()}`);
      }

      const messageResponse = await response.json();
      return new Response(JSON.stringify(messageResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Run assistant on thread
    if (action === 'runAssistant' && threadId) {
      const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v1'
        },
        body: JSON.stringify({
          assistant_id: OPENAI_ASSISTANT_ID
        })
      });

      if (!response.ok) {
        throw new Error(`Error running assistant: ${await response.text()}`);
      }

      const run = await response.json();
      return new Response(JSON.stringify(run), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check run status
    if (action === 'checkRun' && threadId) {
      const { runId } = await req.json();
      if (!runId) {
        throw new Error('Run ID is required');
      }

      const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v1'
        }
      });

      if (!response.ok) {
        throw new Error(`Error checking run: ${await response.text()}`);
      }

      const run = await response.json();
      return new Response(JSON.stringify(run), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get messages from thread
    if (action === 'getMessages' && threadId) {
      const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v1'
        }
      });

      if (!response.ok) {
        throw new Error(`Error getting messages: ${await response.text()}`);
      }

      const messages = await response.json();
      return new Response(JSON.stringify(messages), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
