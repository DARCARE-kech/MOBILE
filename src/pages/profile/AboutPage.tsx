
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, FileText, Heart } from 'lucide-react';
import MainHeader from '@/components/MainHeader';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Logo from '@/components/Logo';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div className={cn(
      "min-h-screen",
      isDarkMode ? "bg-darcare-navy" : "bg-background"
    )}>
      <MainHeader title="About" onBack={() => navigate('/profile')} />
      
      <div className="pt-20 pb-24 px-4">
        <div className="flex flex-col items-center mb-8">
          <Logo size="md" color={isDarkMode ? "gold" : "navy"} />
          <p className={cn(
            "mt-2",
            isDarkMode ? "text-darcare-beige" : "text-foreground/70"
          )}>Version 1.0.0</p>
        </div>
        
        <Card className={cn(
          "p-6 mb-6",
          isDarkMode 
            ? "bg-darcare-navy/50 border-darcare-gold/20" 
            : "bg-white border-secondary/20"
        )}>
          <h2 className={cn(
            "text-xl font-serif mb-4",
            isDarkMode ? "text-darcare-gold" : "text-primary"
          )}>About DarCare</h2>
          <p className={cn(
            "leading-relaxed",
            isDarkMode ? "text-darcare-beige" : "text-foreground"
          )}>
            DarCare is a luxury villa management app that provides a seamless experience for guests staying in our exclusive properties. 
            Manage your stay, request services, explore local attractions, and connect with our staff - all from one elegant application.
          </p>
        </Card>
        
        <Card className={cn(
          "p-6 mb-6",
          isDarkMode 
            ? "bg-darcare-navy/50 border-darcare-gold/20" 
            : "bg-white border-secondary/20"
        )}>
          <h2 className={cn(
            "text-xl font-serif mb-4",
            isDarkMode ? "text-darcare-gold" : "text-primary"
          )}>Legal</h2>
          
          <div className="space-y-5">
            <div className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => {}}>
              <FileText className={cn(
                "h-5 w-5",
                isDarkMode ? "text-darcare-gold" : "text-secondary"
              )} />
              <div className="flex-1">
                <span className={cn(
                  isDarkMode ? "text-darcare-beige" : "text-foreground"
                )}>Terms of Service</span>
              </div>
            </div>
            
            <Separator className={cn(
              isDarkMode ? "bg-darcare-gold/10" : "bg-secondary/10"
            )} />
            
            <div className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => {}}>
              <FileText className={cn(
                "h-5 w-5",
                isDarkMode ? "text-darcare-gold" : "text-secondary"
              )} />
              <div className="flex-1">
                <span className={cn(
                  isDarkMode ? "text-darcare-beige" : "text-foreground"
                )}>Privacy Policy</span>
              </div>
            </div>
            
            <Separator className={cn(
              isDarkMode ? "bg-darcare-gold/10" : "bg-secondary/10"
            )} />
            
            <div className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => {}}>
              <Info className={cn(
                "h-5 w-5",
                isDarkMode ? "text-darcare-gold" : "text-secondary"
              )} />
              <div className="flex-1">
                <span className={cn(
                  isDarkMode ? "text-darcare-beige" : "text-foreground"
                )}>Licenses</span>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="flex justify-center items-center mt-8 text-center text-sm">
          <Heart className={cn(
            "h-4 w-4 mr-1",
            isDarkMode ? "text-darcare-gold/50" : "text-secondary/50"
          )} /> 
          <span className={cn(
            isDarkMode ? "text-darcare-beige/50" : "text-foreground/50"
          )}>Made with care by DarCare Team © 2025</span>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
