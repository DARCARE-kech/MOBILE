
import { useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "./types";
import { useTranslation } from "react-i18next";

export const useAuthMethods = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const signUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      toast({
        title: t("auth.signupSuccess"),
        description: t("auth.signupEmailSent"),
        duration: 8000,
      });
      
      return { success: true, data };
    } catch (error: any) {
      console.error("Error signing up:", error);
      
      let errorMessage = t("auth.signupFailed");
      
      if (error.message.includes("User already registered")) {
        errorMessage = t("auth.emailAlreadyRegistered");
      } else if (error.message.includes("Password")) {
        errorMessage = error.message || t("auth.passwordRequirements");
      }
      
      toast({
        title: t("auth.signupFailed"),
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if this is the first login
      const isFirstLogin = data.user?.app_metadata?.provider === "email" && 
                          data.user.last_sign_in_at === data.user.created_at;
      
      toast({
        title: t("auth.welcomeBack"),
        description: isFirstLogin ? t("auth.welcomeFirstLogin") : t("auth.welcomeReturn"),
        variant: "success",
      });
      
      return { success: true, data };
    } catch (error: any) {
      console.error("Error signing in:", error);
      
      let errorCode = "";
      let errorMessage = t("auth.invalidCredentials");
      
      // Check for specific error conditions
      if (error.message.includes("Email not confirmed")) {
        errorCode = "email_not_confirmed";
        errorMessage = t("auth.emailNotVerified");
      } else if (error.message.includes("Invalid login credentials")) {
        errorCode = "invalid_credentials";
        errorMessage = t("auth.invalidCredentials"); 
      } else if (error.message.includes("rate limit")) {
        errorCode = "rate_limit";
        errorMessage = t("auth.rateLimitExceeded");
      }
      
      toast({
        title: t("auth.signInFailed"),
        description: errorMessage,
        duration: 6000,
        variant: "destructive",
      });
      
      throw { ...error, code: errorCode, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: t("auth.signOut"),
        description: t("auth.signOutSuccess"),
      });
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: t("common.error"),
        description: t("auth.signOutFailed"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: t("auth.passwordResetSent"),
        description: t("auth.checkEmail"),
        duration: 8000,
      });
      
      return true;
    } catch (error: any) {
      console.error("Error sending password reset:", error);
      toast({
        title: t("common.error"),
        description: error.message || t("auth.resetPasswordFailed"),
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    resetPassword,
    isLoading,
  };
};
