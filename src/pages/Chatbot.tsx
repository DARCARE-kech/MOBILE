
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { History, Mail, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainHeader from '@/components/MainHeader';
import MessageInput from '@/components/chat/MessageInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import BottomNavigation from '@/components/BottomNavigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useAssistant } from '@/hooks/useAssistant';
import Message from '@/components/chat/Message';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ChatbotPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { messages, sendMessage, isLoading, threadId } = useAssistant();
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [initializing, setInitializing] = useState(true);

  // Parse thread ID from URL if present
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const threadParam = queryParams.get('thread');
    
    if (threadParam && user) {
      // If thread ID is in URL, need to verify it belongs to user
      const checkThreadOwnership = async () => {
        try {
          const { data, error } = await supabase
            .from('chat_threads')
            .select('thread_id')
            .eq('thread_id', threadParam)
            .eq('user_id', user.id)
            .single();
          
          if (error || !data) {
            console.error("Thread ownership verification failed:", error);
            toast({
              title: 'Error',
              description: 'Could not access the requested conversation.',
              variant: 'destructive'
            });
            // Redirect to main chatbot page without thread param
            navigate('/chatbot', { replace: true });
          }
        } catch (error) {
          console.error("Thread verification error:", error);
        } finally {
          setInitializing(false);
        }
      };
      
      checkThreadOwnership();
    } else {
      setInitializing(false);
    }
  }, [location.search, user, navigate]);

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
    
    try {
      await sendMessage(content);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Could not send your message.',
        variant: 'destructive'
      });
    }
  };

  // Show loading state while initializing thread management
  if (initializing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-darcare-navy to-darcare-navy/90 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
        <p className="text-darcare-beige mt-4">Connecting to assistant...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-darcare-navy to-darcare-navy/90 flex flex-col">
      <MainHeader 
        title={t('navigation.chatbot') || "DarCare Assistant"}
        onBack={() => navigate("/home")}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/chat-history')}
            className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
            title="Conversation History"
          >
            <History className="h-5 w-5" />
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
      
      <ScrollArea 
        className="flex-1 p-4 pt-20 pb-24"
      >
        {isLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-darcare-gold" />
          </div>
        ) : (
          <div className="space-y-4">
            {messages?.length > 0 ? (
              messages.map((message, index) => (
                <Message 
                  key={message.id || index} 
                  message={message}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-60 text-darcare-beige/50">
                <MessageSquare className="h-16 w-16 mb-4 opacity-30" />
                <p>{t('chatbot.startConversation') || "Start the conversation..."}</p>
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

      <div className="fixed bottom-16 left-0 right-0 px-4 py-2 bg-gradient-to-b from-darcare-navy/70 to-darcare-navy border-t border-darcare-gold/20">
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
