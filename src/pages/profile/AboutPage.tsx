
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, FileText, Heart } from 'lucide-react';
import MainHeader from '@/components/MainHeader';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Logo from '@/components/Logo';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div className={cn(
      "min-h-screen",
      isDarkMode ? "bg-darcare-navy" : "bg-background"
    )}>
      <MainHeader title="About" showBack={true} onBack={() => navigate('/profile')} />
      
      <div className="pt-20 pb-24 px-4">
        <div className="flex flex-col items-center mb-8">
          <Logo size="md" color={isDarkMode ? "gold" : "navy"} />
          <p className={cn(
            "mt-2",
            isDarkMode ? "text-darcare-beige" : "text-foreground/70"
          )}>Version 1.0.0</p>
        </div>
        
        <Card className={cn(
  "p-6 mb-6",
  isDarkMode 
    ? "bg-darcare-navy/50 border-darcare-gold/20" 
    : "bg-white border-secondary/20"
)}>
  <h2 className={cn(
    "text-xl font-serif mb-4",
    isDarkMode ? "text-darcare-gold" : "text-primary"
  )}>About The View</h2>
  <div className={cn(
    "space-y-4 leading-relaxed",
    isDarkMode ? "text-darcare-beige" : "text-foreground"
  )}>
    <p>
      Welcome to <strong>The View</strong>, your exclusive residence nestled in the heart of Marrakech.
      More than just a home, The View is a lifestyle experience designed for comfort, elegance, and seamless living.
    </p>
    <p>
      <strong>Our Complex:</strong> The View offers a secure and serene environment combining modern architecture with traditional Moroccan charm.
      Residents enjoy access to high-end amenities such as private swimming pools, sports courts, wellness zones, gardens, and 24/7 concierge services.
    </p>
    <p>
      <strong>Our Services:</strong> From daily housekeeping to on-demand maintenance and external reservations, our platform simplifies your entire stay.
      You can request cleaning, laundry, grocery delivery, technical assistance, transport, or book exclusive experiences — all from one app.
    </p>
    <p>
      <strong>Our Commitment:</strong> At The View, we are dedicated to providing a luxurious and worry-free experience.
      Our team is always available to ensure your comfort, safety, and satisfaction throughout your stay.
    </p>
  </div>
</Card>

        
        
        
        <div className="flex justify-center items-center mt-8 text-center text-sm">
          <Heart className={cn(
            "h-4 w-4 mr-1",
            isDarkMode ? "text-darcare-gold/50" : "text-secondary/50"
          )} /> 
          <span className={cn(
            isDarkMode ? "text-darcare-beige/50" : "text-foreground/50"
          )}>Made with care by The View Team © 2025</span>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
