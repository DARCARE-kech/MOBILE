
// Configuration du client OpenAI pour interagir avec l'API Assistant
const OPENAI_API_KEY = 'sk-proj-AKfihkIbBcjeXHTTiq83T3BlbkFJcrUxEJK09t4xmjVWUERx';
const OPENAI_ASSISTANT_ID = 'asst_Yh87yZ3mNeMJS6W5TeVobQ1S';
const OPENAI_API_URL = 'https://api.openai.com/v1';

// Options pour les requêtes à l'API OpenAI
const getOpenAIOptions = (body?: any) => ({
  method: body ? 'POST' : 'GET',
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
    'OpenAI-Beta': 'assistants=v2'
  },
  body: body ? JSON.stringify(body) : undefined
});

// Création d'un nouveau thread OpenAI
export const createThread = async () => {
  try {
    const response = await fetch(`${OPENAI_API_URL}/threads`, getOpenAIOptions({}));
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error creating thread: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating OpenAI thread:', error);
    throw error;
  }
};

// Ajout d'un message à un thread existant
export const addMessage = async (threadId: string, content: string) => {
  try {
    const response = await fetch(
      `${OPENAI_API_URL}/threads/${threadId}/messages`, 
      getOpenAIOptions({
        role: 'user',
        content
      })
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error adding message: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding message to OpenAI thread:', error);
    throw error;
  }
};

// Exécution de l'assistant sur un thread
export const runAssistant = async (threadId: string) => {
  try {
    const response = await fetch(
      `${OPENAI_API_URL}/threads/${threadId}/runs`, 
      getOpenAIOptions({
        assistant_id: OPENAI_ASSISTANT_ID
      })
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error running assistant: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error running OpenAI assistant:', error);
    throw error;
  }
};

// Vérification de l'état d'une exécution
export const checkRunStatus = async (threadId: string, runId: string) => {
  try {
    const response = await fetch(
      `${OPENAI_API_URL}/threads/${threadId}/runs/${runId}`, 
      getOpenAIOptions()
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error checking run status: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error checking OpenAI run status:', error);
    throw error;
  }
};

// Récupération des messages d'un thread
export const getThreadMessages = async (threadId: string) => {
  try {
    const response = await fetch(
      `${OPENAI_API_URL}/threads/${threadId}/messages`, 
      getOpenAIOptions()
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error retrieving messages: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting OpenAI thread messages:', error);
    throw error;
  }
};
