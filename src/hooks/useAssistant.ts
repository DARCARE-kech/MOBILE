
import { useThreadManagement } from './assistant/useThreadManagement';
import { useMessageManagement } from './assistant/useMessageManagement';

export const useAssistant = () => {
  const { threadId } = useThreadManagement();
  const { messages, sendMessage, isLoading, loadThreadMessages } = useMessageManagement(threadId);

  return {
    messages,
    sendMessage,
    isLoading,
    threadId
  };
};
