
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import Logo from "@/components/Logo";
import { useToast } from "@/components/ui/use-toast";

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!email || !password || (!isLogin && !name)) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    // Simulate authentication
    // Note: This would connect to Supabase in a real implementation
    setTimeout(() => {
      toast({
        title: "Success",
        description: isLogin ? "Welcome back!" : "Account created successfully!",
      });
      onLogin();
      navigate("/home");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-darcare-navy flex flex-col px-6 py-12">
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

        <div className="flex rounded-full overflow-hidden bg-muted/30 p-1 mb-8">
          <button
            className={`flex-1 py-2 rounded-full ${
              isLogin ? "bg-darcare-gold text-darcare-navy" : "text-darcare-beige/70"
            } transition-colors text-sm font-medium`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 rounded-full ${
              !isLogin ? "bg-darcare-gold text-darcare-navy" : "text-darcare-beige/70"
            } transition-colors text-sm font-medium`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User size={18} className="absolute left-5 top-1/2 transform -translate-y-1/2 text-darcare-beige/50" />
              <input
                type="text"
                placeholder="Full Name"
                className="input-luxury w-full pl-12"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="relative">
            <Mail size={18} className="absolute left-5 top-1/2 transform -translate-y-1/2 text-darcare-beige/50" />
            <input
              type="email"
              placeholder="Email Address"
              className="input-luxury w-full pl-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-5 top-1/2 transform -translate-y-1/2 text-darcare-beige/50" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input-luxury w-full pl-12 pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 transform -translate-y-1/2 text-darcare-beige/50 hover:text-darcare-beige"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {isLogin && (
            <div className="text-right">
              <button type="button" className="text-sm text-darcare-beige/70 hover:text-darcare-gold">
                Forgot Password?
              </button>
            </div>
          )}

          <button type="submit" className="button-primary w-full mt-6">
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center text-darcare-beige/50 text-sm">
          By continuing, you agree to our 
          <button className="text-darcare-gold ml-1 mr-1">Terms of Service</button>
          and
          <button className="text-darcare-gold ml-1">Privacy Policy</button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
