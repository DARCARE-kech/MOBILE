
import { MessageSquareOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const EmptyChatHistory = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center h-60 text-center p-4">
      <MessageSquareOff className="h-16 w-16 mb-4 text-darcare-gold/30" />
      <h3 className="text-darcare-gold font-medium mb-2">
        {t('chatbot.noConversationsYet', 'No conversations yet')}
      </h3>
      <p className="text-darcare-beige/70 text-sm">
        {t('chatbot.startNewChatPrompt', 'Start a new conversation with the assistant to see it here')}
      </p>
    </div>
  );
};

export default EmptyChatHistory;
