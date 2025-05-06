
import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export const useInitializationLogic = (
  user: any,
  initializeThread: (threadIdToUse?: string) => Promise<any>,
  loadMessages: (threadId: string) => Promise<any>,
  setIsLoading: (loading: boolean) => void
) => {
  const { toast } = useToast();

  /**
   * Initialize a thread and load its messages
   */
  const initializeThreadWithMessages = useCallback(async (threadIdToUse?: string) => {
    console.log("initializeThreadWithMessages called with threadIdToUse =", threadIdToUse);
    
    if (!user?.id) {
      console.log("No user.id available, cannot initialize thread");
      return;
    }

    try {
      // Set loading state
      setIsLoading(true);
      
      // Initialize thread
      const thread = await initializeThread(threadIdToUse);
      
      if (thread) {
        console.log("Thread initialized, loading messages for thread:", thread.thread_id);
        // Load messages for this thread
        await loadMessages(thread.thread_id);
      }
    } catch (error) {
      console.error("Error initializing thread with messages:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser la conversation",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, initializeThread, loadMessages, toast, setIsLoading]);

  return { initializeThreadWithMessages };
};
