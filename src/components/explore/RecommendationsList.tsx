
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RecommendationCard } from './RecommendationCard';
import { useRecommendationsQuery } from '@/hooks/useRecommendationsQuery';
import { type RecommendationCategory } from '@/utils/recommendationCategories';

interface RecommendationsListProps {
  searchQuery?: string;
  selectedCategory?: string | null;
  sortBy?: "rating" | "distance";
  onlyFavorites?: boolean;
  title?: string;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({
  searchQuery = "",
  selectedCategory = null,
  sortBy = "rating",
  onlyFavorites = false,
  title
}) => {
  const { t } = useTranslation();
  
  const { data: recommendations, isLoading, error } = useRecommendationsQuery({
    searchQuery,
    category: selectedCategory as RecommendationCategory,
    sortBy,
    onlyFavorites
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-darcare-gold font-medium">{t('common.error')}</p>
        <p className="text-darcare-beige/70 text-sm mt-1">{t('explore.somethingWentWrong')}</p>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-darcare-beige/70">{t('explore.noRecommendationsFound')}</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-6">
      {title && (
        <h2 className="text-darcare-gold font-serif text-2xl mb-4">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {recommendations.map((recommendation) => (
          <RecommendationCard 
            key={recommendation.id} 
            recommendation={recommendation}
          />
        ))}
      </div>
    </div>
  );
};
