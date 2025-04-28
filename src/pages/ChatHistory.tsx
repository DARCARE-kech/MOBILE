
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2, ChevronRight, Plus, MessageSquare, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainHeader from '@/components/MainHeader';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import BottomNavigation from '@/components/BottomNavigation';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ChatThread {
  id: string;
  thread_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  title?: string;
}

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
      
      // Format threads with titles
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
      
      // Update local state
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
      
      // Update local state
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

  const handleCreateNewChat = async () => {
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
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={t('chat.history')} onBack={() => navigate('/chatbot')} />
        <div className="flex justify-center items-center h-72 pt-16">
          <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
        </div>
        <BottomNavigation activeTab="chatbot" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader title={t('chat.history')} onBack={() => navigate('/chatbot')} />
      
      <ScrollArea className="flex-1 p-4 pb-24 pt-20">
        <div className="space-y-4">
          {!threads || threads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 text-darcare-beige/50">
              <MessageSquare className="h-16 w-16 mb-4 opacity-30" />
              <p>{t('chat.noHistory', 'No conversation history')}</p>
            </div>
          ) : (
            threads.map((thread) => (
              <div
                key={thread.id}
                className="bg-darcare-navy/70 border border-darcare-gold/20 rounded-lg p-4 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {editingId === thread.id ? (
                      <Input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSave(thread.id);
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <>
                        <h3 className="text-darcare-gold font-medium mb-1">{thread.title}</h3>
                        <p className="text-darcare-beige/70 text-sm">
                          {format(new Date(thread.updated_at || thread.created_at), 'MMM d, yyyy • HH:mm')}
                        </p>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {editingId === thread.id ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSave(thread.id)}
                        className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(thread.id, thread.title || '')}
                          className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(thread.id)}
                          className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
                          disabled={isDeleting === thread.id}
                        >
                          {isDeleting === thread.id ? 
                            <Loader2 className="h-4 w-4 animate-spin" /> : 
                            <Trash2 className="h-4 w-4" />
                          }
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => goToChat(thread.thread_id)}
                          className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      <div className="fixed right-6 bottom-24 z-40">
        <Button 
          size="icon" 
          onClick={handleCreateNewChat}
          className="w-14 h-14 rounded-full bg-darcare-gold text-darcare-navy flex items-center justify-center shadow-lg hover:opacity-90 transition-all hover:scale-105"
        >
          <Plus size={24} />
        </Button>
      </div>
      
      <BottomNavigation activeTab="chatbot" />
    </div>
  );
};

export default ChatHistory;
