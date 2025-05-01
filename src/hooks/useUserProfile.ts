
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useProfileData } from "./useProfileData";
import { useCurrentStay } from "./useCurrentStay";
import { useProfileMutations } from "./useProfileMutations";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";

export const useUserProfile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { changeLanguage } = useLanguage();
  
  const { 
    data: profile, 
    isLoading: isProfileLoading,
    error: profileError 
  } = useProfileData(user?.id);
  
  const { 
    data: currentStay, 
    isLoading: isStayLoading,
    error: stayError 
  } = useCurrentStay(user?.id);
  
  const { updateProfile, updateEmail, updatePassword } = useProfileMutations(user?.id);

  const handleProfileUpdate = (updates: any) => {
    // Handle email updates separately through the auth API
    if (updates.email && updates.email !== profile?.email) {
      updateEmail.mutate(updates.email);
      // Remove email from profile updates
      const { email, ...profileUpdates } = updates;
      
      // Update language if needed
      if (updates.language) {
        changeLanguage(updates.language);
      }
      
      // Only update other profile data if there's something to update
      if (Object.keys(profileUpdates).length > 0) {
        updateProfile.mutate(profileUpdates);
      }
    } else {
      // Just update profile data
      if (updates.language) {
        changeLanguage(updates.language);
      }
      updateProfile.mutate(updates);
    }
  };

  const handlePasswordUpdate = (currentPassword: string, newPassword: string) => {
    updatePassword.mutate({ currentPassword, newPassword }, {
      onSuccess: () => {
        // Navigate to profile page on successful password change
        navigate('/profile');
      }
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/auth');
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast({
        title: "Logout failed",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    }
  };

  return {
    profile,
    currentStay,
    isLoading: isProfileLoading || isStayLoading,
    error: profileError || stayError,
    updateProfile: handleProfileUpdate,
    updatePassword: handlePasswordUpdate,
    handleLogout,
    isUpdating: updateProfile.isPending
  };
};
