
import { supabase } from "@/integrations/supabase/client";

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
