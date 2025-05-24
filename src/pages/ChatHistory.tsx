
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
import { useThreads } from '@/hooks/chat/useThreads'; // Fixed import path
import { createNewThread } from "@/utils/chatUtils"; 




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
    setThreads,
    setCurrentThread,
  } = useThreads();

  // Add a local isLoading state if it's not provided by useThreads
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      loadThreads().finally(() => setIsLoading(false));
    }
  }, [user, loadThreads]);

  const handleEdit = (threadId: string, currentTitle: string) => {
    setEditingId(threadId);
    setEditingTitle(currentTitle);
  };

  const handleSave = async (threadId: string) => {
    if (!editingTitle.trim()) {
      toast({
        title: t('common.error'),
        description: t('chat.emptyTitleError') || 'Title cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    try {
      const success = await updateThreadTitle(threadId, editingTitle);

      if (success) {
        // Immediately update local state for better UX
        const updatedThreads = threads.map(thread =>
          thread.thread_id === threadId ? { ...thread, title: editingTitle } : thread
        );
        setEditingId(null);
        setEditingTitle('');
        setThreads(updatedThreads); // Update local state with new thread titles
        console.log("Thread title updated in UI:", threadId, editingTitle);
      } else {
        throw new Error("Failed to update title");
      }
    } catch (error) {
      console.error("Error updating thread title:", error);
      toast({
        title: t('common.error'),
        description: t('chat.updateTitleError') || 'Could not update conversation title.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (threadId: string) => {
    setIsDeleting(threadId);

    try {
      const success = await deleteThread(threadId);

      if (success) {
        toast({
          title: t('common.success'),
          description: t('chat.deleteSuccess') || 'Conversation deleted successfully.',
        });

        // Immediately update local state by filtering out the deleted thread
        const remainingThreads = threads.filter(thread => thread.thread_id !== threadId);
        setThreads(remainingThreads);
        console.log("Thread removed from UI:", threadId);
      } else {
        throw new Error("Failed to delete thread");
      }
    } catch (error) {
      console.error("Error deleting thread:", error);
      toast({
        title: t('common.error'),
        description: t('chat.deleteError') || 'Could not delete conversation.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCreateNewChat = async () => {
    if (!user?.id) return;
    try {
      const newThread = await createNewThread(user.id);
      if (newThread?.thread_id) {
        navigate(`/chatbot?thread=${newThread.thread_id}`);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer une nouvelle conversation.",
        variant: "destructive"
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
      <MainHeader title={t('chatbot.chatHistory')} showBack={true}
          onBack={() => navigate('/chatbot')} />
      
      <ScrollArea className="flex-1 p-4 pb-24 pt-20">
        <div className="space-y-4">
          {!threads || threads.length === 0 ? (
            <EmptyChatHistory />
          ) : (
            threads.map((thread) => (
              <ChatThreadItem
                key={thread.thread_id}
                thread={thread}
                editingId={editingId}
                editingTitle={editingTitle}
                isDeleting={isDeleting}
                onEdit={handleEdit}
                onSave={() => handleSave(thread.thread_id)} 
                onDelete={() => handleDelete(thread.thread_id)}
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
