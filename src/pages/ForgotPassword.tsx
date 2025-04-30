
import React, { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Please enter your email");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/auth",
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Reset link sent",
        description: "If the email exists, you will receive a password reset link.",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      
      // We don't want to reveal if an email exists or not for security reasons
      // So we still show a success message even if there's an error
      setIsSuccess(true);
      
      toast({
        title: "Email sent",
        description: "If the email exists, a reset link has been sent.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-darcare-navy flex flex-col px-6 py-12 bg-gradient-to-b from-darcare-navy to-[#1A1F2C]">
      <div className="mb-12 flex justify-center">
        <Logo color="gold" size="md" />
      </div>
      
      <div className="w-full max-w-md mx-auto">
        <div className="luxury-card p-8 shadow-xl rounded-2xl border border-darcare-gold/20 bg-darcare-navy/80 backdrop-blur">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-darcare-beige/70 hover:text-darcare-gold mb-6"
            aria-label="Go back"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </button>
          
          <h1 className="font-serif text-3xl text-darcare-gold mb-3 text-center tracking-wide">
            Reset your password
          </h1>
          
          <p className="text-darcare-beige/70 text-center mb-10">
            Enter your email and we'll send you a reset link
          </p>
          
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center text-center py-6">
              <CheckCircle size={50} className="text-darcare-gold mb-4" />
              <h2 className="text-xl font-serif text-darcare-gold mb-2">Check your inbox</h2>
              <p className="text-darcare-beige/70 mb-6">
                If the email exists in our system, we've sent a password reset link.
              </p>
              <button
                onClick={() => navigate("/auth")}
                className="px-6 py-2 rounded-full border border-darcare-gold/30 text-darcare-gold hover:bg-darcare-gold/10 transition-colors"
              >
                Return to sign in
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
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
                    className={`w-full pl-12 py-3 rounded-lg outline-none border ${
                      emailError ? "border-red-500" : "border-darcare-gold/20"
                    } bg-darcare-navy/40 text-darcare-beige font-sans text-base transition-all focus:border-darcare-gold focus:ring-1 focus:ring-darcare-gold`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                  />
                </div>
                {emailError && (
                  <div className="flex items-center text-red-500 text-sm mt-1">
                    <AlertCircle size={14} className="mr-1" />
                    {emailError}
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full mt-6 py-3 font-serif font-semibold bg-gradient-to-r from-darcare-gold to-[#D4AF37] rounded-full shadow-lg text-darcare-navy hover:from-[#D4AF37] hover:to-darcare-gold transition-all tracking-wide text-lg disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-darcare-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
