
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
  
  const { mutate: updateProfile } = useProfileMutations(user?.id);

  const handleProfileUpdate = (updates: any) => {
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
    error: profileError || stayError,
    updateProfile: handleProfileUpdate,
    handleLogout,
  };
};
