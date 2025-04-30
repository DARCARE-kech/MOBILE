
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, AlertCircle } from "lucide-react";

interface SignupFormProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  nameError: string;
  emailError: string;
  passwordError: string;
  setNameError: React.Dispatch<React.SetStateAction<string>>;
  setEmailError: React.Dispatch<React.SetStateAction<string>>;
  setPasswordError: React.Dispatch<React.SetStateAction<string>>;
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
  nameError,
  emailError,
  passwordError,
  setNameError,
  setEmailError,
  setPasswordError,
  handleSubmit,
  isLoading,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
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
        <label className="text-darcare-beige font-medium mb-1 font-serif" htmlFor="name">
          Full Name
        </label>
        <div className="relative group">
          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-darcare-gold/60" />
          <input
            type="text"
            id="name"
            placeholder="Your full name"
            className={`w-full pl-12 py-3 rounded-lg outline-none border ${
              nameError ? "border-red-500" : "border-darcare-gold/20"
            } bg-darcare-navy/40 text-darcare-beige font-sans text-base transition-all focus:border-darcare-gold focus:ring-1 focus:ring-darcare-gold`}
            value={name}
            onChange={(e) => handleInputChange(setName, setNameError, e.target.value)}
          />
        </div>
        {nameError && (
          <div className="flex items-center text-red-500 text-sm mt-1">
            <AlertCircle size={14} className="mr-1" />
            {nameError}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-darcare-beige font-medium mb-1 font-serif" htmlFor="email">
          Email Address
        </label>
        <div className="relative group">
          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-darcare-gold/60" />
          <input
            type="email"
            id="email"
            placeholder="you@email.com"
            autoComplete="email"
            className={`w-full pl-12 py-3 rounded-lg outline-none border ${
              emailError ? "border-red-500" : "border-darcare-gold/20"
            } bg-darcare-navy/40 text-darcare-beige font-sans text-base transition-all focus:border-darcare-gold focus:ring-1 focus:ring-darcare-gold`}
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
        <label className="text-darcare-beige font-medium mb-1 font-serif" htmlFor="password">
          Password
        </label>
        <div className="relative group">
          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-darcare-gold/60" />
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Password"
            autoComplete="new-password"
            className={`w-full pl-12 pr-12 py-3 rounded-lg outline-none border ${
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
            {passwordError}
          </div>
        )}
      </div>
      <button
        type="submit"
        className="w-full mt-6 py-3 font-serif font-semibold bg-gradient-to-r from-darcare-gold to-[#D4AF37] rounded-full shadow-lg text-darcare-navy hover:from-[#D4AF37] hover:to-darcare-gold transition-all tracking-wide text-lg disabled:opacity-70 relative"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-darcare-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </span>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
};

export default SignupForm;
