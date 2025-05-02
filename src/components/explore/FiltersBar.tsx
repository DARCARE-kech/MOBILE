
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
import { useTranslation } from 'react-i18next';

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
    </div>
  );
};
