
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";

const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: "Current password is required" }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Please confirm your new password" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type PasswordFormValues = z.infer<typeof passwordSchema>;

interface PasswordFormProps {
  onSubmit: (data: PasswordFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const PasswordForm = ({ onSubmit, onCancel, isSubmitting }: PasswordFormProps) => {
  const { t } = useTranslation();
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: PasswordFormValues) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
            onClick={onCancel}
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
  );
};
