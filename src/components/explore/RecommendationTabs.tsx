
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { RecommendationInfo } from "@/components/explore/RecommendationInfo";
import { RecommendationReviews } from "@/components/explore/RecommendationReviews";
import type { Recommendation } from "@/types/recommendation";
import { useIsMobile } from "@/hooks/use-mobile";

interface RecommendationTabsProps {
  recommendation: Recommendation;
  activeTab: string;
  onTabChange: (value: string) => void;
  onReserve: () => void;
}

export const RecommendationTabs = ({ 
  recommendation, 
  activeTab, 
  onTabChange,
  onReserve
}: RecommendationTabsProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
  <div className="px-4 pb-16 max-w-screen-sm mx-auto space-y-6">
  <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
    
    {/* Onglets */}
    <TabsList className="grid grid-cols-2 rounded-md overflow-hidden border border-darcare-gold/20 bg-darcare-navy h-8">
      <TabsTrigger
        value="info"
        className="text-xs h-8 px-2 text-darcare-beige data-[state=active]:text-darcare-gold"
      >
        {t('explore.info')}
      </TabsTrigger>
      <TabsTrigger
        value="reviews"
        className="text-xs h-8 px-2 text-darcare-beige data-[state=active]:text-darcare-gold"
      >
        {t('explore.reviews')}
      </TabsTrigger>
    </TabsList>

    {/* Contenus des onglets */}
    <div className="space-y-4">
      <TabsContent value="info">
        <RecommendationInfo recommendation={recommendation} onReserve={onReserve} />
      </TabsContent>

      <TabsContent value="reviews">
        <RecommendationReviews recommendation={recommendation} />
      </TabsContent>
    </div>
  </Tabs>
</div>

);

};
