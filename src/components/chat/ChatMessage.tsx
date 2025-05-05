
import React from 'react';
import { ChatMessage } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface MessageProps {
  message: ChatMessage;
}

const ChatMessageComponent: React.FC<MessageProps> = ({ message }) => {
  const { t } = useTranslation();
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex items-start gap-3 mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar className="bg-darcare-gold/20 border border-darcare-gold/30 text-darcare-gold h-8 w-8">
          <Bot className="h-4 w-4" />
        </Avatar>
      )}
      
      <div
        className={cn(
          "px-4 py-3 rounded-xl max-w-[80%] shadow-sm",
          isUser 
            ? "bg-darcare-gold text-darcare-navy rounded-tr-none" 
            : "bg-darcare-navy/50 border border-darcare-gold/20 text-darcare-beige rounded-tl-none"
        )}
        aria-label={isUser ? t('chatbot.userMessage') : t('chatbot.assistantMessage')}
      >
        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
      </div>
      
      {isUser && (
        <Avatar className="bg-darcare-gold text-darcare-navy h-8 w-8">
          <User className="h-4 w-4" />
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessageComponent;
