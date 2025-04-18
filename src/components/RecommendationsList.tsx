
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRecommendations } from "@/hooks/useRecommendations";
import { RecommendationCard } from "./RecommendationCard";
import { ChevronRight } from "lucide-react";

const RecommendationsList = () => {
  const { data: recommendations, isLoading } = useRecommendations();

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <div className="h-8 w-48 bg-darcare-gold/20 animate-pulse rounded" />
          <div className="h-8 w-24 bg-darcare-gold/20 animate-pulse rounded" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[280px] rounded-xl overflow-hidden flex-shrink-0">
              <div className="h-40 bg-darcare-gold/20 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-5 w-3/4 bg-darcare-gold/20 animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-darcare-gold/20 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-serif text-darcare-gold">Marrakech Highlights</h2>
        <button className="text-darcare-gold text-sm flex items-center">
          View All <ChevronRight size={16} />
        </button>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {recommendations?.map((item) => (
            <RecommendationCard key={item.id} item={item} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RecommendationsList;
