
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Loader2, MessageSquare, History } from 'lucide-react';
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

const ChatbotPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { messages, sendMessage, isLoading, isListening, toggleListening, threadId } = useAssistant();
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
    
    if (!threadId) {
      toast({
        title: 'Erreur',
        description: 'Connexion à l\'assistant en cours. Veuillez réessayer dans quelques instants.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      await sendMessage(content);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer votre message.',
        variant: 'destructive'
      });
    }
  };

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
            title="Historique des conversations"
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
            {messages?.map((message, index) => (
              <Message 
                key={message.id || index} 
                message={message}
              />
            ))}
            {(!messages || messages.length === 0) && (
              <div className="flex flex-col items-center justify-center h-60 text-darcare-beige/50">
                <MessageSquare className="h-16 w-16 mb-4 opacity-30" />
                <p>{t('chatbot.startConversation') || "Commencez la conversation..."}</p>
              </div>
            )}
            {isLoading && messages.length > 0 && (
              <div className="flex items-center gap-2 text-darcare-beige/70">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>DarCare Assistant réfléchit...</span>
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
          isListening={isListening}
          onToggleVoice={toggleListening}
        />
      </div>
      
      <BottomNavigation activeTab="chatbot" />
    </div>
  );
};

export default ChatbotPage;
