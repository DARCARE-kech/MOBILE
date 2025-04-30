
import { Skeleton } from "@/components/ui/skeleton";
import { RecommendationDetailHeader } from "./RecommendationDetailHeader";
import BottomNavigation from "@/components/BottomNavigation";

interface RecommendationDetailSkeletonProps {
  onBack: () => void;
}

export const RecommendationDetailSkeleton = ({ onBack }: RecommendationDetailSkeletonProps) => {
  return (
    <div className="min-h-screen bg-darcare-navy">
      <RecommendationDetailHeader 
        title="Loading..." 
        onBack={onBack}
      />
      <div className="p-4 space-y-4">
        <Skeleton className="h-64 bg-darcare-gold/20 rounded-xl" />
        <Skeleton className="h-8 w-2/3 bg-darcare-gold/20 rounded" />
        <Skeleton className="h-4 w-1/3 bg-darcare-gold/20 rounded" />
        <Skeleton className="h-32 bg-darcare-gold/20 rounded" />
      </div>
      <BottomNavigation activeTab="explore" />
    </div>
  );
};
