
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Key, Shield } from 'lucide-react';
import MainHeader from '@/components/MainHeader';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const PrivacySecurityPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <MainHeader title={t('profile.privacySecurity')} onBack={() => navigate('/profile')} />
      
      <div className="pt-20 pb-24 px-4">
        <Card className={cn(
          "p-6 mb-6",
          isDarkMode 
            ? "bg-card/50 border-darcare-gold/20" 
            : "bg-white border-secondary/20"
        )}>
          <h2 className={cn(
            "text-xl font-serif mb-4",
            isDarkMode ? "text-darcare-gold" : "text-primary"
          )}>{t('profile.accountSecurity')}</h2>
          
          <div className="space-y-5">
            <div className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => navigate('/profile/change-password')}>
              <Key className={cn(
                "h-5 w-5",
                isDarkMode ? "text-darcare-gold" : "text-secondary"
              )} />
              <div className="flex-1">
                <span className="text-foreground">{t('profile.changePassword')}</span>
                <p className="text-sm text-foreground/60">{t('profile.lastChanged', { days: 30 })}</p>
              </div>
            </div>
            
            <Separator className={isDarkMode ? "bg-primary/10" : "bg-secondary/10"} />
            
            <div className="flex items-center justify-between gap-3 py-2">
              <div className="flex items-center gap-3">
                <Shield className={cn(
                  "h-5 w-5",
                  isDarkMode ? "text-darcare-gold" : "text-secondary"
                )} />
                <div>
                  <span className="text-foreground">{t('profile.twoFactorAuth')}</span>
                  <p className="text-sm text-foreground/60">{t('profile.addExtraSecurity')}</p>
                </div>
              </div>
              <Switch id="2fa" />
            </div>
          </div>
        </Card>
        
        <Card className={cn(
          "p-6",
          isDarkMode 
            ? "bg-card/50 border-darcare-gold/20" 
            : "bg-white border-secondary/20"
        )}>
          <h2 className={cn(
            "text-xl font-serif mb-4",
            isDarkMode ? "text-darcare-gold" : "text-primary"
          )}>{t('profile.privacy')}</h2>
          
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3 py-2">
              <div className="flex items-center gap-3">
                <Lock className={cn(
                  "h-5 w-5",
                  isDarkMode ? "text-darcare-gold" : "text-secondary"
                )} />
                <div>
                  <span className="text-foreground">{t('profile.dataPrivacy')}</span>
                  <p className="text-sm text-foreground/60">{t('profile.controlDataUsage')}</p>
                </div>
              </div>
            </div>
            
            <Separator className={isDarkMode ? "bg-primary/10" : "bg-secondary/10"} />
            
            <div className="flex items-center justify-between gap-3 py-2 cursor-pointer" onClick={() => {}}>
              <div className="flex items-center gap-3">
                <Shield className={cn(
                  "h-5 w-5",
                  isDarkMode ? "text-darcare-gold" : "text-secondary"
                )} />
                <div className="flex-1">
                  <span className="text-foreground">{t('profile.privacyPolicy')}</span>
                  <p className="text-sm text-foreground/60">{t('profile.viewPrivacyPolicy')}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrivacySecurityPage;
