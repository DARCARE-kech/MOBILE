
import React from 'react';
import { Shield, HelpCircle, Info, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUserProfile } from '@/hooks/useUserProfile';
import MainHeader from '@/components/MainHeader';
import { UserInfoBlock } from '@/components/profile/UserInfoBlock';
import { PreferencesSection } from '@/components/profile/PreferencesSection';
import BottomNavigation from '@/components/BottomNavigation';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProfilePage: React.FC = () => {
  const { profile, currentStay, isLoading, updateProfile, handleLogout } = useUserProfile();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handlePreferenceUpdate = (key: string, value: boolean | string) => {
    updateProfile({ [key]: value });
  };

  const handleViewStayDetails = () => {
    if (currentStay) {
      navigate(`/stays/details`);
    }
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-darcare-navy" />;
  }

  return (
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader showDrawer title={t('profile.personalInfo')} />
      
      <div className="pt-16 pb-24">
        <div className="p-4 space-y-6">
          {/* User Info Section */}
          <UserInfoBlock
            fullName={profile?.full_name || ''}
            email={profile?.email}
            avatarUrl={profile?.avatar_url}
            villaNumber={currentStay?.villa_number}
            checkIn={currentStay?.check_in}
            checkOut={currentStay?.check_out}
            onViewStay={handleViewStayDetails}
            onEditProfile={handleEditProfile}
          />

          {/* Preferences Section */}
          <div className="luxury-card">
            <h3 className="text-lg font-serif text-darcare-gold mb-4">{t('profile.preferences')}</h3>
            <PreferencesSection
              darkMode={profile?.dark_mode || false}
              language={profile?.language || 'en'}
              onUpdatePreference={handlePreferenceUpdate}
            />
          </div>

          {/* Links Section */}
          <div className="luxury-card">
            <div 
              className="flex items-center justify-between gap-3 py-3 cursor-pointer" 
              onClick={() => navigate('/profile/privacy')}
            >
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-darcare-gold" />
                <span className="text-darcare-beige">{t('profile.privacySecurity')}</span>
              </div>
            </div>
            <Separator className="my-2 bg-darcare-gold/10" />
            <div 
              className="flex items-center justify-between gap-3 py-3 cursor-pointer" 
              onClick={() => navigate('/profile/change-password')}
            >
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-darcare-gold" />
                <span className="text-darcare-beige">{t('profile.changePassword')}</span>
              </div>
            </div>
            <Separator className="my-2 bg-darcare-gold/10" />
            <div 
              className="flex items-center justify-between gap-3 py-3 cursor-pointer" 
              onClick={() => navigate('/profile/help')}
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-darcare-gold" />
                <span className="text-darcare-beige">{t('profile.helpSupport')}</span>
              </div>
            </div>
            <Separator className="my-2 bg-darcare-gold/10" />
            <div 
              className="flex items-center justify-between gap-3 py-3 cursor-pointer" 
              onClick={() => navigate('/profile/about')}
            >
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-darcare-gold" />
                <span className="text-darcare-beige">{t('profile.about')}</span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            className="w-full border border-darcare-gold/20 text-darcare-gold hover:bg-darcare-gold/10 mt-6"
            onClick={handleLogout}
          >
            {t('common.logout')}
          </Button>
        </div>
      </div>

      <BottomNavigation activeTab="profile" />
    </div>
  );
};

export default ProfilePage;
