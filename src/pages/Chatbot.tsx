
import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Clock, Mail, Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainHeader from '@/components/MainHeader';
import Message from '@/components/chat/Message';
import MessageInput from '@/components/chat/MessageInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/hooks/useChat';
import BottomNavigation from '@/components/BottomNavigation';
import { useTranslation } from 'react-i18next';

const ChatbotPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const { messages, sendMessage, currentSessionId, setCurrentSessionId } = useChat(sessionId || undefined);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (sessionId) {
      setCurrentSessionId(sessionId);
    }
  }, [sessionId, setCurrentSessionId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (content: string) => {
    await sendMessage.mutateAsync({ content, sender: 'user' });
    // Simulate bot response
    setTimeout(() => {
      sendMessage.mutate({ 
        content: t('chatbot.aiResponse'), 
        sender: 'bot' 
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-darcare-navy flex flex-col">
      <MainHeader 
        title={t('navigation.chatbot')}
        onBack={() => navigate("/home")}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/chat-history')}
            className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
          >
            <Clock className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/contact-admin')}
            className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
          >
            <Mail className="h-5 w-5" />
          </Button>
        </div>
      </MainHeader>
      
      <ScrollArea className="flex-1 p-4 pt-20 pb-24" ref={scrollRef}>
        <div className="space-y-4">
          {messages?.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          {(!messages || messages.length === 0) && (
            <div className="flex flex-col items-center justify-center h-60 text-darcare-beige/50">
              <MessageSquare className="h-16 w-16 mb-4 opacity-30" />
              <p>{t('chatbot.startConversation')}</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="fixed bottom-16 left-0 right-0 px-4 py-2 bg-darcare-navy border-t border-darcare-gold/20">
        <MessageInput
          onSend={handleSend}
          disabled={sendMessage.isPending}
        />
      </div>
      
      <BottomNavigation activeTab="chatbot" />
    </div>
  );
};

export default ChatbotPage;
