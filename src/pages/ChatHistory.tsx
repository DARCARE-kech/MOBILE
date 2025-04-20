
import React from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2, ChevronRight, Plus, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainHeader from '@/components/MainHeader';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import BottomNavigation from '@/components/BottomNavigation';

const ChatHistory: React.FC = () => {
  const navigate = useNavigate();
  const { sessions, deleteSession, updateSessionTitle, createSession } = useChat();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingTitle, setEditingTitle] = React.useState('');

  const handleEdit = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
  };

  const handleSave = async (id: string) => {
    await updateSessionTitle.mutateAsync({ id, title: editingTitle });
    setEditingId(null);
    setEditingTitle('');
  };

  const handleCreateNewChat = async () => {
    const session = await createSession.mutateAsync('New Conversation');
    navigate(`/chatbot?session=${session.id}`);
  };

  return (
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader title="Chat History" onBack={() => navigate('/chatbot')} />
      
      <ScrollArea className="flex-1 p-4 pb-24 pt-20">
        <div className="space-y-4">
          {!sessions || sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 text-darcare-beige/50">
              <MessageSquare className="h-16 w-16 mb-4 opacity-30" />
              <p>No chat history yet</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="luxury-card flex items-center justify-between"
              >
                <div className="flex-1">
                  {editingId === session.id ? (
                    <Input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSave(session.id);
                        }
                      }}
                    />
                  ) : (
                    <>
                      <h3 className="text-darcare-gold font-medium mb-1">{session.title}</h3>
                      <p className="text-darcare-beige/70 text-sm">
                        {format(new Date(session.updated_at), 'MMM d, yyyy • HH:mm')}
                      </p>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {editingId === session.id ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSave(session.id)}
                      className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(session.id, session.title)}
                        className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteSession.mutate(session.id)}
                        className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/chatbot?session=${session.id}`)}
                        className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
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
