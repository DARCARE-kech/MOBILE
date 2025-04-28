
import { Loader2 } from 'lucide-react';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';

const ChatHistoryLoading = () => {
  return (
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader title="Chat History" onBack={() => window.history.back()} />
      <div className="flex justify-center items-center h-72 pt-16">
        <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
      </div>
      <BottomNavigation activeTab="chatbot" />
    </div>
  );
};

export default ChatHistoryLoading;
