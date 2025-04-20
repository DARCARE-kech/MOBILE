
import React from 'react';
import { Shield, HelpCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUserProfile } from '@/hooks/useUserProfile';
import MainHeader from '@/components/MainHeader';
import { UserInfoBlock } from '@/components/profile/UserInfoBlock';
import { PreferencesSection } from '@/components/profile/PreferencesSection';
import BottomNavigation from '@/components/BottomNavigation';

const ProfilePage: React.FC = () => {
  const { profile, currentStay, isLoading, updateProfile, handleLogout } = useUserProfile();

  const handlePreferenceUpdate = (key: string, value: boolean | string) => {
    updateProfile.mutate({ [key]: value });
  };

  if (isLoading) {
    return <div className="min-h-screen bg-darcare-navy" />;
  }

  return (
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader showDrawer title="Profile" />
      
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
          />

          {/* Preferences Section */}
          <div className="luxury-card">
            <h3 className="text-lg font-serif text-darcare-gold mb-4">Preferences</h3>
            <PreferencesSection
              darkMode={profile?.dark_mode || false}
              language={profile?.language || 'en'}
              notificationsEnabled={profile?.notifications_enabled || false}
              onUpdatePreference={handlePreferenceUpdate}
            />
          </div>

          {/* Links Section */}
          <div className="luxury-card">
            <div className="flex items-center gap-3 py-2">
              <Shield className="h-5 w-5 text-darcare-gold" />
              <span className="text-darcare-beige">Privacy & Security</span>
            </div>
            <Separator className="my-2 bg-darcare-gold/10" />
            <div className="flex items-center gap-3 py-2">
              <HelpCircle className="h-5 w-5 text-darcare-gold" />
              <span className="text-darcare-beige">Help & Support</span>
            </div>
            <Separator className="my-2 bg-darcare-gold/10" />
            <div className="flex items-center gap-3 py-2">
              <Info className="h-5 w-5 text-darcare-gold" />
              <span className="text-darcare-beige">About</span>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            className="w-full border border-darcare-gold/20 text-darcare-gold hover:bg-darcare-gold/10"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>

      <BottomNavigation activeTab="profile" />
    </div>
  );
};

export default ProfilePage;
