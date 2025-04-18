
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles, MapPin, Coffee, Heart } from "lucide-react";
import Logo from "@/components/Logo";

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
      icon: <Sparkles className="w-12 h-12 text-darcare-gold mb-6" />,
      features: [
        { icon: <Coffee size={18} />, text: "On-demand dining and refreshments" },
        { icon: <Heart size={18} />, text: "Personalized wellness services" },
        { icon: <MapPin size={18} />, text: "Transportation and excursions" },
      ],
    },
    {
      title: "Discover Marrakech",
      description: "Explore curated local recommendations and hidden gems of Marrakech.",
      icon: <MapPin className="w-12 h-12 text-darcare-gold mb-6" />,
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
    <div className="min-h-screen bg-darcare-navy flex flex-col px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <Logo size="sm" color="gold" />
        <button 
          onClick={handleSkip}
          className="text-darcare-beige/70 hover:text-darcare-beige transition-colors"
        >
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-md animate-fade-in">
          {screens[currentScreen].icon}
          <h1 className="font-serif text-3xl text-darcare-gold mb-4">
            {screens[currentScreen].title}
          </h1>
          <p className="text-darcare-beige/80 mb-10">
            {screens[currentScreen].description}
          </p>

          <div className="space-y-4 mb-10">
            {screens[currentScreen].features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="w-8 h-8 rounded-full bg-darcare-gold/10 flex items-center justify-center text-darcare-gold">
                  {feature.icon}
                </div>
                <span className="text-darcare-white">{feature.text}</span>
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
              className={`w-2 h-2 rounded-full mx-1 ${
                index === currentScreen ? "bg-darcare-gold" : "bg-darcare-beige/30"
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              currentScreen === 0
                ? "text-darcare-beige/30 cursor-not-allowed"
                : "text-darcare-beige hover:text-darcare-gold border border-darcare-beige/30 hover:border-darcare-gold"
            } transition-colors`}
            disabled={currentScreen === 0}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-darcare-gold text-darcare-navy flex items-center justify-center hover:opacity-90 transition-opacity"
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
