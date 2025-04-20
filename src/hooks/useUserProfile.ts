
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useProfileData } from "./useProfileData";
import { useCurrentStay } from "./useCurrentStay";
import { useProfileMutations } from "./useProfileMutations";

export const useUserProfile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const { data: profile, isLoading: isProfileLoading } = useProfileData(user?.id);
  const { data: currentStay, isLoading: isStayLoading } = useCurrentStay(user?.id);
  const updateProfileMutation = useProfileMutations(user?.id);

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
    updateProfile: updateProfileMutation.mutate,
    handleLogout,
  };
};
