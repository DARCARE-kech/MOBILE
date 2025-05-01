
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";

interface PreferencesSectionProps {
  language: string;
  onUpdatePreference: (key: string, value: boolean | string) => void;
}

export const PreferencesSection = ({
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
    <Card className="p-6 shadow-sm bg-card border-darcare-gold/20">
      <h3 className="text-lg font-serif mb-4 text-darcare-gold">{t('profile.preferences')}</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-darcare-gold" />
            <Label htmlFor="language" className="text-foreground">{t('profile.language')}</Label>
          </div>
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
        </div>
      </div>
    </Card>
  );
};
