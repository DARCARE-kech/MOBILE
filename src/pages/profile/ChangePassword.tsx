
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import MainHeader from "@/components/MainHeader";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Lock } from "lucide-react";

const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: "Current password is required" }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Please confirm your new password" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordFormValues) => {
    setIsSubmitting(true);
    try {
      // First verify the current password by signing in
      const userResponse = await supabase.auth.getUser();
      const user = userResponse.data.user;
      
      if (!user || !user.email) {
        throw new Error("Unable to get current user email");
      }
      
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: data.currentPassword,
      });

      if (verifyError) {
        throw new Error("Current password is incorrect");
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      toast({
        title: t('profile.passwordUpdated'),
        description: t('profile.passwordUpdatedMessage'),
      });
      
      navigate("/profile");
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast({
        title: t('common.error'),
        description: error.message || t('profile.passwordChangeFailedMessage'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader title={t('profile.changePassword')} onBack={() => navigate('/profile/privacy')} />
      
      <div className="pt-20 pb-24 px-4">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-darcare-gold/10 flex items-center justify-center">
            <Lock className="h-8 w-8 text-darcare-gold" />
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-darcare-beige">{t('profile.currentPassword')}</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showCurrentPassword ? "text" : "password"} 
                        placeholder={t('profile.enterCurrentPassword')} 
                        {...field} 
                        className="bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige pr-10"
                      />
                    </FormControl>
                    <button 
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-darcare-gold/70"
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-darcare-beige">{t('profile.newPassword')}</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showNewPassword ? "text" : "password"} 
                        placeholder={t('profile.enterNewPassword')} 
                        {...field} 
                        className="bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige pr-10"
                      />
                    </FormControl>
                    <button 
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-darcare-gold/70"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-darcare-beige">{t('profile.confirmPassword')}</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder={t('profile.confirmNewPassword')} 
                        {...field} 
                        className="bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige pr-10"
                      />
                    </FormControl>
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-darcare-gold/70"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-4 justify-end pt-4 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/profile/privacy')}
                className="border-darcare-gold/20 text-darcare-beige hover:bg-darcare-gold/10"
              >
                {t('common.cancel')}
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
              >
                {t('common.update')}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
