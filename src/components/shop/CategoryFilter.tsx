
import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  
  return (
    <div className="overflow-x-auto scrollbar-hide pb-2">
      <div className={`flex w-max min-w-full ${isMobile ? 'space-x-1.5 px-2' : 'space-x-2 px-4'}`}>
        <button
          key="all"
          onClick={() => onSelectCategory('')}
          className={cn(
            `font-medium whitespace-nowrap transition-colors ${
              isMobile ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'
            } rounded-full`,
            selectedCategory === ''
              ? "bg-darcare-gold text-darcare-navy"
              : "bg-darcare-navy border border-darcare-gold/30 text-darcare-beige hover:border-darcare-gold/50"
          )}
        >
          {t('shop.allProducts')}
        </button>
        
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={cn(
              `font-medium whitespace-nowrap transition-colors ${
                isMobile ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'
              } rounded-full`,
              selectedCategory === category
                ? "bg-darcare-gold text-darcare-navy"
                : "bg-darcare-navy border border-darcare-gold/30 text-darcare-beige hover:border-darcare-gold/50"
            )}
          >
            {t(`shop.categories.${category.toLowerCase()}`) || category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
