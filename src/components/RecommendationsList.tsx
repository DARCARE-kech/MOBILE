
import React from "react";
import { ChevronRight, Star } from "lucide-react";

interface Recommendation {
  id: string;
  title: string;
  image: string;
  type: string;
  rating: number;
}

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({ recommendations }) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title">Marrakech Highlights</h2>
        <button className="text-darcare-gold text-sm flex items-center">
          View All <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
        {recommendations.map((item) => (
          <div key={item.id} className="min-w-[220px] rounded-xl overflow-hidden flex-shrink-0">
            <div className="h-32 relative">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-darcare-gold/90 text-darcare-navy rounded-full py-0.5 px-2 text-xs font-medium flex items-center gap-1">
                <Star size={12} fill="currentColor" />
                <span>{item.rating}</span>
              </div>
            </div>
            <div className="p-3 bg-card">
              <h3 className="font-medium text-darcare-white">{item.title}</h3>
              <p className="text-xs text-darcare-beige/70">{item.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsList;
