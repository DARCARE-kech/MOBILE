
import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { History, Mail, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainHeader from '@/components/MainHeader';
import ChatInput from '@/components/chat/ChatInput';
import ChatMessageComponent from '@/components/chat/ChatMessage';

import { ScrollArea } from '@/components/ui/scroll-area';
import BottomNavigation from '@/components/BottomNavigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import useChatbot from '@/hooks/useChatbot';

const ChatbotPage: React.FC = () => {
  console.log("Rendering ChatbotPage component");
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  console.log("Current user:", user);
  
  const { t } = useTranslation();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Parse thread ID from URL if present
  const queryParams = new URLSearchParams(location.search);
  const threadParam = queryParams.get('thread');
  console.log("Thread param from URL:", threadParam);
  
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    initializeThread, 
    currentThread
  } = useChatbot(threadParam || undefined);
  
  console.log("Current messages:", messages);
  console.log("isLoading:", isLoading);
  console.log("currentThread:", currentThread);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    console.log("Messages changed, scrolling to bottom. Messages count:", messages?.length);
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Redirect to auth if not logged in
  useEffect(() => {
    console.log("Checking if user is logged in");
    if (!user) {
      console.log("No user found, redirecting to auth");
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleSend = async (content: string) => {
    console.log(`handleSend called with content: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`);
    if (!content.trim()) {
      console.log("Content is empty, not sending");
      return;
    }
    
    try {
      console.log("Sending message");
      await sendMessage(content);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: t('common.error'),
        description: t('chatbot.messageError'),
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-darcare-navy to-darcare-navy/90 flex flex-col">
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
            title={t('chatbot.history')}
          >
            <History className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/contact-admin')}
            className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
            title={t('chatbot.contactAdmin')}
          >
            <Mail className="h-5 w-5" />
          </Button>
        </div>
      </MainHeader>
      
      <ScrollArea 
        className="flex-1 p-4 pt-20 pb-36"
      >
        {isLoading && messages?.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-darcare-gold" />
          </div>
        ) : (
          <div className="space-y-4">
            {messages && messages.length > 0 ? (
              messages.map((message) => (
                <ChatMessageComponent
                  key={message.id}
                  message={message}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-60 text-darcare-beige/50">
                <MessageSquare className="h-16 w-16 mb-4 opacity-30" />
                <p>{t('chatbot.startConversation')}</p>
              </div>
            )}
            
            {isLoading && messages?.length > 0 && (
              <div className="flex items-center gap-2 text-darcare-beige/70">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t('chatbot.thinking')}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      <div className="fixed bottom-20 left-0 right-0 px-4 py-2 bg-gradient-to-b from-darcare-navy/70 to-darcare-navy border-t border-darcare-gold/20 z-20">
  <ChatInput
    onSend={handleSend}
    disabled={isLoading}
    placeholder={t('chatbot.typeMessage')}
  />
</div>
      
      <BottomNavigation activeTab="chatbot" />
    </div>
  );
};

export default ChatbotPage;
