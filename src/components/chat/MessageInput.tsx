
import React, { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Mic, MicOff } from 'lucide-react';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isListening?: boolean;
  onToggleVoice?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSend, 
  disabled, 
  isListening = false, 
  onToggleVoice 
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && message.trim()) {
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
        placeholder="Type your message..."
        disabled={disabled}
        className="flex-1 bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige placeholder:text-darcare-beige/50 rounded-full"
      />
      {onToggleVoice && (
        <Button 
          type="button" 
          size="icon"
          onClick={onToggleVoice}
          className={`${isListening 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-darcare-gold hover:bg-darcare-gold/90'} text-darcare-navy rounded-full shadow-md`}
          disabled={disabled}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
      )}
      <Button 
        type="submit" 
        size="icon"
        disabled={disabled || !message.trim()}
        className="bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90 rounded-full shadow-md"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default MessageInput;
