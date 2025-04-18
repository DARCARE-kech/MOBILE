
import React, { useEffect, useState } from "react";
import Logo from "@/components/Logo";

const SplashScreen: React.FC = () => {
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setShowLogo(true);
    }, 300);

    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 800);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-darcare-navy flex flex-col items-center justify-center px-6">
      <div className={`transition-opacity duration-1000 ${showLogo ? "opacity-100" : "opacity-0"}`}>
        <div className="relative">
          <div className="absolute -inset-14 bg-darcare-gold/5 rounded-full blur-3xl animate-pulse-subtle"></div>
          <Logo size="lg" color="gold" withText={false} />
        </div>
      </div>
      
      <div className={`mt-6 transition-all duration-1000 ${showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <h1 className="font-serif text-3xl text-darcare-gold">DarCare</h1>
        <p className="text-darcare-beige/70 text-center mt-3 max-w-xs">
          Your luxury villa experience in Marrakech
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
