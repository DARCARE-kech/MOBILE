
import React from 'react';
import { Shield, HelpCircle, Info, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUserProfile } from '@/hooks/useUserProfile';
import AppHeader from '@/components/AppHeader';
import { UserInfoBlock } from '@/components/profile/UserInfoBlock';
import { PreferencesSection } from '@/components/profile/PreferencesSection';
import BottomNavigation from '@/components/BottomNavigation';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const ProfilePage: React.FC = () => {
  const { profile, currentStay, isLoading, updateProfile, handleLogout } = useUserProfile();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

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
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title={t('profile.personalInfo')} />
      
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
            <h3 className={cn(
              "text-lg font-serif mb-4",
              isDarkMode ? "text-darcare-gold" : "text-primary"
            )}>{t('profile.preferences')}</h3>
            <PreferencesSection
              darkMode={profile?.dark_mode !== undefined ? profile.dark_mode : isDarkMode}
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
                <Shield className={cn(
                  "h-5 w-5",
                  isDarkMode ? "text-darcare-gold" : "text-secondary"
                )} />
                <span className="text-foreground">{t('profile.privacySecurity')}</span>
              </div>
            </div>
            <Separator className={cn(
              "my-2",
              isDarkMode ? "bg-darcare-gold/10" : "bg-secondary/10"
            )} />
            <div 
              className="flex items-center justify-between gap-3 py-3 cursor-pointer" 
              onClick={() => navigate('/profile/change-password')}
            >
              <div className="flex items-center gap-3">
                <Key className={cn(
                  "h-5 w-5",
                  isDarkMode ? "text-darcare-gold" : "text-secondary"
                )} />
                <span className="text-foreground">{t('profile.changePassword')}</span>
              </div>
            </div>
            <Separator className={cn(
              "my-2",
              isDarkMode ? "bg-darcare-gold/10" : "bg-secondary/10"
            )} />
            <div 
              className="flex items-center justify-between gap-3 py-3 cursor-pointer" 
              onClick={() => navigate('/profile/help')}
            >
              <div className="flex items-center gap-3">
                <HelpCircle className={cn(
                  "h-5 w-5",
                  isDarkMode ? "text-darcare-gold" : "text-secondary"
                )} />
                <span className="text-foreground">{t('profile.helpSupport')}</span>
              </div>
            </div>
            <Separator className={cn(
              "my-2",
              isDarkMode ? "bg-darcare-gold/10" : "bg-secondary/10"
            )} />
            <div 
              className="flex items-center justify-between gap-3 py-3 cursor-pointer" 
              onClick={() => navigate('/profile/about')}
            >
              <div className="flex items-center gap-3">
                <Info className={cn(
                  "h-5 w-5",
                  isDarkMode ? "text-darcare-gold" : "text-secondary"
                )} />
                <span className="text-foreground">{t('profile.about')}</span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            className={cn(
              "w-full border text-primary hover:bg-primary/10 mt-6",
              isDarkMode 
                ? "border-darcare-gold/20" 
                : "border-secondary/20"
            )}
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
