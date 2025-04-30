
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface LoginFormProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  emailError: string;
  passwordError: string;
  setEmailError: React.Dispatch<React.SetStateAction<string>>;
  setPasswordError: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  emailError,
  passwordError,
  setEmailError,
  setPasswordError,
  handleSubmit,
  isLoading,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { isDarkMode } = useTheme();
  
  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    errorSetter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => {
    setter(value);
    errorSetter("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7 text-left">
      <div className="flex flex-col gap-1">
        <label className={cn(
          "font-medium mb-1 font-serif",
          isDarkMode ? "text-darcare-beige" : "text-primary"
        )} htmlFor="email">
          Email Address
        </label>
        <div className="relative group">
          <Mail size={18} className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2",
            isDarkMode ? "text-darcare-gold/60" : "text-secondary/60"
          )} />
          <input
            type="email"
            id="email"
            placeholder="you@email.com"
            autoComplete="email"
            className={cn(
              "w-full pl-12 py-3 rounded-lg outline-none border transition-all",
              isDarkMode 
                ? "bg-darcare-navy/40 text-darcare-beige focus:border-darcare-gold focus:ring-1 focus:ring-darcare-gold" 
                : "bg-background text-foreground focus:border-secondary focus:ring-1 focus:ring-secondary",
              emailError 
                ? "border-red-500" 
                : isDarkMode 
                  ? "border-darcare-gold/20" 
                  : "border-secondary/20"
            )}
            value={email}
            onChange={(e) => handleInputChange(setEmail, setEmailError, e.target.value)}
          />
        </div>
        {emailError && (
          <div className="flex items-center text-red-500 text-sm mt-1">
            <AlertCircle size={14} className="mr-1" />
            {emailError}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label className={cn(
          "font-medium mb-1 font-serif",
          isDarkMode ? "text-darcare-beige" : "text-primary"
        )} htmlFor="password">
          Password
        </label>
        <div className="relative group">
          <Lock size={18} className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2",
            isDarkMode ? "text-darcare-gold/60" : "text-secondary/60"
          )} />
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Password"
            autoComplete="current-password"
            className={cn(
              "w-full pl-12 pr-12 py-3 rounded-lg outline-none border transition-all",
              isDarkMode 
                ? "bg-darcare-navy/40 text-darcare-beige focus:border-darcare-gold focus:ring-1 focus:ring-darcare-gold" 
                : "bg-background text-foreground focus:border-secondary focus:ring-1 focus:ring-secondary",
              passwordError 
                ? "border-red-500" 
                : isDarkMode 
                  ? "border-darcare-gold/20" 
                  : "border-secondary/20"
            )}
            value={password}
            onChange={(e) => handleInputChange(setPassword, setPasswordError, e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 transition",
              isDarkMode 
                ? "text-darcare-gold/60 hover:text-darcare-gold" 
                : "text-secondary/60 hover:text-secondary"
            )}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {passwordError && (
          <div className="flex items-center text-red-500 text-sm mt-1">
            <AlertCircle size={14} className="mr-1" />
            {passwordError}
          </div>
        )}
      </div>
      <div className="text-right mb-1">
        <Link
          to="/forgot-password"
          className={cn(
            "text-sm underline-offset-4 hover:underline",
            isDarkMode 
              ? "text-darcare-beige/70 hover:text-darcare-gold" 
              : "text-foreground/70 hover:text-secondary"
          )}
        >
          Forgot Password?
        </Link>
      </div>
      <button
        type="submit"
        className={cn(
          "w-full mt-6 py-3 font-serif font-semibold rounded-full shadow-lg tracking-wide text-lg disabled:opacity-70 relative",
          isDarkMode
            ? "bg-gradient-to-r from-darcare-gold to-[#D4AF37] text-darcare-navy hover:from-[#D4AF37] hover:to-darcare-gold"
            : "bg-gradient-to-r from-secondary to-[#B89160] text-white hover:from-[#B89160] hover:to-secondary"
        )}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className={cn(
              "animate-spin -ml-1 mr-2 h-4 w-4", 
              isDarkMode ? "text-darcare-navy" : "text-white"
            )} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </span>
        ) : (
          "Sign In"
        )}
      </button>
      <div className="text-center mt-6">
        <p className={cn(
          "text-sm",
          isDarkMode ? "text-darcare-beige/70" : "text-foreground/70"
        )}>
          For testing:&nbsp;
          <span className={isDarkMode ? "text-darcare-gold" : "text-secondary"}>ourhejji.lina@gmail.com</span> / 
          <span className={isDarkMode ? "text-darcare-gold" : "text-secondary"}>linalina</span>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
