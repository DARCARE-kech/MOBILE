
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles, MapPin, Coffee, Heart } from "lucide-react";
import LuxuryLogo from "@/components/ui/LuxuryLogo";

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const navigate = useNavigate();

  const screens = [
    {
      title: "Premium Villa Services",
      description: "Experience the highest level of comfort with personalized villa services at your fingertips.",
      icon: <Sparkles className="w-16 h-16 text-darcare-gold mb-8" />,
      features: [
        { icon: <Coffee size={18} />, text: "On-demand dining and refreshments" },
        { icon: <Heart size={18} />, text: "Personalized wellness services" },
        { icon: <MapPin size={18} />, text: "Transportation and excursions" },
      ],
    },
    {
      title: "Discover Marrakech",
      description: "Explore curated local recommendations and hidden gems of Marrakech.",
      icon: <MapPin className="w-16 h-16 text-darcare-gold mb-8" />,
      features: [
        { icon: <Coffee size={18} />, text: "Exclusive dining experiences" },
        { icon: <Heart size={18} />, text: "Cultural attractions and guided tours" },
        { icon: <Sparkles size={18} />, text: "Luxury shopping and experiences" },
      ],
    },
  ];

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      onComplete();
      navigate("/auth");
    }
  };

  const handlePrevious = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-darcare-navy to-[#151A28] flex flex-col px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <LuxuryLogo size="sm" />
        <button 
          onClick={handleSkip}
          className="text-darcare-beige/70 hover:text-darcare-gold transition-colors"
        >
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="flex justify-center mb-8">
            {screens[currentScreen].icon}
          </div>
          <h1 className="font-serif text-3xl text-darcare-gold mb-4 text-center">
            {screens[currentScreen].title}
          </h1>
          <p className="text-darcare-beige/80 mb-12 text-center text-lg">
            {screens[currentScreen].description}
          </p>

          <div className="space-y-6 mb-12">
            {screens[currentScreen].features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 animate-slide-in-right" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="w-10 h-10 rounded-full bg-darcare-gold/10 flex items-center justify-center text-darcare-gold">
                  {feature.icon}
                </div>
                <span className="text-darcare-beige text-lg">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex justify-center mb-8">
          {screens.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full mx-1.5 transition-all duration-300 ${
                index === currentScreen ? "w-6 bg-darcare-gold" : "bg-darcare-beige/30"
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              currentScreen === 0
                ? "text-darcare-beige/30 cursor-not-allowed"
                : "text-darcare-beige hover:text-darcare-gold border border-darcare-beige/30 hover:border-darcare-gold"
            }`}
            disabled={currentScreen === 0}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={handleNext}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-darcare-gold to-darcare-gold/80 text-darcare-navy flex items-center justify-center hover:shadow-lg hover:shadow-darcare-gold/20 transition-all"
          >
            {currentScreen === screens.length - 1 ? (
              "✓"
            ) : (
              <ChevronRight size={24} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
