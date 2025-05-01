
import React from "react";
import MainHeader from "@/components/MainHeader";
import BottomNavigation from "@/components/BottomNavigation";
import CurrentStay from "@/components/CurrentStay";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentStay } from "@/hooks/useCurrentStay";
import WeatherDisplay from "@/components/WeatherDisplay";
import RecommendationsList from "@/components/RecommendationsList";
import ServicesList from "@/components/ServicesList";
import { useTranslation } from "react-i18next";
import DrawerMenu from "@/components/DrawerMenu";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const { 
    data: currentStay, 
    isLoading: isStayLoading,
    refetch: refetchStay 
  } = useCurrentStay(user?.id);

  return (
    <div className="min-h-screen bg-background">
      <MainHeader 
        title="DarCare" 
        drawerContent={<DrawerMenu />}
      />
      
      <div className="pt-20 pb-24">
        <CurrentStay 
          currentStay={currentStay} 
          userId={user?.id} 
          refetchStay={refetchStay}
          isLoading={isStayLoading}
        />
        
        <div className="p-4">
          <WeatherDisplay />
          
          <div className="mt-8">
            <h2 className="font-serif text-xl text-primary mb-4">
              {t('home.quickServices')}
            </h2>
            <ServicesList 
              services={[]} 
              isLoading={false} 
            />
          </div>
          
          <div className="mt-8">
            <h2 className="font-serif text-xl text-primary mb-4">
              {t('home.exploreMarrakech')}
            </h2>
            <RecommendationsList />
          </div>
        </div>
      </div>
      
      <BottomNavigation activeTab="home" />
    </div>
  );
};

export default Home;
