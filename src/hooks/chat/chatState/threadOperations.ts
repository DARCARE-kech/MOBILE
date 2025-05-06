
import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { ChatThread } from "@/types/chat";

export const useThreadOperations = (
  initializeThreadWithMessages: (threadIdToUse?: string) => Promise<void>,
  setIsLoading: (loading: boolean) => void
) => {
  const { user } = useAuth();
  const { toast } = useToast();

  /**
   * Switch to another thread
   */
  const switchThread = useCallback(async (threadId: string) => {
    console.log("switchThread called with threadId:", threadId);
    if (!user?.id) {
      console.log("No user.id available, cannot switch thread");
      return;
    }
    
    try {
      setIsLoading(true);
      await initializeThreadWithMessages(threadId);
    } catch (error) {
      console.error("Error switching thread:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger cette conversation",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, initializeThreadWithMessages, toast, setIsLoading]);

  return { switchThread };
};
