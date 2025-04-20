
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

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
  onSortChange,
}: FiltersBarProps) => {
  const { t } = useTranslation();
  
  const categories = [
    { id: "restaurant", label: "Restaurants" },
    { id: "activity", label: "Activities" },
    { id: "wellness", label: "Wellness" },
    { id: "shopping", label: "Shopping" },
  ];

  return (
    <div className="mt-4 space-y-4">
      <div>
        <h3 className="text-sm text-darcare-beige/60 mb-2">{t('explore.categories')}</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(selectedCategory === category.id ? null : category.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === category.id
                  ? "bg-darcare-gold text-darcare-navy"
                  : "bg-darcare-navy/50 text-darcare-beige border border-darcare-gold/20"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm text-darcare-beige/60 mb-2">{t('explore.filters')}</h3>
        <Tabs 
          value={sortBy} 
          onValueChange={(v) => onSortChange(v as "rating" | "distance")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 h-8 bg-darcare-navy/50 border border-darcare-gold/20">
            <TabsTrigger 
              value="rating" 
              className="text-xs text-darcare-beige data-[state=active]:bg-darcare-gold/20 data-[state=active]:text-darcare-gold"
            >
              {t('explore.rating')}
            </TabsTrigger>
            <TabsTrigger 
              value="distance" 
              className="text-xs text-darcare-beige data-[state=active]:bg-darcare-gold/20 data-[state=active]:text-darcare-gold"
            >
              {t('explore.distance')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
