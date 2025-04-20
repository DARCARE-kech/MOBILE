
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useProfileData } from "./useProfileData";
import { useCurrentStay } from "./useCurrentStay";
import { useProfileMutations } from "./useProfileMutations";
import { useLanguage } from "@/contexts/LanguageContext";

export const useUserProfile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { changeLanguage } = useLanguage();
  
  const { data: profile, isLoading: isProfileLoading } = useProfileData(user?.id);
  const { data: currentStay, isLoading: isStayLoading } = useCurrentStay(user?.id);
  const { mutate: updateProfile } = useProfileMutations(user?.id);

  const handleProfileUpdate = (updates: any) => {
    // If language is being updated, also update the language context
    if (updates.language) {
      changeLanguage(updates.language);
    }
    
    updateProfile(updates);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return {
    profile,
    currentStay,
    isLoading: isProfileLoading || isStayLoading,
    updateProfile: handleProfileUpdate,
    handleLogout,
  };
};
