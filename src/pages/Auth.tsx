
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import AuthTabs from "@/components/auth/AuthTabs";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import AuthFooter from "@/components/auth/AuthFooter";
import { validateEmail, validatePassword, validateName } from "@/utils/authValidation";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
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
    
    const isEmailValid = validateEmail(email);
    if (isEmailValid) {
      setEmailError(isEmailValid);
      return;
    }

    const isPasswordValid = validatePassword(password);
    if (isPasswordValid) {
      setPasswordError(isPasswordValid);
      return;
    }

    if (!isLogin) {
      const isNameValid = validateName(name);
      if (isNameValid) {
        setNameError(isNameValid);
        return;
      }
    }

    try {
      if (isLogin) {
        await signIn(email, password);
        // Auth context will handle navigation on successful login
      } else {
        const result = await signUp(email, password, name);
        if (result.success) {
          // Switch to login mode after successful sign up
          setIsLogin(true);
          // Clear form fields
          setPassword("");
        }
      }
    } catch (error) {
      // Error handled in auth context
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
          
          <AuthTabs isLogin={isLogin} setIsLogin={setIsLogin} />
          
          {isLogin ? (
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              emailError={emailError}
              passwordError={passwordError}
              setEmailError={setEmailError}
              setPasswordError={setPasswordError}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          ) : (
            <SignupForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              nameError={nameError}
              emailError={emailError}
              passwordError={passwordError}
              setNameError={setNameError}
              setEmailError={setEmailError}
              setPasswordError={setPasswordError}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          )}
          
          <AuthFooter />
        </div>
      </div>
    </div>
  );
};

export default Auth;
