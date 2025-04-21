
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

  // Check if user is already logged in, redirect to home
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
        navigate('/home');
      } else {
        await signUp(email, password, name);
        navigate('/home');
      }
    } catch (error) {
      // Error is handled in the Auth context
    }
  };

  return (
    <div className="min-h-screen bg-darcare-navy flex flex-col px-6 py-12 bg-gradient-to-b from-darcare-navy to-[#1A1F2C]">
      <div className="mb-10 flex justify-center">
        <Logo color="gold" size="md" />
      </div>

      <div className="w-full max-w-md mx-auto">
        <h1 className="font-serif text-3xl text-darcare-gold mb-3 text-center">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-darcare-beige/70 text-center mb-8">
          {isLogin 
            ? "Sign in to access your luxury villa services" 
            : "Join us to enhance your stay in Marrakech"
          }
        </p>

        <div className="flex rounded-full overflow-hidden bg-muted/30 p-1 mb-8 shadow-inner">
          <button
            className={`flex-1 py-2.5 rounded-full ${
              isLogin ? "bg-darcare-gold text-darcare-navy font-medium" : "text-darcare-beige/70 hover:text-darcare-beige"
            } transition-all duration-300 text-sm`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2.5 rounded-full ${
              !isLogin ? "bg-darcare-gold text-darcare-navy font-medium" : "text-darcare-beige/70 hover:text-darcare-beige"
            } transition-all duration-300 text-sm`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="relative group">
              <User size={18} className="absolute left-5 top-1/2 transform -translate-y-1/2 text-darcare-beige/50 group-focus-within:text-darcare-gold transition-colors" />
              <input
                type="text"
                placeholder="Full Name"
                className="input-luxury w-full pl-12 border-darcare-gold/30 focus:border-darcare-gold transition-all duration-300 bg-darcare-navy/50 backdrop-blur-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="relative group">
            <Mail size={18} className="absolute left-5 top-1/2 transform -translate-y-1/2 text-darcare-beige/50 group-focus-within:text-darcare-gold transition-colors" />
            <input
              type="email"
              placeholder="Email Address"
              className="input-luxury w-full pl-12 border-darcare-gold/30 focus:border-darcare-gold transition-all duration-300 bg-darcare-navy/50 backdrop-blur-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative group">
            <Lock size={18} className="absolute left-5 top-1/2 transform -translate-y-1/2 text-darcare-beige/50 group-focus-within:text-darcare-gold transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input-luxury w-full pl-12 pr-12 border-darcare-gold/30 focus:border-darcare-gold transition-all duration-300 bg-darcare-navy/50 backdrop-blur-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 transform -translate-y-1/2 text-darcare-beige/50 hover:text-darcare-gold transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {isLogin && (
            <div className="text-right">
              <button type="button" className="text-sm text-darcare-beige/70 hover:text-darcare-gold transition-colors">
                Forgot Password?
              </button>
            </div>
          )}

          <button 
            type="submit" 
            className="button-primary w-full mt-8 relative py-3 bg-gradient-to-r from-darcare-gold to-[#D4AF37] hover:from-[#D4AF37] hover:to-darcare-gold transition-all duration-300 shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                For testing, use: <span className="text-darcare-gold">ourhejji.lina@gmail.com</span> / <span className="text-darcare-gold">linalina</span>
              </p>
            </div>
          )}
        </form>

        <div className="mt-10 text-center text-darcare-beige/50 text-sm">
          By continuing, you agree to our 
          <button className="text-darcare-gold ml-1 mr-1 hover:underline">Terms of Service</button>
          and
          <button className="text-darcare-gold ml-1 hover:underline">Privacy Policy</button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
