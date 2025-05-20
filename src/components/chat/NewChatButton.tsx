
import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NewChatButtonProps {
  onClick: () => void;
}

const NewChatButton: React.FC<NewChatButtonProps> = ({ onClick }) => {
  const { t } = useTranslation();
  const location = useLocation();
  
  // Check if we're on the home page to adjust position
  const isHomePage = location.pathname === '/';
  
  return (
    <div className={`fixed right-6 ${isHomePage ? 'bottom-36' : 'bottom-24'}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          className="h-12 w-12 rounded-full bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90 shadow-lg"
          onClick={onClick}
        >
          <MessageSquarePlus className="h-5 w-5" />
          <span className="sr-only">{t('chatbot.newChat')}</span>
        </Button>
      </motion.div>
    </div>
  );
};

export default NewChatButton;
