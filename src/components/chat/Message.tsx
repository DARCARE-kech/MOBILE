
import React from 'react';
import { AssistantMessage } from '@/types/chat';

export interface MessageProps {
  message: AssistantMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`${
          isUser
            ? 'bg-primary text-primary-foreground rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl'
            : 'bg-muted rounded-tl-2xl rounded-tr-2xl rounded-br-2xl'
        } p-4 max-w-[80%]`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};

export default Message;
