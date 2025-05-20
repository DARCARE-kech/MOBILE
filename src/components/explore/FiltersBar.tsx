
import { useState } from 'react';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import IconButton from '@/components/services/IconButton';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  const [showFiltersDialog, setShowFiltersDialog] = useState(false);
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center gap-2">
      {/* Sort By Filter (Popover) */}
      <Popover>
        <PopoverTrigger asChild>
          <IconButton 
            icon={<ArrowUpDown className="text-darcare-beige" size={18} />} 
            variant="ghost" 
            size="sm"
            aria-label={t('explore.sortBy')}
          />
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-2 bg-darcare-navy border-darcare-gold/20"
          align="end"
        >
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start ${sortBy === 'rating' ? 'text-darcare-gold' : 'text-darcare-beige'}`}
              onClick={() => onSortChange('rating')}
            >
              {t('explore.rating')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start ${sortBy === 'distance' ? 'text-darcare-gold' : 'text-darcare-beige'}`}
              onClick={() => onSortChange('distance')}
            >
              {t('explore.distance')}
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Category Filter (Dialog) */}
      <IconButton 
        icon={<SlidersHorizontal className="text-darcare-beige" size={18} />} 
        variant="ghost" 
        size="sm"
        onClick={() => setShowFiltersDialog(true)}
        aria-label={t('explore.category')}
        badge={selectedCategory ? 1 : undefined}
      />

      <Dialog open={showFiltersDialog} onOpenChange={setShowFiltersDialog}>
        <DialogContent className="bg-darcare-navy border-darcare-gold/20 text-darcare-beige">
          <DialogHeader>
            <DialogTitle className="text-darcare-gold font-serif">
              {t('explore.filterByCategory')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            <Button
              variant="ghost"
              className={`w-full justify-start ${!selectedCategory ? 'text-darcare-gold' : 'text-darcare-beige'}`}
              onClick={() => {
                onCategoryChange(null);
                setShowFiltersDialog(false);
              }}
            >
             
            </Button>
            
            {RECOMMENDATION_CATEGORIES.map((category) => (
              <Button 
                key={category} 
                variant="ghost"
                className={`w-full justify-start ${selectedCategory === category ? 'text-darcare-gold' : 'text-darcare-beige'}`}
                onClick={() => {
                  onCategoryChange(category);
                  setShowFiltersDialog(false);
                }}
              >
                {t(`explore.categories.${category}`, category)}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
