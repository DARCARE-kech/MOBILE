
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface UserProfile {
  id: string;
  full_name: string;
  email: string | null;
  avatar_url: string | null;
  language: string | null;
  dark_mode: boolean | null;
  notifications_enabled: boolean | null;
  terms_accepted: boolean | null;
  terms_accepted_at: string | null;
}

interface CurrentStay {
  villa_number: string;
  check_in: string;
  check_out: string;
  status: string;
}

export const useUserProfile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user logged in');
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!user?.id,
  });

  const { data: currentStay, isLoading: isStayLoading } = useQuery({
    queryKey: ['currentStay'],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user logged in');
      const { data, error } = await supabase
        .rpc('get_current_stay', { user_id: user.id });

      if (error) throw error;
      return data[0] as CurrentStay | null;
    },
    enabled: !!user?.id,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!user?.id) throw new Error('No user logged in');
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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
    updateProfile,
    handleLogout,
  };
};
