
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
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

export const useProfileData = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('No user logged in');
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!userId,
  });
};
