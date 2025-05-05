
import { ChatMessage } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";

/**
 * Extrait le contenu textuel d'un message OpenAI
 * @param message Message retourné par l'API OpenAI
 * @returns Contenu textuel du message
 */
export const extractMessageContent = (message: any): string => {
  if (!message?.content || !Array.isArray(message.content)) return '';
  
  const textContent = message.content.find((item: any) => item.type === 'text');
  return textContent?.text?.value || '';
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
      
    if (error) throw error;
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
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });
      
    if (error) throw error;
    
    return (data || []).map(message => ({
  id: message.id,
  thread_id: message.thread_id,
  content: message.content || "",
  sender: message.sender === "tenant" ? "user" : message.sender,
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
  try {
    // Vérifier si l'utilisateur a déjà un thread
    const { data: existingThreads, error: fetchError } = await supabase
      .from("chat_threads")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);
      
    if (fetchError) throw fetchError;
    
    if (existingThreads && existingThreads.length > 0) {
      return existingThreads[0];
    }
    
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
      throw new Error(`Failed to create thread: ${await response.text()}`);
    }
    
    const openaiThread = await response.json();
    
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
      
    if (error) throw error;
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
  try {
    const { data, error } = await supabase
      .from("chat_threads")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
      
    if (error) throw error;
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
  try {
    const { error } = await supabase
      .from("chat_threads")
      .update({ title, updated_at: new Date().toISOString() })
      .eq("thread_id", threadId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating thread title:", error);
    return false;
  }
};
