
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const TermsAndPolicy: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  return (
    <div className={cn(
      "min-h-screen px-4 py-6",
      isDarkMode 
        ? "bg-darcare-navy bg-gradient-to-b from-darcare-navy to-[#1A1F2C]"
        : "bg-background bg-gradient-to-b from-[#F8F4F0] to-white"
    )}>
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 flex items-center"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={18} />
          <span>{t('common.back')}</span>
        </Button>
        
        <div className={cn(
          "luxury-card p-6 shadow-xl rounded-2xl border backdrop-blur",
          isDarkMode 
            ? "border-darcare-gold/20 bg-darcare-navy/80" 
            : "border-secondary/20 bg-white/90"
        )}>
          <h1 className={cn(
            "font-serif text-2xl mb-6 tracking-wide text-center",
            isDarkMode ? "text-darcare-gold" : "text-primary"
          )}>
            {t('auth.termsAndPolicy', 'Terms of Service and Privacy Policy')}
          </h1>
          
          <div className={cn(
            "prose max-w-none",
            isDarkMode ? "prose-invert prose-headings:text-darcare-gold prose-a:text-darcare-gold" : ""
          )}>
            <h2>{t('auth.termsOfService', 'Terms of Service')}</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, 
              nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Nullam euismod, nisl eget aliquam ultricies, 
              nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.
            </p>
            <p>
              Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. 
              Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.
            </p>
            
            <h2>{t('auth.privacyPolicy', 'Privacy Policy')}</h2>
            <p>
              Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. 
              Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.
            </p>
            <p>
              Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. 
              Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.
            </p>
          </div>
          
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => navigate(-1)}
              className="bg-gradient-to-r from-darcare-gold to-[#D4AF37] text-darcare-navy hover:from-[#D4AF37] hover:to-darcare-gold"
            >
              {t('common.back')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPolicy;
