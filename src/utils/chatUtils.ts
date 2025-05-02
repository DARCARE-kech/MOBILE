import { supabase } from "@/integrations/supabase/client";
import { ChatMessage, ChatThread } from "@/types/chat";

// Format message for display
export const formatChatMessage = (message: any): ChatMessage => {
  return {
    id: message.id,
    thread_id: message.thread_id,
    content: message.content || "",
    sender: message.sender || "user",
    timestamp: message.created_at || new Date().toISOString()
  };
};

// Save message to Supabase
export const saveChatMessage = async (threadId: string, content: string, sender: 'user' | 'assistant') => {
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
    console.error("Error saving chat message:", error);
    throw error;
  }
};

// Get thread messages
export const getThreadMessages = async (threadId: string) => {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("thread_id", threadId)
      .order("created_at");

    if (error) throw error;
    return data.map(formatChatMessage);
  } catch (error) {
    console.error("Error fetching thread messages:", error);
    return [];
  }
};

// Create or get user thread
export const getOrCreateThread = async (userId: string) => {
  try {
    // First, check if user already has a thread
    const { data: existingThreads, error: fetchError } = await supabase
      .from("chat_threads")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (fetchError) throw fetchError;

    // If user has an existing thread, return it
    if (existingThreads && existingThreads.length > 0) {
      return existingThreads[0];
    }

    // Otherwise, create a new thread via OpenAI and save to Supabase
    const { data: threadData } = await supabase.functions.invoke("openai-assistant", {
      body: { action: "createThread" }
    });

    if (!threadData || !threadData.id) {
      throw new Error("Failed to create OpenAI thread");
    }

    // Save the thread reference to Supabase
    const { data, error } = await supabase
      .from("chat_threads")
      .insert({
        user_id: userId,
        thread_id: threadData.id,
        title: `New Conversation ${new Date().toLocaleDateString()}`
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating thread:", error);
    throw error;
  }
};

// Update thread title
export const updateThreadTitle = async (id: string, title: string) => {
  try {
    const { error } = await supabase
      .from("chat_threads")
      .update({ title })
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating thread title:", error);
    return false;
  }
};

// Get user threads
export const getUserThreads = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("chat_threads")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data as ChatThread[];
  } catch (error) {
    console.error("Error fetching user threads:", error);
    return [];
  }
};

// Delete thread
export const deleteThread = async (id: string) => {
  try {
    const { error } = await supabase
      .from("chat_threads")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting thread:", error);
    return false;
  }
};

export const extractMessageContent = (chatMessage: any): string => {
  // For OpenAI messages which have content as an array of objects
  if (Array.isArray(chatMessage.content)) {
    return chatMessage.content
      .filter(item => item.type === 'text')
      .map(item => item.text?.value || '')
      .join('\n');
  }
  
  // For regular text content
  return chatMessage.content || '';
};
