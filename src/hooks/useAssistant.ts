
import { useThreadManagement } from './assistant/useThreadManagement';
import { useMessageManagement } from './assistant/useMessageManagement';

export const useAssistant = () => {
  const { threadId, createThread, saveUserThread } = useThreadManagement();
  const { messages, sendMessage, isLoading, loadThreadMessages } = useMessageManagement(threadId);

  const handleSendMessage = async (content: string) => {
    if (!threadId) {
      try {
        // Create a new thread automatically if one doesn't exist
        const { user } = await import('@/contexts/AuthContext').then(m => m.useAuth());
        const newThread = await createThread();
        if (user && newThread) {
          // Generate a title based on the first message content
          const title = content.length > 30 
            ? `${content.substring(0, 30)}...` 
            : content;
            
          await saveUserThread(user.id, newThread.id, title);
        }
        await sendMessage(content);
      } catch (error) {
        console.error("Error creating thread:", error);
      }
    } else {
      // Normal flow if thread already exists
      await sendMessage(content);
    }
  };

  return {
    messages,
    sendMessage: handleSendMessage,
    isLoading,
    threadId,
    loadThreadMessages
  };
};
