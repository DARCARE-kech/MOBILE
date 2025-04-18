
import { Skeleton } from "@/components/ui/skeleton";
import { RecommendationDetailHeader } from "./RecommendationDetailHeader";
import BottomNavigation from "@/components/BottomNavigation";

interface RecommendationDetailSkeletonProps {
  onBack: () => void;
}

export const RecommendationDetailSkeleton = ({ onBack }: RecommendationDetailSkeletonProps) => {
  return (
    <div className="min-h-screen bg-darcare-navy">
      <RecommendationDetailHeader title="Loading..." onBack={onBack} />
      <div className="animate-pulse p-4 space-y-4">
        <div className="h-64 bg-darcare-gold/20 rounded-xl" />
        <div className="h-8 w-2/3 bg-darcare-gold/20 rounded" />
        <div className="h-4 w-1/3 bg-darcare-gold/20 rounded" />
      </div>
      <BottomNavigation activeTab="explore" />
    </div>
  );
};
