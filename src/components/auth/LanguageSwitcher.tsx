
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const languages = [
    { code: "en", name: t("languages.en", "English") },
    { code: "fr", name: t("languages.fr", "French") },
    { code: "ar", name: t("languages.ar", "Arabic") }
  ];

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Globe size={16} className="text-darcare-gold/70" />
      <div className="flex gap-1">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant="ghost"
            size="sm"
            className={cn(
              "px-2 py-1 text-xs",
              currentLanguage === lang.code
                ? "bg-darcare-gold/10 text-darcare-gold font-medium"
                : "text-darcare-beige/50 hover:text-darcare-gold hover:bg-darcare-gold/5"
            )}
            onClick={() => changeLanguage(lang.code)}
          >
            {lang.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
