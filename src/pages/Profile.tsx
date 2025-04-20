
import React from 'react';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader showDrawer title="Profile" />
      <div className="pt-16 pb-24">
        <div className="p-4">
          <div className="luxury-card">
            <h2 className="text-xl font-serif text-darcare-gold mb-3">Your Profile</h2>
            <p className="text-darcare-beige">
              Manage your personal information, preferences, and settings.
            </p>
          </div>
        </div>
      </div>
      <BottomNavigation activeTab="profile" />
    </div>
  );
};

export default ProfilePage;
