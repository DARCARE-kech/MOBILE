
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
  phone_number: string | null;
  whatsapp_number: string | null;
  role?: string;
  created_at?: string;
}

export const useProfileData = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('No user logged in');
      
      // Fetch user email from auth.users
      const { data: authUserData, error: authError } = await supabase.auth.getUser();
      
      // Fetch user profile data
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      // Properly map database fields to UserProfile interface
      const profile: UserProfile = {
        id: data.id,
        full_name: data.full_name,
        email: authUserData?.user?.email || null,
        avatar_url: data.avatar_url,
        language: data.language,
        dark_mode: data.dark_mode,
        notifications_enabled: data.notifications_enabled,
        terms_accepted: data.terms_accepted,
        terms_accepted_at: data.terms_accepted_at,
        // Map phone to phone_number if it exists in the data
        phone_number: data.phone_number || data.phone || null,
        whatsapp_number: data.whatsapp_number || null,
        role: data.role,
        created_at: data.created_at
      };

      return profile;
    },
    enabled: !!userId
  });
};
