
import { MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const EmptyChatHistory = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-60 text-darcare-beige/50">
      <MessageSquare className="h-16 w-16 mb-4 opacity-30" />
      <p>{t('chat.noHistory', 'No conversation history')}</p>
    </div>
  );
};

export default EmptyChatHistory;
