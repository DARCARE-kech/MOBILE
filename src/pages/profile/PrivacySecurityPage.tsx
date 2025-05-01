
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Key, Shield, ChevronRight } from 'lucide-react';
import MainHeader from '@/components/MainHeader';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';

const PrivacySecurityPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <MainHeader title={t('profile.privacySecurity')} onBack={() => navigate('/profile')} />
      
      <div className="pt-20 pb-24 px-4">
        <Card className="p-6 mb-6 bg-card border-darcare-gold/20 shadow-sm">
          <h2 className="text-xl font-serif mb-4 text-darcare-gold">{t('profile.accountSecurity')}</h2>
          
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3 py-2 cursor-pointer group" onClick={() => navigate('/profile/change-password')}>
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-darcare-gold" />
                <div className="flex-1">
                  <span className="text-foreground group-hover:text-darcare-gold transition-colors">{t('profile.changePassword')}</span>
                  <p className="text-sm text-foreground/60">{t('profile.lastChanged', { days: 30 })}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-darcare-gold/70" />
            </div>
            
            <Separator className="bg-darcare-gold/10" />
            
            <div className="flex items-center justify-between gap-3 py-2">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-darcare-gold" />
                <div>
                  <span className="text-foreground">{t('profile.twoFactorAuth')}</span>
                  <p className="text-sm text-foreground/60">{t('profile.addExtraSecurity')}</p>
                </div>
              </div>
              <Switch id="2fa" className="data-[state=checked]:bg-darcare-gold" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-card border-darcare-gold/20 shadow-sm">
          <h2 className="text-xl font-serif mb-4 text-darcare-gold">{t('profile.privacy')}</h2>
          
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3 py-2">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-darcare-gold" />
                <div>
                  <span className="text-foreground">{t('profile.dataPrivacy')}</span>
                  <p className="text-sm text-foreground/60">{t('profile.controlDataUsage')}</p>
                </div>
              </div>
              <Switch className="data-[state=checked]:bg-darcare-gold" />
            </div>
            
            <Separator className="bg-darcare-gold/10" />
            
            <div className="flex items-center justify-between gap-3 py-2 cursor-pointer group" onClick={() => {}}>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-darcare-gold" />
                <div className="flex-1">
                  <span className="text-foreground group-hover:text-darcare-gold transition-colors">{t('profile.privacyPolicy')}</span>
                  <p className="text-sm text-foreground/60">{t('profile.viewPrivacyPolicy')}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-darcare-gold/70" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrivacySecurityPage;
