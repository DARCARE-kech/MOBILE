
import React from 'react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types/chat';

interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={cn(
      'flex w-full mb-4',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        'max-w-[80%] rounded-2xl px-4 py-2',
        isUser ? 'bg-darcare-gold text-darcare-navy' : 'bg-darcare-navy border border-darcare-gold/20 text-darcare-beige'
      )}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};

export default Message;
