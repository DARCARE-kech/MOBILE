
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
  console.log("Creating new OpenAI thread");
  try {
    const response = await fetch(`${OPENAI_API_URL}/threads`, getOpenAIOptions({}));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error creating thread: Status ${response.status}`, errorText);
      throw new Error(`Error creating thread: ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Thread created successfully:", data);
    return data;
  } catch (error) {
    console.error('Error creating OpenAI thread:', error);
    throw error;
  }
};

// Ajout d'un message à un thread existant
export const addMessage = async (threadId: string, content: string) => {
  console.log(`Adding message to thread ${threadId}:`, content.substring(0, 50) + (content.length > 50 ? '...' : ''));
  try {
    const requestBody = {
      role: 'user',
      content
    };
    console.log("Request body:", requestBody);
    
    const response = await fetch(
      `${OPENAI_API_URL}/threads/${threadId}/messages`, 
      getOpenAIOptions(requestBody)
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error adding message: Status ${response.status}`, errorText);
      throw new Error(`Error adding message: ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Message added successfully:", data);
    return data;
  } catch (error) {
    console.error('Error adding message to OpenAI thread:', error);
    throw error;
  }
};

// Exécution de l'assistant sur un thread
export const runAssistant = async (threadId: string) => {
  console.log(`Running assistant on thread ${threadId} with assistant ID ${OPENAI_ASSISTANT_ID}`);
  try {
    const requestBody = {
      assistant_id: OPENAI_ASSISTANT_ID,
      stream: true,  // activer le streaming de la réponse
  include_citations: false
    };
    console.log("Request body:", requestBody);
    
    const response = await fetch(
      `${OPENAI_API_URL}/threads/${threadId}/runs`, 
      getOpenAIOptions(requestBody)
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error running assistant: Status ${response.status}`, errorText);
      throw new Error(`Error running assistant: ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Assistant run initiated successfully:", data);
    return data;
  } catch (error) {
    console.error('Error running OpenAI assistant:', error);
    throw error;
  }
};

// Vérification de l'état d'une exécution
export const checkRunStatus = async (threadId: string, runId: string) => {
  console.log(`Checking run status for thread ${threadId}, run ${runId}`);
  try {
    const response = await fetch(
      `${OPENAI_API_URL}/threads/${threadId}/runs/${runId}`, 
      getOpenAIOptions()
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error checking run status: Status ${response.status}`, errorText);
      throw new Error(`Error checking run status: ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Run status:", data.status);
    return data;
  } catch (error) {
    console.error('Error checking OpenAI run status:', error);
    throw error;
  }
};

// Récupération des messages d'un thread
export const getThreadMessages = async (threadId: string) => {
  console.log(`Getting messages for thread ${threadId}`);
  try {
    const response = await fetch(
      `${OPENAI_API_URL}/threads/${threadId}/messages`, 
      getOpenAIOptions()
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error retrieving messages: Status ${response.status}`, errorText);
      throw new Error(`Error retrieving messages: ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`Retrieved ${data.data?.length || 0} messages from OpenAI`);
    return data;
  } catch (error) {
    console.error('Error getting OpenAI thread messages:', error);
    throw error;
  }
};

// Récupération du contenu de l'assistant après une exécution complète
export const getRunOutput = async (threadId: string, runId: string) => {
  console.log(`Getting run output for thread ${threadId}, run ${runId}`);
  try {
    const response = await fetch(
      `${OPENAI_API_URL}/threads/${threadId}/runs/${runId}/steps`, 
      getOpenAIOptions()
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error retrieving run output: Status ${response.status}`, errorText);
      throw new Error(`Error retrieving run output: ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`Retrieved run steps data:`, data);
    return data;
  } catch (error) {
    console.error('Error getting run output:', error);
    throw error;
  }
};
