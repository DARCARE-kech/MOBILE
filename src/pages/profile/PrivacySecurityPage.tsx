
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Key, Shield } from 'lucide-react';
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
        <Card className="p-6 bg-card/50 border-primary/20 mb-6">
          <h2 className="text-xl font-serif text-primary mb-4">{t('profile.accountSecurity')}</h2>
          
          <div className="space-y-5">
            <div className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => navigate('/profile/change-password')}>
              <Key className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <span className="text-foreground">{t('profile.changePassword')}</span>
                <p className="text-sm text-foreground/60">{t('profile.lastChanged', { days: 30 })}</p>
              </div>
            </div>
            
            <Separator className="bg-primary/10" />
            
            <div className="flex items-center justify-between gap-3 py-2">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <span className="text-foreground">{t('profile.twoFactorAuth')}</span>
                  <p className="text-sm text-foreground/60">{t('profile.addExtraSecurity')}</p>
                </div>
              </div>
              <Switch id="2fa" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-card/50 border-primary/20">
          <h2 className="text-xl font-serif text-primary mb-4">{t('profile.privacy')}</h2>
          
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3 py-2">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-primary" />
                <div>
                  <span className="text-foreground">{t('profile.dataPrivacy')}</span>
                  <p className="text-sm text-foreground/60">{t('profile.controlDataUsage')}</p>
                </div>
              </div>
            </div>
            
            <Separator className="bg-primary/10" />
            
            <div className="flex items-center justify-between gap-3 py-2 cursor-pointer" onClick={() => {}}>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
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
