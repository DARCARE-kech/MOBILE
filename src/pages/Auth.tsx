
import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import Logo from "@/components/Logo";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { signIn, signUp, isLoading, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    try {
      if (isLogin) {
        await signIn(email, password);
        // No need to call navigate here (done in useAuth)
      } else {
        await signUp(email, password, name);
        // No need to call navigate here (done in useAuth)
      }
    } catch (error) {
      // handled in context
    }
  };

  return (
    <div className="min-h-screen bg-darcare-navy flex flex-col px-6 py-12 bg-gradient-to-b from-darcare-navy to-[#1A1F2C]">
      <div className="mb-12 flex justify-center">
        <Logo color="gold" size="md" />
      </div>
      <div className="w-full max-w-md mx-auto">
        <div className="luxury-card p-8 shadow-xl rounded-2xl border border-darcare-gold/20 bg-darcare-navy/80 backdrop-blur">
          <h1 className="font-serif text-3xl text-darcare-gold mb-3 text-center tracking-wide">
            {isLogin ? "Sign In" : "Create Account"}
          </h1>
          <p className="text-darcare-beige/70 text-center mb-10">
            {isLogin
              ? "Access your luxury villa services"
              : "Join DarCare for an exceptional Marrakech stay"}
          </p>
          <div className="flex rounded-full overflow-hidden bg-muted/30 p-1 mb-8 shadow-inner border border-darcare-gold/10">
            <button
              className={`flex-1 py-2 rounded-full transition-all font-serif text-base ${
                isLogin
                  ? "bg-darcare-gold text-darcare-navy font-semibold shadow-lg"
                  : "text-darcare-beige/70 hover:text-darcare-beige"
              }`}
              onClick={() => setIsLogin(true)}
              type="button"
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-2 rounded-full transition-all font-serif text-base ${
                !isLogin
                  ? "bg-darcare-gold text-darcare-navy font-semibold shadow-lg"
                  : "text-darcare-beige/70 hover:text-darcare-beige"
              }`}
              onClick={() => setIsLogin(false)}
              type="button"
            >
              Sign Up
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-7 text-left">
            {!isLogin && (
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
                    className="w-full pl-12 py-3 rounded-lg outline-none border border-darcare-gold/20 bg-darcare-navy/40 text-darcare-beige font-sans text-base transition-all focus:border-darcare-gold focus:ring-1 focus:ring-darcare-gold"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}
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
                  className="w-full pl-12 py-3 rounded-lg outline-none border border-darcare-gold/20 bg-darcare-navy/40 text-darcare-beige font-sans text-base transition-all focus:border-darcare-gold focus:ring-1 focus:ring-darcare-gold"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
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
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className="w-full pl-12 pr-12 py-3 rounded-lg outline-none border border-darcare-gold/20 bg-darcare-navy/40 text-darcare-beige font-sans text-base transition-all focus:border-darcare-gold focus:ring-1 focus:ring-darcare-gold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>
            {isLogin && (
              <div className="text-right mb-1">
                <button
                  type="button"
                  className="text-sm text-darcare-beige/70 hover:text-darcare-gold font-sans underline-offset-4"
                >
                  Forgot Password?
                </button>
              </div>
            )}
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
                isLogin ? "Sign In" : "Create Account"
              )}
            </button>
            {isLogin && (
              <div className="text-center mt-6">
                <p className="text-sm text-darcare-beige/70">
                  For testing:&nbsp;
                  <span className="text-darcare-gold">ourhejji.lina@gmail.com</span> / <span className="text-darcare-gold">linalina</span>
                </p>
              </div>
            )}
          </form>
          <div className="mt-10 text-center text-darcare-beige/50 text-sm">
            By continuing, you agree to our{" "}
            <button className="text-darcare-gold ml-1 mr-1 hover:underline">Terms of Service</button>
            and
            <button className="text-darcare-gold ml-1 hover:underline">Privacy Policy</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
