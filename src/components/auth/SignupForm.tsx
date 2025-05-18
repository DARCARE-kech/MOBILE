
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SignupFormProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  confirmPassword: string;  // New prop for confirm password
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>; // New setter
  nameError: string;
  emailError: string;
  passwordError: string;
  confirmPasswordError: string; // New error state
  setNameError: React.Dispatch<React.SetStateAction<string>>;
  setEmailError: React.Dispatch<React.SetStateAction<string>>;
  setPasswordError: React.Dispatch<React.SetStateAction<string>>;
  setConfirmPasswordError: React.Dispatch<React.SetStateAction<string>>; // New error setter
  termsAgreed: boolean; // Added terms agreed prop
  setTermsAgreed: React.Dispatch<React.SetStateAction<boolean>>; // Added terms setter
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  nameError,
  emailError,
  passwordError,
  confirmPasswordError,
  setNameError,
  setEmailError,
  setPasswordError,
  setConfirmPasswordError,
  termsAgreed,
  setTermsAgreed,
  handleSubmit,
  isLoading,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation();
  
  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    errorSetter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => {
    setter(value);
    errorSetter("");
  };

  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = '/terms-and-policy';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      <div className="flex flex-col gap-1">
        <label className="text-darcare-beige font-medium mb-1 font-serif" htmlFor="name">
          {t('auth.fullName')}
        </label>
        <div className="relative group">
          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-darcare-gold/60" />
          <input
            type="text"
            id="name"
            placeholder={t('auth.enterFullName', "Your full name")}
            className={`w-full pl-12 py-2.5 rounded-lg outline-none border ${
              nameError ? "border-red-500" : "border-darcare-gold/20"
            } bg-darcare-navy/40 text-darcare-beige font-sans text-base transition-all focus:border-darcare-gold focus:ring-1 focus:ring-darcare-gold`}
            value={name}
            onChange={(e) => handleInputChange(setName, setNameError, e.target.value)}
          />
        </div>
        {nameError && (
          <div className="flex items-center text-red-500 text-sm mt-1">
            <AlertCircle size={14} className="mr-1" />
            {t(nameError)}
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-1">
        <label className="text-darcare-beige font-medium mb-1 font-serif" htmlFor="email">
          {t('auth.email')}
        </label>
        <div className="relative group">
          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-darcare-gold/60" />
          <input
            type="email"
            id="email"
            placeholder={t('auth.enterEmail', "you@email.com")}
            autoComplete="email"
            className={`w-full pl-12 py-2.5 rounded-lg outline-none border ${
              emailError ? "border-red-500" : "border-darcare-gold/20"
            } bg-darcare-navy/40 text-darcare-beige font-sans text-base transition-all focus:border-darcare-gold focus:ring-1 focus:ring-darcare-gold`}
            value={email}
            onChange={(e) => handleInputChange(setEmail, setEmailError, e.target.value)}
          />
        </div>
        {emailError && (
          <div className="flex items-center text-red-500 text-sm mt-1">
            <AlertCircle size={14} className="mr-1" />
            {t(emailError)}
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-1">
        <label className="text-darcare-beige font-medium mb-1 font-serif" htmlFor="password">
          {t('auth.password')}
        </label>
        <div className="relative group">
          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-darcare-gold/60" />
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder={t('auth.enterPassword', "Password")}
            autoComplete="new-password"
            className={`w-full pl-12 pr-12 py-2.5 rounded-lg outline-none border ${
              passwordError ? "border-red-500" : "border-darcare-gold/20"
            } bg-darcare-navy/40 text-darcare-beige font-sans text-base transition-all focus:border-darcare-gold focus:ring-1 focus:ring-darcare-gold`}
            value={password}
            onChange={(e) => handleInputChange(setPassword, setPasswordError, e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-darcare-gold/60 hover:text-darcare-gold transition"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {passwordError && (
          <div className="flex items-center text-red-500 text-sm mt-1">
            <AlertCircle size={14} className="mr-1" />
            {t(passwordError)}
          </div>
        )}
      </div>
      
      {/* New Confirm Password Field */}
      <div className="flex flex-col gap-1">
        <label className="text-darcare-beige font-medium mb-1 font-serif" htmlFor="confirmPassword">
          {t('auth.confirmPassword')}
        </label>
        <div className="relative group">
          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-darcare-gold/60" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder={t('auth.confirmNewPassword', "Confirm password")}
            autoComplete="new-password"
            className={`w-full pl-12 pr-12 py-2.5 rounded-lg outline-none border ${
              confirmPasswordError ? "border-red-500" : "border-darcare-gold/20"
            } bg-darcare-navy/40 text-darcare-beige font-sans text-base transition-all focus:border-darcare-gold focus:ring-1 focus:ring-darcare-gold`}
            value={confirmPassword}
            onChange={(e) => handleInputChange(setConfirmPassword, setConfirmPasswordError, e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-darcare-gold/60 hover:text-darcare-gold transition"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {confirmPasswordError && (
          <div className="flex items-center text-red-500 text-sm mt-1">
            <AlertCircle size={14} className="mr-1" />
            {t(confirmPasswordError)}
          </div>
        )}
      </div>
      
      {/* Terms Agreement Checkbox - Moved above the button */}
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <input 
            type="checkbox" 
            id="terms-agreement" 
            checked={termsAgreed} 
            onChange={() => setTermsAgreed(prev => !prev)}
            className="rounded border-darcare-gold/50 text-darcare-gold focus:ring-darcare-gold/30"
          />
          <label 
            htmlFor="terms-agreement" 
            className="text-darcare-beige/70 text-sm cursor-pointer"
          >
            {t('auth.termsAgreement', 'I agree to the')}{' '}
            <button 
              onClick={handleTermsClick}
              className="text-darcare-gold hover:underline inline-block"
            >
              {t('auth.termsAndPolicy', 'Terms of Service and Privacy Policy')}
            </button>
          </label>
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full mt-4 py-2.5 font-serif font-semibold bg-gradient-to-r from-darcare-gold to-[#D4AF37] rounded-full shadow-lg text-darcare-navy hover:from-[#D4AF37] hover:to-darcare-gold transition-all tracking-wide text-lg disabled:opacity-70 relative"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-darcare-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('common.loading', 'Loading...')}
          </span>
        ) : (
          t('auth.createAccount', 'Create Account')
        )}
      </button>
    </form>
  );
};

export default SignupForm;
