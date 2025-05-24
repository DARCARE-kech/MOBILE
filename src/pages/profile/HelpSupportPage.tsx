
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, PhoneCall, MessageSquare, FileText } from 'lucide-react';
import MainHeader from '@/components/MainHeader';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const HelpSupportPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div className={cn(
      "min-h-screen",
      isDarkMode ? "bg-darcare-navy" : "bg-background"
    )}>
      <MainHeader title="Help Center" showBack={true} onBack={() => navigate('/profile')} />
      
      <div className="pt-20 pb-24 px-4">
        <Card className={cn(
          "p-6 mb-6",
          isDarkMode 
            ? "bg-darcare-navy/50 border-darcare-gold/20" 
            : "bg-white border-secondary/20"
        )}>
          <h2 className={cn(
            "text-xl font-serif mb-4",
            isDarkMode ? "text-darcare-gold" : "text-primary"
          )}>Need Assistance?</h2>
          
          <div className="space-y-5">
            <div className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => navigate('/contact-admin')}>
              <MessageSquare className={cn(
                "h-5 w-5",
                isDarkMode ? "text-darcare-gold" : "text-secondary"
              )} />
              <div className="flex-1">
                <span className={isDarkMode ? "text-darcare-beige" : "text-foreground"}>Contact Admin</span>
                <p className={cn(
                  "text-sm",
                  isDarkMode ? "text-darcare-beige/60" : "text-foreground/60"
                )}>Send a message to our team</p>
              </div>
            </div>
            
            <Separator className={isDarkMode ? "bg-darcare-gold/10" : "bg-secondary/10"} />
            
            <div className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => {}}>
              <PhoneCall className={cn(
                "h-5 w-5",
                isDarkMode ? "text-darcare-gold" : "text-secondary"
              )} />
              <div className="flex-1">
                <span className={isDarkMode ? "text-darcare-beige" : "text-foreground"}>Call Concierge</span>
                <p className={cn(
                  "text-sm",
                  isDarkMode ? "text-darcare-beige/60" : "text-foreground/60"
                )}>24/7 Support: +212 555 123 456</p>
              </div>
            </div>
            
            <Separator className={isDarkMode ? "bg-darcare-gold/10" : "bg-secondary/10"} />
            
            <div className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => navigate('/chatbot')}>
              <HelpCircle className={cn(
                "h-5 w-5",
                isDarkMode ? "text-darcare-gold" : "text-secondary"
              )} />
              <div className="flex-1">
                <span className={isDarkMode ? "text-darcare-beige" : "text-foreground"}>Ask Chatbot</span>
                <p className={cn(
                  "text-sm",
                  isDarkMode ? "text-darcare-beige/60" : "text-foreground/60"
                )}>Get instant answers to common questions</p>
              </div>
            </div>
          </div>
        </Card>
        
      </div>
    </div>
  );
};

export default HelpSupportPage;
