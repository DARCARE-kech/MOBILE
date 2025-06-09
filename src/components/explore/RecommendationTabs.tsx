
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
    <div className={isMobile ? "p-2 pb-16" : "p-4 pb-24"}>
      <Tabs value={activeTab} onValueChange={onTabChange} className={isMobile ? "space-y-2" : "space-y-4"}>
        <TabsList className="grid w-full grid-cols-2 bg-darcare-navy border border-darcare-gold/20">
          <TabsTrigger value="info" className="text-darcare-beige data-[state=active]:text-darcare-gold">
            {t('explore.info')}
          </TabsTrigger>
          <TabsTrigger value="reviews" className="text-darcare-beige data-[state=active]:text-darcare-gold">
            {t('explore.reviews')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <RecommendationInfo recommendation={recommendation} onReserve={onReserve} />
        </TabsContent>

        <TabsContent value="reviews">
          <RecommendationReviews recommendation={recommendation} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
