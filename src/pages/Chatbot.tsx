
import React from 'react';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';

const ChatbotPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader title="Chatbot" />
      
      <div className="p-4 pb-24">
        <div className="luxury-card">
          <h2 className="text-xl font-serif text-darcare-gold mb-3">Personal Assistant</h2>
          <p className="text-darcare-beige">
            Your AI concierge is ready to help with any questions or requests.
          </p>
        </div>
      </div>
      
      <BottomNavigation activeTab="chatbot" />
    </div>
  );
};

export default ChatbotPage;
