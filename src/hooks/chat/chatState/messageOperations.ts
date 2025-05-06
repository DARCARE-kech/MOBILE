
import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

export const useMessageOperations = (
  currentThreadId: string | null,
  sendMessageToThread: (content: string, threadId: string) => Promise<void>
) => {
  const { toast } = useToast();

  /**
   * Send a message in the current thread
   */
  const sendMessage = useCallback(async (content: string) => {
    console.log("sendMessage called with content:", content.substring(0, 30) + "...");
    if (!currentThreadId) {
      console.error("No currentThreadId available");
      return;
    }
    
    await sendMessageToThread(content, currentThreadId);
  }, [currentThreadId, sendMessageToThread]);

  return { sendMessage };
};
