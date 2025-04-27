
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainHeader from '@/components/MainHeader';
import MessageInput from '@/components/chat/MessageInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import BottomNavigation from '@/components/BottomNavigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useAssistant } from '@/hooks/useAssistant';
import Message from '@/components/chat/Message';

const ChatbotPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { messages, sendMessage, isLoading } = useAssistant();
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;
    await sendMessage(content);
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
            onClick={() => navigate('/contact-admin')}
            className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
          >
            <Mail className="h-5 w-5" />
          </Button>
        </div>
      </MainHeader>
      
      <ScrollArea 
        className="flex-1 p-4 pt-20 pb-24"
      >
        {isLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-darcare-gold" />
          </div>
        ) : (
          <div className="space-y-4">
            {messages?.map((message, index) => (
              <Message 
                key={message.id || index} 
                message={{
                  id: message.id || `temp-${index}`,
                  session_id: '',
                  user_id: '',
                  content: message.content,
                  sender: message.role === 'user' ? 'user' : 'bot',
                  timestamp: message.timestamp || new Date().toISOString(),
                }}
              />
            ))}
            {(!messages || messages.length === 0) && (
              <div className="flex flex-col items-center justify-center h-60 text-darcare-beige/50">
                <MessageSquare className="h-16 w-16 mb-4 opacity-30" />
                <p>{t('chatbot.startConversation')}</p>
              </div>
            )}
            {isLoading && messages.length > 0 && (
              <div className="flex items-center gap-2 text-darcare-beige/70">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>DarCare Assistant is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      <div className="fixed bottom-16 left-0 right-0 px-4 py-2 bg-darcare-navy border-t border-darcare-gold/20">
        <MessageInput
          onSend={handleSend}
          disabled={isLoading}
        />
      </div>
      
      <BottomNavigation activeTab="chatbot" />
    </div>
  );
};

export default ChatbotPage;
