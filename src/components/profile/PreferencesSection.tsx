
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Globe, Moon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { PreferenceItem } from "./PreferenceItem";

interface PreferencesSectionProps {
  language: string;
  darkMode?: boolean;
  onUpdatePreference: (key: string, value: boolean | string) => void;
  className?: string;
}

export const PreferencesSection = ({
  language,
  darkMode = false,
  onUpdatePreference,
  className,
}: PreferencesSectionProps) => {
  const { t } = useTranslation();
  const { changeLanguage } = useLanguage();

  const handleLanguageChange = async (value: string) => {
    // Update the preference in the parent component
    onUpdatePreference('language', value);
    
    // Also update the language context
    await changeLanguage(value);
  };

  const handleDarkModeChange = (checked: boolean) => {
    onUpdatePreference('dark_mode', checked);
  };

  return (
    <Card className={`p-4 shadow-sm bg-card border-darcare-gold/20 ${className}`}>
      <h3 className="text-base font-serif mb-3 text-darcare-gold">{t('profile.preferences')}</h3>
      <div className="space-y-4">
        <PreferenceItem
          icon={<Globe className="h-5 w-5 text-darcare-gold" />}
          label={t('profile.language')}
          control={
            <Select
              value={language}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="w-[140px] bg-darcare-navy/50 border-darcare-gold/20 rounded-full">
                <SelectValue placeholder={t('common.select')} />
              </SelectTrigger>
              <SelectContent className="bg-darcare-navy border-darcare-gold/20">
                <SelectItem value="en" className="focus:bg-darcare-gold/20 focus:text-white">{t('languages.en')}</SelectItem>
                <SelectItem value="fr" className="focus:bg-darcare-gold/20 focus:text-white">{t('languages.fr')}</SelectItem>
                <SelectItem value="ar" className="focus:bg-darcare-gold/20 focus:text-white">{t('languages.ar')}</SelectItem>
              </SelectContent>
            </Select>
          }
        />
        
       
      </div>
    </Card>
  );
};
