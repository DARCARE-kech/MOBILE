
import { Session, User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  full_name: string;
  role: string;
  avatar_url: string | null;
  created_at: string;
  phone_number?: string | null;
  whatsapp_number?: string | null;
  email: string | null;
  language: string | null;
  dark_mode: boolean | null;
}

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  signUp: (email: string, password: string, fullName: string) => Promise<{
    success: boolean;
    data: any;
  }>;
  signIn: (email: string, password: string) => Promise<{
    success: boolean;
    data: any;
  }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}
