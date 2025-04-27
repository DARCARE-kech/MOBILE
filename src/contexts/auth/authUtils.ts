
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      toast({
        title: "Profile Error",
        description: "User profile not found",
        variant: "destructive",
      });
      await supabase.auth.signOut();
      return null;
    }

    if (data.role !== "tenant") {
      toast({
        title: "Access Restricted",
        description: "This application is only for tenants",
        variant: "destructive",
      });
      await supabase.auth.signOut();
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    toast({
      title: "Error",
      description: "Failed to load user profile",
      variant: "destructive",
    });
    return null;
  }
};
