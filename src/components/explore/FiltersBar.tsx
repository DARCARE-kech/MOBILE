
import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { RECOMMENDATION_CATEGORIES } from '@/utils/recommendationCategories';

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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setShowFilters(!showFilters)}
          className="text-darcare-beige hover:text-darcare-gold px-0"
        >
          <Filter className="h-4 w-4 mr-2" />
          {t('explore.filters')}
        </Button>
        
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
      
      {showFilters && (
        <div className="pt-3 border-t border-darcare-gold/20">
          <h3 className="text-darcare-beige mb-2">{t('explore.categories')}</h3>
          <div className="flex flex-wrap gap-2">
            {RECOMMENDATION_CATEGORIES.map((category) => (
              <Badge
                key={category}
                variant="outline"
                className={`cursor-pointer border-darcare-gold/30 hover:border-darcare-gold transition-colors ${
                  selectedCategory === category 
                    ? 'bg-darcare-gold/20 text-darcare-gold' 
                    : 'bg-transparent text-darcare-beige'
                }`}
                onClick={() => onCategoryChange(
                  selectedCategory === category ? null : category
                )}
              >
                {t(`explore.categories.${category.toLowerCase()}`)}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
