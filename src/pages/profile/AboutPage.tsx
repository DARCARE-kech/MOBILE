
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, FileText, Heart } from 'lucide-react';
import MainHeader from '@/components/MainHeader';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Logo from '@/components/Logo';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader title="About" onBack={() => navigate('/profile')} />
      
      <div className="pt-20 pb-24 px-4">
        <div className="flex flex-col items-center mb-8">
          <Logo size="md" color="gold" />
          <p className="text-darcare-beige mt-2">Version 1.0.0</p>
        </div>
        
        <Card className="p-6 bg-darcare-navy/50 border-darcare-gold/20 mb-6">
          <h2 className="text-xl font-serif text-darcare-gold mb-4">About DarCare</h2>
          <p className="text-darcare-beige leading-relaxed">
            DarCare is a luxury villa management app that provides a seamless experience for guests staying in our exclusive properties. 
            Manage your stay, request services, explore local attractions, and connect with our staff - all from one elegant application.
          </p>
        </Card>
        
        <Card className="p-6 bg-darcare-navy/50 border-darcare-gold/20 mb-6">
          <h2 className="text-xl font-serif text-darcare-gold mb-4">Legal</h2>
          
          <div className="space-y-5">
            <div className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => {}}>
              <FileText className="h-5 w-5 text-darcare-gold" />
              <div className="flex-1">
                <span className="text-darcare-beige">Terms of Service</span>
              </div>
            </div>
            
            <Separator className="bg-darcare-gold/10" />
            
            <div className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => {}}>
              <FileText className="h-5 w-5 text-darcare-gold" />
              <div className="flex-1">
                <span className="text-darcare-beige">Privacy Policy</span>
              </div>
            </div>
            
            <Separator className="bg-darcare-gold/10" />
            
            <div className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => {}}>
              <Info className="h-5 w-5 text-darcare-gold" />
              <div className="flex-1">
                <span className="text-darcare-beige">Licenses</span>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="flex justify-center items-center mt-8 text-center text-darcare-beige/50 text-sm">
          <Heart className="h-4 w-4 mr-1 text-darcare-gold/50" /> 
          <span>Made with care by DarCare Team © 2025</span>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
