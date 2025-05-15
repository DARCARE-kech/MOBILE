
import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { isValidCategory, RECOMMENDATION_CATEGORIES } from '@/utils/recommendationCategories';

interface FiltersBarProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  sortBy: "rating" | "distance";
  onSortChange: (sort: "rating" | "distance") => void;
}

export const FiltersBar = ({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange
}: FiltersBarProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useTranslation();
  
  // Function to handle category selection
  const handleCategoryChange = (category: string) => {
    onCategoryChange(category === 'all' ? null : category);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Category filter */}
        <div className="flex items-center">
          <span className="text-darcare-beige/50 text-sm mr-2">{t('explore.category')}:</span>
          <Select
            value={selectedCategory || 'all'}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-[150px] bg-transparent border-darcare-gold/20 text-darcare-beige">
              <SelectValue placeholder={t('explore.allCategories')} />
            </SelectTrigger>
            <SelectContent className="bg-darcare-navy border-darcare-gold/20">
              <SelectItem value="all" className="text-darcare-beige hover:text-darcare-gold">
                {t('explore.allCategories')}
              </SelectItem>
              {RECOMMENDATION_CATEGORIES.map((category) => (
                <SelectItem 
                  key={category} 
                  value={category} 
                  className="text-darcare-beige hover:text-darcare-gold"
                >
                  {t(`explore.categories.${category}`, category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Sort By filter */}
        <div className="flex items-center">
          <span className="text-darcare-beige/50 text-sm mr-2">{t('explore.sortBy')}:</span>
          <Select
            value={sortBy}
            onValueChange={(value) => onSortChange(value as "rating" | "distance")}
          >
            <SelectTrigger className="w-[120px] bg-transparent border-darcare-gold/20 text-darcare-beige">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-darcare-navy border-darcare-gold/20">
              <SelectItem value="rating" className="text-darcare-beige hover:text-darcare-gold">
                {t('explore.rating')}
              </SelectItem>
              <SelectItem value="distance" className="text-darcare-beige hover:text-darcare-gold">
                {t('explore.distance')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
