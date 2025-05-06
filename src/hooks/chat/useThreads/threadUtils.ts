
import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ChatThread } from "@/types/chat";
import { 
  getUserThreads, 
  getOrCreateUserThread, 
  updateThreadTitle as updateThreadTitleUtil 
} from "@/utils/chat";
import { UseThreadsReturnType } from "../chatState/types";

/**
 * Hook for managing chat threads
 */
export const useThreads = (): UseThreadsReturnType => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [currentThread, setCurrentThread] = useState<ChatThread | null>(null);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);

  /**
   * Loads all threads for the current user
   */
  const loadThreads = useCallback(async () => {
    console.log("loadThreads called, user?.id =", user?.id);
    if (!user?.id) {
      console.log("No user.id available, cannot load threads");
      return;
    }
    
    try {
      const userThreads = await getUserThreads(user.id);
      console.log("Loaded user threads:", userThreads);
      setThreads(userThreads);
    } catch (error) {
      console.error("Error loading threads:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des conversations",
        variant: "destructive"
      });
    }
  }, [user?.id, toast]);

  /**
   * Initializes a thread for the current user
   */
  const initializeThread = useCallback(async (threadIdToUse?: string) => {
    console.log("initializeThread called with threadIdToUse =", threadIdToUse);
    console.log("Current user?.id =", user?.id);
    
    if (!user?.id) {
      console.log("No user.id available, cannot initialize thread");
      return null;
    }

    try {
      let thread;

      if (threadIdToUse) {
        console.log(`Looking for existing thread with ID ${threadIdToUse}`);
        // Get existing thread
        const { data, error } = await supabase
          .from("chat_threads")
          .select("*")
          .eq("thread_id", threadIdToUse)
          .single();

        if (error || !data) {
          console.error("Error finding thread:", error);
          throw new Error("Thread not found");
        }
        console.log("Found existing thread:", data);
        thread = data;
      } else {
        console.log("No threadId provided, getting or creating thread");
        // Get or create new thread
        thread = await getOrCreateUserThread(user.id);
        console.log("Got or created thread:", thread);
      }

      setCurrentThread(thread);
      setCurrentThreadId(thread.thread_id);
      console.log("Current thread set to:", thread);
      
      return thread;
    } catch (error) {
      console.error("Error initializing thread:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser la conversation",
        variant: "destructive"
      });
      return null;
    }
  }, [user?.id, toast]);

  /**
   * Updates the title of a thread
   */
  const updateThreadTitle = useCallback(async (threadId: string, title: string) => {
    console.log(`updateThreadTitle called with threadId: ${threadId}, title: ${title}`);
    if (!title.trim()) {
      console.log("Title is empty, not updating");
      return false;
    }
    
    try {
      const success = await updateThreadTitleUtil(threadId, title);
      
      if (success) {
        console.log("Title updated successfully, reloading threads");
        await loadThreads();
        
        if (currentThread?.thread_id === threadId) {
          console.log("Updating current thread title in state");
          setCurrentThread(prev => prev ? { ...prev, title } : null);
        }
      }
      
      return success;
    } catch (error) {
      console.error("Error updating thread title:", error);
      return false;
    }
  }, [loadThreads, currentThread]);

  /**
   * Deletes a thread
   */
  const deleteThread = useCallback(async (threadId: string) => {
    console.log("deleteThread called with threadId:", threadId);
    try {
      console.log("Deleting thread from Supabase");
      const { error } = await supabase
        .from("chat_threads")
        .delete()
        .eq("thread_id", threadId);
        
      if (error) {
        console.error("Error deleting thread:", error);
        throw error;
      }
      
      console.log("Thread deleted, reloading threads");
      await loadThreads();
      
      if (currentThread?.thread_id === threadId) {
        console.log("Deleted the current thread, resetting state");
        setCurrentThread(null);
        setCurrentThreadId(null);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting thread:", error);
      return false;
    }
  }, [loadThreads, currentThread]);

  return {
    threads,
    currentThread,
    currentThreadId,
    loadThreads,
    initializeThread,
    updateThreadTitle,
    deleteThread,
    setCurrentThread,
    setCurrentThreadId
  };
};
