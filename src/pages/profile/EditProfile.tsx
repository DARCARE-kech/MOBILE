
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";
import MainHeader from "@/components/MainHeader";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { ProfileForm, ProfileFormValues } from '@/components/profile/ProfileForm';
import { ProfileHeader } from '@/components/profile/ProfileHeader';

const EditProfile: React.FC = () => {
  const { profile, updateProfile } = useUserProfile();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ProfileFormValues, countryCode: string) => {
    setIsSubmitting(true);
    try {
      // Combine country code with phone number
      const fullPhoneNumber = data.phone_number ? `${countryCode}${data.phone_number}` : null;
      
      // Update profile with all data including email
      // The updateProfile hook will handle email confirmation if needed
      await updateProfile({
        full_name: data.full_name,
        email: data.email, // This will be handled by the hook
        phone_number: fullPhoneNumber,
        whatsapp_number: data.whatsapp_number,
      });
      
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-background">
      <MainHeader title={t('profile.editProfile')} onBack={() => navigate('/profile')} />
      
      <div className="pt-20 pb-24 px-4">
        <Card className="p-6 mb-6 border-darcare-gold/20 bg-card">
          <ProfileHeader avatarUrl={profile?.avatar_url} fullName={profile?.full_name} />
          <ProfileForm 
            profile={profile} 
            onSubmit={handleSubmit} 
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;
