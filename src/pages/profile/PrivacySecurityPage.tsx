
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Key, Shield, ChevronRight, Bell } from 'lucide-react';
import MainHeader from '@/components/MainHeader';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';
import { PreferenceItem } from '@/components/profile/PreferenceItem';
import { useUserProfile } from '@/hooks/useUserProfile';

const PrivacySecurityPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { profile, updateProfile } = useUserProfile();
  
  const [twoFactor, setTwoFactor] = useState(false);
  const [dataPrivacy, setDataPrivacy] = useState(profile?.notifications_enabled || false);

  const handleTwoFactorChange = (checked: boolean) => {
    setTwoFactor(checked);
    // Implement two-factor logic here
  };

  const handleDataPrivacyChange = async (checked: boolean) => {
    setDataPrivacy(checked);
    try {
      await updateProfile({
        notifications_enabled: checked
      });
    } catch (error) {
      console.error("Error updating notifications settings:", error);
      setDataPrivacy(!checked); // Revert UI state on error
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainHeader title={t('profile.privacy')} onBack={() => navigate('/profile')} />
      
      <div className="pt-20 pb-24 px-4">
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-serif text-darcare-gold mb-4">{t('auth.securityTitle')}</h2>
          
          <div className="space-y-4">
            <PreferenceItem
              icon={<Key className="text-darcare-gold" />}
              title={t('profile.changePassword')}
              onClick={() => navigate('/profile/change-password')}
              endContent={<ChevronRight size={18} className="text-darcare-beige/60" />}
            />
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-serif text-darcare-gold mb-4">{t('profile.preferences')}</h2>
          
          <div className="space-y-4">
            <PreferenceItem
              icon={<Shield className="text-darcare-gold" />}
              title={t('profile.twoFactorAuth')}
              description="Enhance your account security with 2FA"
              endContent={
                <Switch 
                  checked={twoFactor} 
                  onCheckedChange={handleTwoFactorChange}
                  disabled={true} // TODO: Implement two-factor
                />
              }
            />
            
            <Separator />
            
            <PreferenceItem
              icon={<Bell className="text-darcare-gold" />}
              title={t('profile.dataPrivacy')}
              description="Receive personalized recommendations and updates"
              endContent={
                <Switch 
                  checked={dataPrivacy}
                  onCheckedChange={handleDataPrivacyChange}
                />
              }
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrivacySecurityPage;
