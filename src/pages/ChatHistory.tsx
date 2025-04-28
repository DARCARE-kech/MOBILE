import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';
import ChatHistoryLoading from '@/components/chat/ChatHistoryLoading';
import EmptyChatHistory from '@/components/chat/EmptyChatHistory';
import ChatThreadItem from '@/components/chat/ChatThreadItem';
import NewChatButton from '@/components/chat/NewChatButton';
import type { ChatThread } from '@/types/chat';

const ChatHistory: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast(); 
  const { t } = useTranslation();
  const { user } = useAuth();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadThreads();
    }
  }, [user]);

  const loadThreads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_threads')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedThreads = data.map(thread => ({
        ...thread,
        title: thread.title || `Conversation ${new Date(thread.created_at).toLocaleDateString()}`
      }));
      
      setThreads(formattedThreads);
    } catch (error) {
      console.error("Error loading threads:", error);
      toast({
        title: 'Error',
        description: 'Could not load your conversation history.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
  };

  const handleSave = async (id: string) => {
    if (!editingTitle.trim()) {
      toast({
        title: t('common.error'),
        description: t('chat.emptyTitleError', 'Title cannot be empty'),
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('chat_threads')
        .update({ title: editingTitle })
        .eq('id', id);
      
      if (error) throw error;
      
      setThreads(prev => prev.map(thread => 
        thread.id === id ? { ...thread, title: editingTitle } : thread
      ));
      
      setEditingId(null);
      setEditingTitle('');
    } catch (error) {
      console.error("Error updating thread title:", error);
      toast({
        title: 'Error',
        description: 'Could not update conversation title.',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const threadToDelete = threads.find(t => t.id === id);
      if (!threadToDelete) return;
      
      const { error } = await supabase
        .from('chat_threads')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setThreads(prev => prev.filter(thread => thread.id !== id));
      
      toast({
        title: 'Success',
        description: 'Conversation deleted successfully.',
      });
    } catch (error) {
      console.error("Error deleting thread:", error);
      toast({
        title: 'Error',
        description: 'Could not delete conversation.',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCreateNewChat = () => {
    try {
      navigate('/chatbot');
    } catch (error) {
      console.error('Error creating new chat:', error);
      toast({
        title: 'Error',
        description: 'Could not create a new conversation.',
        variant: 'destructive'
      });
    }
  };
  
  const goToChat = (threadId: string) => {
    navigate(`/chatbot?thread=${threadId}`);
  };

  if (isLoading) {
    return <ChatHistoryLoading />;
  }

  return (
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader title={t('chat.history')} onBack={() => navigate('/chatbot')} />
      
      <ScrollArea className="flex-1 p-4 pb-24 pt-20">
        <div className="space-y-4">
          {!threads || threads.length === 0 ? (
            <EmptyChatHistory />
          ) : (
            threads.map((thread) => (
              <ChatThreadItem
                key={thread.id}
                thread={thread}
                editingId={editingId}
                editingTitle={editingTitle}
                isDeleting={isDeleting}
                onEdit={handleEdit}
                onSave={handleSave}
                onDelete={handleDelete}
                onNavigate={goToChat}
                setEditingTitle={setEditingTitle}
              />
            ))
          )}
        </div>
      </ScrollArea>
      
      <NewChatButton onClick={handleCreateNewChat} />
      <BottomNavigation activeTab="chatbot" />
    </div>
  );
};

export default ChatHistory;
