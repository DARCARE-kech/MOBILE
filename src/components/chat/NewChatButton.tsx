
import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface NewChatButtonProps {
  onClick: () => void;
}

const NewChatButton: React.FC<NewChatButtonProps> = ({ onClick }) => {
  const { t } = useTranslation();
  
  return (
    <div className="fixed right-6 bottom-24">
      <Button
        className="h-14 w-14 rounded-full bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90 shadow-lg"
        onClick={onClick}
      >
        <MessageSquarePlus className="h-6 w-6" />
        <span className="sr-only">{t('chatbot.newChat')}</span>
      </Button>
    </div>
  );
};

export default NewChatButton;
