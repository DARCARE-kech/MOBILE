
import { ChatMessage } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";

/**
 * Extrait le contenu textuel d'un message OpenAI
 * @param message Message retourné par l'API OpenAI
 * @returns Contenu textuel du message
 */
export const extractMessageContent = (message: any): string => {
  console.log("Extracting content from message:", message);
  if (!message?.content || !Array.isArray(message.content)) return '';
  
  const textContent = message.content.find((item: any) => item.type === 'text');
  const result = textContent?.text?.value || '';
  console.log("Extracted content:", result);
  return result;
};

/**
 * Extracts text from the assistant's run output
 * @param output Output from OpenAI assistant run
 * @returns Extracted text or empty string if not found
 */
export const extractAssistantOutput = async (output: any, threadId: string): Promise<string> => {
  console.log("Extracting assistant output:", output);
  try {
    const messageStep = output?.data?.find(
      (step: any) => step?.step_details?.message_creation?.message_id
    );

    const OPENAI_API_KEY = 'sk-proj-AKfihkIbBcjeXHTTiq83T3BlbkFJcrUxEJK09t4xmjVWUERx';

    const messageId = messageStep?.step_details?.message_creation?.message_id;

    if (!messageId) {
      console.warn("No assistant message ID found in step");
      return '';
    }

    if (!threadId || !messageId) {
  console.error("❌ Problème : threadId ou messageId manquant", { threadId, messageId });
  return '';
}

    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages/${messageId}`, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
    });

    const data = await response.json();
    console.log("Message content response:", data);
     console.log("📩 Full message response from OpenAI:", JSON.stringify(data, null, 2));

    const contentBlock = data.content?.find(
      (c: any) => c.type === "text" || c.type === "output_text"
    );

    if (!contentBlock) {
      console.warn("No text block found in message content");
      return '';
    }
    console.log("🧩 Extracted contentBlock:", contentBlock);

    // Handle both formats
    if (typeof contentBlock.text === 'string') {
      console.log("✅ Assistant message (plain string):", contentBlock.text);
      
      return contentBlock.text;
    }

    if (contentBlock.text?.value) {
      console.log("✅ Assistant message (rich object):", contentBlock.text.value);
      return contentBlock.text.value;
    }

    return '';
  } catch (error) {
    console.error("Error extracting assistant output:", error);
    return '';
  }
  
};


/**
 * Enregistre un message dans la base de données Supabase
 * @param threadId ID du thread
 * @param content Contenu du message
 * @param sender Expéditeur du message ('user' ou 'assistant')
 * @returns Le message créé ou null en cas d'erreur
 */
export const saveChatMessage = async (
  threadId: string, 
  content: string, 
  sender: 'user' | 'assistant'
) => {
  console.log(`Saving chat message: threadId=${threadId}, sender=${sender}, content length=${content.length}`);
  
  if (!threadId || !content || content.trim().length === 0) {
    console.error("Invalid parameters for saveChatMessage:", { threadId, contentLength: content?.length, sender });
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        thread_id: threadId,
        content,
        sender
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error saving message:", error);
      throw error;
    }
    console.log("Message saved successfully:", data);
    return data;
  } catch (error) {
    console.error("Error saving message:", error);
    return null;
  }
};

/**
 * Récupère les messages d'un thread
 * @param threadId ID du thread
 * @returns Liste des messages du thread
 */
export const getThreadMessages = async (threadId: string): Promise<ChatMessage[]> => {
  console.log(`Getting messages for threadId=${threadId}`);
  
  if (!threadId) {
    console.error("No threadId provided to getThreadMessages");
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading messages:", error);
      return [];
    }

    console.log(`Retrieved ${data?.length || 0} messages from thread ${threadId}`);
    
    // Transform database rows to ChatMessage type
    const chatMessages: ChatMessage[] = data?.map(msg => ({
      id: msg.id,
      thread_id: msg.thread_id,
      content: msg.content || '',
      sender: msg.sender as 'user' | 'assistant',
      created_at: msg.created_at || new Date().toISOString()
    })) || [];
    
    return chatMessages;
  } catch (error) {
    console.error("Error in getThreadMessages:", error);
    return [];
  }
};

/**
 * Crée ou récupère un thread pour un utilisateur
 * @param userId ID de l'utilisateur
 * @returns Thread créé ou existant
 */
export const getOrCreateUserThread = async (userId: string) => {
  console.log(`Getting or creating thread for userId=${userId}`);
  try {
    // Vérifier si l'utilisateur a déjà un thread
    const { data: existingThreads, error: fetchError } = await supabase
      .from("chat_threads")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);
      
    if (fetchError) {
      console.error("Error fetching existing threads:", fetchError);
      throw fetchError;
    }
    
    if (existingThreads && existingThreads.length > 0) {
      console.log("Found existing thread:", existingThreads[0]);
      return existingThreads[0];
    }
    
    console.log("No existing thread found, creating a new one");
    
    // Si aucun thread n'existe, en créer un nouveau via l'API OpenAI
    const response = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer sk-proj-AKfihkIbBcjeXHTTiq83T3BlbkFJcrUxEJK09t4xmjVWUERx`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({})
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to create thread: Status ${response.status}`, errorText);
      throw new Error(`Failed to create thread: ${errorText}`);
    }
    
    const openaiThread = await response.json();
    console.log("Created new OpenAI thread:", openaiThread);
    
    // Enregistrer le thread dans la base de données
    const { data, error } = await supabase
      .from("chat_threads")
      .insert({
        user_id: userId,
        thread_id: openaiThread.id,
        title: "Nouvelle conversation"
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error saving thread to database:", error);
      throw error;
    }
    
    console.log("Thread saved to database:", data);
    return data;
  } catch (error) {
    console.error("Error in getOrCreateUserThread:", error);
    throw error;
  }
};
export const createNewThread = async (userId: string) => {
  console.log("Creating a brand new thread for user:", userId);

  try {
    const response = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer sk-proj-AKfihkIbBcjeXHTTiq83T3BlbkFJcrUxEJK09t4xmjVWUERx`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI thread creation failed: ${errorText}`);
    }

    const openaiThread = await response.json();
    console.log("✅ Created OpenAI thread:", openaiThread);

    const { data, error } = await supabase
      .from("chat_threads")
      .insert({
        user_id: userId,
        thread_id: openaiThread.id,
        title: "Nouvelle conversation"
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Error saving thread to DB:", error);
      throw error;
    }

    console.log("✅ Thread saved to Supabase:", data);
    return data;
  } catch (err) {
    console.error("❌ Failed to create new thread:", err);
    throw err;
  }
};


/**
 * Récupère tous les threads d'un utilisateur
 * @param userId ID de l'utilisateur
 * @returns Liste des threads de l'utilisateur
 */
export const getUserThreads = async (userId: string) => {
  console.log(`Getting threads for userId=${userId}`);
  try {
    const { data, error } = await supabase
      .from("chat_threads")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
      
    if (error) {
      console.error("Error getting user threads:", error);
      throw error;
    }
    console.log(`Retrieved ${data?.length || 0} threads for user ${userId}`);
    return data || [];
  } catch (error) {
    console.error("Error getting user threads:", error);
    return [];
  }
};

/**
 * Met à jour le titre d'un thread
 * @param threadId ID du thread
 * @param title Nouveau titre
 * @returns Succès ou échec de la mise à jour
 */
