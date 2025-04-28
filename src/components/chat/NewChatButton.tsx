
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewChatButtonProps {
  onClick: () => void;
}

const NewChatButton = ({ onClick }: NewChatButtonProps) => {
  return (
    <div className="fixed right-6 bottom-24 z-40">
      <Button 
        size="icon" 
        onClick={onClick}
        className="w-14 h-14 rounded-full bg-darcare-gold text-darcare-navy flex items-center justify-center shadow-lg hover:opacity-90 transition-all hover:scale-105"
      >
        <Plus size={24} />
      </Button>
    </div>
  );
};

export default NewChatButton;
