
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/chat";

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
      throw error;
    }

    console.log(`Retrieved ${data?.length || 0} messages from thread ${threadId}`);
    
    // Transform database rows to ChatMessage type
    const chatMessages: ChatMessage[] = data?.map(msg => ({
      id: msg.id,
      thread_id: msg.thread_id || '',
      content: msg.content || '',
      sender: (msg.sender as 'user' | 'assistant' | 'bot' | 'admin') || 'assistant',
      created_at: msg.created_at || new Date().toISOString()
    })) || [];
    
    return chatMessages;
  } catch (error) {
    console.error("Error in getThreadMessages:", error);
    return [];
  }
};
