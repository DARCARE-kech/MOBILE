
import { useThreadManagement } from './assistant/useThreadManagement';
import { useMessageManagement } from './assistant/useMessageManagement';
import { useVoiceAssistant } from './assistant/useVoiceAssistant';

export const useAssistant = () => {
  const { threadId } = useThreadManagement();
  const { messages, sendMessage, isLoading, loadThreadMessages } = useMessageManagement(threadId);
  const { isListening, toggleListening, voiceTranscript } = useVoiceAssistant(threadId, sendMessage);

  return {
    messages,
    sendMessage,
    isLoading,
    threadId,
    isListening,
    toggleListening,
    voiceTranscript
  };
};
