
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";
import MainHeader from "@/components/MainHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";

const countryCodes = [
  { value: "+1", label: "United States (+1)" },
  { value: "+33", label: "France (+33)" },
  { value: "+44", label: "United Kingdom (+44)" },
  { value: "+212", label: "Morocco (+212)" },
  { value: "+971", label: "UAE (+971)" },
];

const profileFormSchema = z.object({
  full_name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone_number: z.string().optional(),
  country_code: z.string().optional(),
  whatsapp_number: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const EditProfile: React.FC = () => {
  const { profile, updateProfile } = useUserProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countryCode, setCountryCode] = useState("+212");

  // Extract phone number without country code if it exists
  const getPhoneWithoutCode = (phone: string | null) => {
    if (!phone) return "";
    for (const code of countryCodes) {
      if (phone.startsWith(code.value)) {
        return phone.substring(code.value.length);
      }
    }
    return phone;
  };

  // Extract country code from phone if it exists
  const extractCountryCode = (phone: string | null) => {
    if (!phone) return "+212";
    for (const code of countryCodes) {
      if (phone.startsWith(code.value)) {
        return code.value;
      }
    }
    return "+212";
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      email: profile?.email || "",
      phone_number: getPhoneWithoutCode(profile?.phone_number || ""),
      country_code: extractCountryCode(profile?.phone_number || ""),
      whatsapp_number: profile?.whatsapp_number || "",
    },
    mode: "onChange"
  });

  React.useEffect(() => {
    if (profile) {
      setCountryCode(extractCountryCode(profile.phone_number || ""));
      form.reset({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone_number: getPhoneWithoutCode(profile.phone_number || ""),
        country_code: extractCountryCode(profile.phone_number || ""),
        whatsapp_number: profile.whatsapp_number || "",
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      // Combine country code with phone number
      const fullPhoneNumber = data.phone_number ? `${countryCode}${data.phone_number}` : null;
      
      // Update profile with all data including email
      // The updateProfile hook will handle email confirmation if needed
      await updateProfile({
        full_name: data.full_name,
        email: data.email, // This will be handled by the hook
        phone_number: fullPhoneNumber,
        whatsapp_number: data.whatsapp_number,
      });
      
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainHeader title={t('profile.editProfile')} onBack={() => navigate('/profile')} />
      
      <div className="pt-20 pb-24 px-4">
        <Card className="p-6 mb-6 border-darcare-gold/20 bg-card">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="h-24 w-24 border-2 border-darcare-gold/20 mb-4 shadow-md">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="bg-darcare-gold/10">
                <UserRound className="h-12 w-12 text-darcare-gold/70" />
              </AvatarFallback>
            </Avatar>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-darcare-beige">{t('profile.fullName')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('profile.enterFullName')} 
                        {...field} 
                        className="bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-darcare-beige">{t('profile.email')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('profile.enterEmail')} 
                        {...field} 
                        className="bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-darcare-beige">{t('profile.phoneNumber')}</FormLabel>
                    <div className="flex space-x-2">
                      <Select 
                        value={countryCode} 
                        onValueChange={setCountryCode}
                      >
                        <SelectTrigger className="w-[120px] bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige">
                          <SelectValue placeholder={countryCode} />
                        </SelectTrigger>
                        <SelectContent className="bg-darcare-navy border-darcare-gold/20">
                          {countryCodes.map((code) => (
                            <SelectItem key={code.value} value={code.value} className="focus:bg-darcare-gold/20 focus:text-white">
                              {code.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormControl>
                        <Input 
                          placeholder={t('profile.enterPhoneNumber')} 
                          {...field} 
                          className="flex-1 bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="whatsapp_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-darcare-beige">{t('profile.whatsappNumber')} ({t('common.optional')})</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('profile.enterWhatsappNumber')} 
                        {...field} 
                        className="bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex gap-4 justify-end pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/profile')}
                  className="border-darcare-gold/20 text-darcare-beige hover:bg-darcare-gold/10"
                >
                  {t('common.cancel')}
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !form.formState.isDirty}
                  className="bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
                >
                  {t('common.save')}
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;
