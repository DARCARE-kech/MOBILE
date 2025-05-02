
import { useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "./types";

export const useAuthMethods = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
        title: "Account created successfully",
        description: "A confirmation email has been sent to your email address. Please check your inbox and confirm your email before signing in.",
        duration: 8000,
      });
      
      return { success: true, data };
    } catch (error: any) {
      console.error("Error signing up:", error);
      
      let errorMessage = "Failed to create account";
      
      if (error.message.includes("User already registered")) {
        errorMessage = "This email is already registered. Please sign in instead.";
      } else if (error.message.includes("Password")) {
        errorMessage = error.message || "Password doesn't meet requirements";
      }
      
      toast({
        title: "Sign-up failed",
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

      toast({
        title: "Welcome back!",
        description: "Successfully signed in",
      });
      
      return { success: true, data };
    } catch (error: any) {
      console.error("Error signing in:", error);
      
      let errorTitle = "Sign-in failed";
      let errorMessage = "Invalid email or password";
      
      // Check for specific error conditions
      if (error.message.includes("Email not confirmed")) {
        errorTitle = "Email not confirmed";
        errorMessage = "Please check your inbox and confirm your email before signing in";
      } else if (error.message.includes("Invalid login credentials")) {
        errorMessage = "The email or password you entered is incorrect";
      } else if (error.message.includes("rate limit")) {
        errorMessage = "Too many sign in attempts. Please try again later.";
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        duration: 6000,
        variant: "destructive",
      });
      throw error;
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
        title: "Signed out",
        description: "You have been successfully signed out",
      });
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out",
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
        title: "Password reset email sent",
        description: "Check your inbox for instructions to reset your password",
        duration: 8000,
      });
      
      return true;
    } catch (error: any) {
      console.error("Error sending password reset:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email",
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
