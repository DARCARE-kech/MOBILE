
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
  console.log(`Getting thread messages for threadId=${threadId}`);
  try {
    // Use .eq instead of converting to UUID since thread_id is stored as text
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });
      
    if (error) {
      console.error("Error getting thread messages:", error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} messages for thread ${threadId}`);
    
    return (data || []).map(message => ({
      id: message.id,
      thread_id: message.thread_id,
      content: message.content || "",
      sender: message.sender === "user" ? "user" : "assistant" as "user" | "assistant" | "bot" | "admin",
      timestamp: message.created_at || new Date().toISOString()
    }));
  } catch (error) {
    console.error("Error getting thread messages:", error);
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
export const updateThreadTitle = async (threadId: string, title: string) => {
  console.log(`Updating title for threadId=${threadId} to "${title}"`);
  try {
    const { error } = await supabase
      .from("chat_threads")
      .update({ title, updated_at: new Date().toISOString() })
      .eq("thread_id", threadId);
    
    if (error) {
      console.error("Error updating thread title:", error);
      throw error;
    }
    console.log("Thread title updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating thread title:", error);
    return false;
  }
};
