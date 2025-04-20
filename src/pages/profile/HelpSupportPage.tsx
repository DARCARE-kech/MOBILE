
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, PhoneCall, MessageSquare, FileText } from 'lucide-react';
import MainHeader from '@/components/MainHeader';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const HelpSupportPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader title="Help & Support" onBack={() => navigate('/profile')} />
      
      <div className="pt-20 pb-24 px-4">
        <Card className="p-6 bg-darcare-navy/50 border-darcare-gold/20 mb-6">
          <h2 className="text-xl font-serif text-darcare-gold mb-4">Need Assistance?</h2>
          
          <div className="space-y-5">
            <div className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => navigate('/contact-admin')}>
              <MessageSquare className="h-5 w-5 text-darcare-gold" />
              <div className="flex-1">
                <span className="text-darcare-beige">Contact Admin</span>
                <p className="text-sm text-darcare-beige/60">Send a message to our team</p>
              </div>
            </div>
            
            <Separator className="bg-darcare-gold/10" />
            
            <div className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => {}}>
              <PhoneCall className="h-5 w-5 text-darcare-gold" />
              <div className="flex-1">
                <span className="text-darcare-beige">Call Concierge</span>
                <p className="text-sm text-darcare-beige/60">24/7 Support: +212 555 123 456</p>
              </div>
            </div>
            
            <Separator className="bg-darcare-gold/10" />
            
            <div className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => navigate('/chatbot')}>
              <HelpCircle className="h-5 w-5 text-darcare-gold" />
              <div className="flex-1">
                <span className="text-darcare-beige">Ask Chatbot</span>
                <p className="text-sm text-darcare-beige/60">Get instant answers to common questions</p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-darcare-navy/50 border-darcare-gold/20">
          <h2 className="text-xl font-serif text-darcare-gold mb-4">Resources</h2>
          
          <div className="space-y-5">
            <div className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => {}}>
              <FileText className="h-5 w-5 text-darcare-gold" />
              <div className="flex-1">
                <span className="text-darcare-beige">FAQ</span>
                <p className="text-sm text-darcare-beige/60">Frequently asked questions</p>
              </div>
            </div>
            
            <Separator className="bg-darcare-gold/10" />
            
            <div className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => {}}>
              <FileText className="h-5 w-5 text-darcare-gold" />
              <div className="flex-1">
                <span className="text-darcare-beige">User Guide</span>
                <p className="text-sm text-darcare-beige/60">Learn how to use the app</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HelpSupportPage;
