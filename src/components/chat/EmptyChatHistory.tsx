
import { MessageSquarePlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const EmptyChatHistory = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center h-72 text-darcare-beige/60">
      <MessageSquarePlus className="h-16 w-16 mb-4 opacity-30" />
      <p className="text-lg">{t('chatbot.noHistoryYet') || 'No conversation history yet'}</p>
      <p className="text-sm mt-2">{t('chatbot.startNewChat') || 'Start a new chat to begin'}</p>
    </div>
  );
};

export default EmptyChatHistory;
