
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
          await saveUserThread(user.id, newThread.id);
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
