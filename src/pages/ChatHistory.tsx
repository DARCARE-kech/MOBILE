
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';
import ChatHistoryLoading from '@/components/chat/ChatHistoryLoading';
import EmptyChatHistory from '@/components/chat/EmptyChatHistory';
import ChatThreadItem from '@/components/chat/ChatThreadItem';
import NewChatButton from '@/components/chat/NewChatButton';
import { useThreads } from '@/hooks/useThreads';


const ChatHistory: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast(); 
  const { t } = useTranslation();
  const { user } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const {
  threads,
  loadThreads,
  initializeThread,
  updateThreadTitle,
  deleteThread,
  currentThread,
  setCurrentThread
} = useThreads();


  useEffect(() => {
    if (user) {
      loadThreads();
    }
  }, [user, loadThreads]);

  const handleEdit = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
  };

  const handleSave = async (id: string) => {
    if (!editingTitle.trim()) {
      toast({
        title: t('common.error'),
        description: t('chat.emptyTitleError') || 'Title cannot be empty',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const success = await updateThreadTitle(id, editingTitle);
      
      if (success) {
        setEditingId(null);
        setEditingTitle('');
      } else {
        throw new Error("Failed to update title");
      }
    } catch (error) {
      console.error("Error updating thread title:", error);
      toast({
        title: t('common.error'),
        description: t('chat.updateTitleError') || 'Could not update conversation title.',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const success = await deleteThread(id);
      
      if (success) {
        toast({
          title: t('common.success'),
          description: t('chat.deleteSuccess') || 'Conversation deleted successfully.',
        });
      } else {
        throw new Error("Failed to delete thread");
      }
    } catch (error) {
      console.error("Error deleting thread:", error);
      toast({
        title: t('common.error'),
        description: t('chat.deleteError') || 'Could not delete conversation.',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCreateNewChat = async () => {
  try {
    const newThread = await initializeThread(); // useChatbot hook
    if (newThread?.thread_id) {
      navigate(`/chatbot?thread=${newThread.thread_id}`);
    }
  } catch (error) {
    console.error("Erreur lors de la création de la conversation :", error);
    toast({
      title: t('common.error'),
      description: t('chat.creationError') || "Impossible de créer une nouvelle conversation",
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
      <MainHeader title={t('chat.history') || "Chat History"} onBack={() => navigate('/chatbot')} />
      
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
