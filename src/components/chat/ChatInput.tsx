
import React, { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled, placeholder }) => {
  const [message, setMessage] = useState('');
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && message.trim() && !disabled) {
      e.preventDefault();
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || t('chatbot.typeMessage')}
        disabled={disabled}
        aria-label={t('chatbot.messageInputLabel')}
        className="flex-1 bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige placeholder:text-darcare-beige/50 rounded-full"
      />
      <Button 
        type="submit" 
        size="icon"
        disabled={disabled || !message.trim()}
        aria-label={t('chatbot.sendMessage')}
        className="bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90 rounded-full shadow-md"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;
