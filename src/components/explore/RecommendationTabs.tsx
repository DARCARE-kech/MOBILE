
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { RecommendationInfo } from "@/components/explore/RecommendationInfo";
import { RecommendationReviews } from "@/components/explore/RecommendationReviews";
import type { Recommendation } from "@/types/recommendation";

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

  return (
    <div className="p-4 pb-24">
      <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
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
