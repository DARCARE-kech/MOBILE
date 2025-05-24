
import React from 'react';
import { Shield, HelpCircle,Key , Info, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUserProfile } from '@/hooks/useUserProfile';
import AppHeader from '@/components/AppHeader';
import { UserInfoBlock } from '@/components/profile/UserInfoBlock';
import { PreferencesSection } from '@/components/profile/PreferencesSection';
import BottomNavigation from '@/components/BottomNavigation';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ProfilePage: React.FC = () => {
  const { profile, currentStay, isLoading, updateProfile, handleLogout } = useUserProfile();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);

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

  const confirmLogout = () => {
    setShowLogoutDialog(false);
    handleLogout();
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        title={t('profile.profile')} 
      />
      
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
          <PreferencesSection
            language={profile?.language || 'en'}
            onUpdatePreference={handlePreferenceUpdate}
          />

          {/* Links Section */}
          <Card className="p-6 bg-card border-darcare-gold/20 shadow-sm">
            <h3 className="text-lg font-serif mb-4 text-darcare-gold">{t('profile.accountSettings')}</h3>
            
          
            <div 
              className="flex items-center justify-between gap-3 py-3 cursor-pointer group" 
              onClick={() => navigate('/profile/change-password')}
            >
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-darcare-gold" />
                <div className="flex-1">
                  <span className="text-foreground group-hover:text-darcare-gold transition-colors">{t('profile.changePassword')}</span>
                 
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-darcare-gold/70" />
            </div>
            <Separator className="my-2 bg-darcare-gold/10" />
            
            <div 
              className="flex items-center justify-between gap-3 py-3 cursor-pointer group" 
              onClick={() => navigate('/profile/help')}
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-darcare-gold" />
                <span className="text-foreground group-hover:text-darcare-gold transition-colors">{t('profile.helpSupport')}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-darcare-gold/70" />
            </div>
            <Separator className="my-2 bg-darcare-gold/10" />
            
            <div 
              className="flex items-center justify-between gap-3 py-3 cursor-pointer group" 
              onClick={() => navigate('/profile/about')}
            >
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-darcare-gold" />
                <span className="text-foreground group-hover:text-darcare-gold transition-colors">{t('profile.about')}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-darcare-gold/70" />
            </div>
          </Card>

          {/* Logout Button */}
          <Card className="p-2 border-darcare-gold/20 bg-card shadow-sm">
            <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full flex justify-between text-darcare-beige hover:text-darcare-red hover:bg-darcare-red/10 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <LogOut className="h-5 w-5" />
                    <span>{t('common.logout')}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-70" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-darcare-navy border-darcare-gold/20">
                <DialogHeader>
                  <DialogTitle className="text-darcare-gold font-serif">{t('common.confirmLogout')}</DialogTitle>
                  <DialogDescription className="text-darcare-beige/70">
                    {t('common.logoutConfirmation')}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex space-x-2 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowLogoutDialog(false)}
                    className="border-darcare-gold/20 text-darcare-beige hover:bg-darcare-gold/10"
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={confirmLogout}
                    className="bg-darcare-red hover:bg-darcare-red/90 text-white"
                  >
                    {t('common.logout')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Card>
        </div>
      </div>

      <BottomNavigation activeTab="profile" />
    </div>
  );
};

export default ProfilePage;
