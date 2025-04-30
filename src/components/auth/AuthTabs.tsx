
import React from "react";

interface AuthTabsProps {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
}

const AuthTabs: React.FC<AuthTabsProps> = ({ isLogin, setIsLogin }) => {
  return (
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
  );
};

export default AuthTabs;
