
import { useState } from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ChatThread } from '@/types/chat';

interface ChatThreadItemProps {
  thread: ChatThread;
  editingId: string | null;
  editingTitle: string;
  isDeleting: string | null;
  onEdit: (id: string, title: string) => void;
  onSave: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigate: (threadId: string) => void;
  setEditingTitle: (title: string) => void;
}

const ChatThreadItem = ({
  thread,
  editingId,
  editingTitle,
  isDeleting,
  onEdit,
  onSave,
  onDelete,
  onNavigate,
  setEditingTitle,
}: ChatThreadItemProps) => {
  return (
    <div className="bg-darcare-navy/70 border border-darcare-gold/20 rounded-lg p-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {editingId === thread.id ? (
            <Input
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              className="bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSave(thread.id);
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
              onClick={() => onSave(thread.id)}
              className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(thread.id, thread.title || '')}
                className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(thread.id)}
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
                onClick={() => onNavigate(thread.thread_id)}
                className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatThreadItem;
