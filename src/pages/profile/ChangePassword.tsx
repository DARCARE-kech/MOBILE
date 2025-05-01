
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import MainHeader from "@/components/MainHeader";
import { useTranslation } from "react-i18next";
import { Card } from '@/components/ui/card';
import { useUserProfile } from '@/hooks/useUserProfile';
import { PasswordForm, PasswordFormValues } from '@/components/profile/PasswordForm';
import { PasswordHeader } from '@/components/profile/PasswordHeader';

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { updatePassword } = useUserProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: PasswordFormValues) => {
    setIsSubmitting(true);
    try {
      await updatePassword(data.currentPassword, data.newPassword);
      // The useUserProfile hook will handle toast notifications and redirection
    } catch (error: any) {
      console.error("Error changing password:", error);
      // Errors are handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile/privacy');
  };

  return (
    <div className="min-h-screen bg-background">
      <MainHeader title={t('profile.changePassword')} onBack={() => navigate('/profile/privacy')} />
      
      <div className="pt-20 pb-24 px-4">
        <Card className="p-6 border-darcare-gold/20 bg-card">
          <PasswordHeader />
          <PasswordForm 
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </Card>
      </div>
    </div>
  );
};

export default ChangePassword;
