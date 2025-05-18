import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "@/hooks/use-toast";

interface AuthFooterProps {
  termsAgreed: boolean;
  setTermsAgreed: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthFooter: React.FC<AuthFooterProps> = ({ termsAgreed, setTermsAgreed }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/terms-and-policy');
  };

  return (
    <div className="mt-8 text-center">
      <div className="flex items-center justify-center gap-2">
        <Checkbox 
          id="terms-agreement" 
          checked={termsAgreed} 
          onCheckedChange={() => setTermsAgreed(prev => !prev)}
          className="border-darcare-gold/50 data-[state=checked]:bg-darcare-gold data-[state=checked]:text-darcare-navy"
        />
        <label 
          htmlFor="terms-agreement" 
          className="text-darcare-beige/70 text-sm cursor-pointer"
        >
          {t('auth.termsAgreement', 'I agree to the')} {' '}
          <button 
            onClick={handleTermsClick}
            className="text-darcare-gold hover:underline inline-block"
          >
            {t('auth.termsAndPolicy', 'Terms of Service and Privacy Policy')}
          </button>
        </label>
      </div>
    </div>
  );
};

export default AuthFooter;
