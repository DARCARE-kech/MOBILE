
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";

interface PreferencesSectionProps {
  darkMode: boolean;
  language: string;
  onUpdatePreference: (key: string, value: boolean | string) => void;
}

export const PreferencesSection = ({
  darkMode,
  language,
  onUpdatePreference,
}: PreferencesSectionProps) => {
  const { t } = useTranslation();
  const { changeLanguage } = useLanguage();

  const handleLanguageChange = async (value: string) => {
    // Update the preference in the parent component
    onUpdatePreference('language', value);
    
    // Also update the language context
    await changeLanguage(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 text-darcare-gold" />
          <Label htmlFor="dark-mode" className="text-darcare-beige">{t('profile.darkMode')}</Label>
        </div>
        <Switch
          id="dark-mode"
          checked={darkMode}
          onCheckedChange={(checked) => onUpdatePreference('dark_mode', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-darcare-gold" />
          <Label htmlFor="language" className="text-darcare-beige">{t('profile.language')}</Label>
        </div>
        <Select
          value={language}
          onValueChange={handleLanguageChange}
        >
          <SelectTrigger className="w-[140px] bg-darcare-navy/50 border-darcare-gold/20">
            <SelectValue placeholder={t('common.select')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">{t('languages.en')}</SelectItem>
            <SelectItem value="fr">{t('languages.fr')}</SelectItem>
            <SelectItem value="ar">{t('languages.ar')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
