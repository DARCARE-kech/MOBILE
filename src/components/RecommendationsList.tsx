
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRecommendationsQuery } from "@/hooks/useRecommendationsQuery";
import { RecommendationCardHome } from "@/components/RecommendationCardHome";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

const MAX_RECOMMENDATIONS = 5;

interface RecommendationsListProps {
  className?: string;
  showTitle?: boolean;
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({
  className,
  showTitle = false,
}) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const {
    data: recommendations,
    isLoading,
    isError,
  } = useRecommendationsQuery({});

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="grid grid-flow-col gap-4 auto-cols-[85%] sm:auto-cols-[45%] md:auto-cols-[30%]">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !recommendations || recommendations.length === 0) {
    return (
      <div className={cn("rounded-lg border p-6 text-center", className)}>
        <p className="text-muted-foreground">{t("explore.noRecommendationsFound")}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <ScrollArea className="pb-4">
        <div className="flex space-x-4 pb-4">
          {recommendations.slice(0, MAX_RECOMMENDATIONS).map((recommendation) => {
            return (
              <RecommendationCardHome
                key={recommendation.id}
                item={recommendation}
                onSelect={(id) => console.log(`Selected recommendation: ${id}`)}
                onToggleFavorite={(id) => console.log(`Toggled favorite for: ${id}`)}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RecommendationsList;
