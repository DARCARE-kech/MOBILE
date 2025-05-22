
import React, { useEffect, useState } from "react";
import LuxuryLogo from "@/components/ui/LuxuryLogo";

const SplashScreen: React.FC = () => {
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setShowLogo(true);
    }, 300);

    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 800);
    
    const taglineTimer = setTimeout(() => {
      setShowTagline(true);
    }, 1200);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
      clearTimeout(taglineTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-darcare-navy to-[#151A28] flex flex-col items-center justify-center px-6">
      <div className={`transition-all duration-1000 transform ${showLogo ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
        <div className="relative">
          <div className="absolute -inset-14 bg-darcare-gold/10 rounded-full blur-3xl animate-pulse"></div>
          <LuxuryLogo size="lg" withText={false} />
        </div>
      </div>
      
      <div className={`mt-6 transition-all duration-1000 ${showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <h1 className="font-serif text-4xl text-darcare-gold">The View</h1>
      </div>
      
      <div className={`mt-3 transition-all duration-1000 delay-300 ${showTagline ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <p className="text-darcare-beige/70 text-center font-light text-lg max-w-xs">
          Your luxury villa experience in Marrakech
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
