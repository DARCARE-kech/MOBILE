
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

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
  const { setTheme } = useTheme();

  const handleDarkModeChange = (checked: boolean) => {
    // Update both the profile preference and the theme context
    onUpdatePreference('dark_mode', checked);
    setTheme(checked);
  };

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
          <Moon className="h-4 w-4 text-secondary" />
          <Label htmlFor="dark-mode" className="text-foreground">{t('profile.darkMode')}</Label>
        </div>
        <Switch
          id="dark-mode"
          checked={darkMode}
          onCheckedChange={handleDarkModeChange}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-secondary" />
          <Label htmlFor="language" className="text-foreground">{t('profile.language')}</Label>
        </div>
        <Select
          value={language}
          onValueChange={handleLanguageChange}
        >
          <SelectTrigger className="w-[140px] bg-background/50 border-border">
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
