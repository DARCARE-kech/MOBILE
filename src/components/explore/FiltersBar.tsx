
import { Button } from "@/components/ui/button";
import { Heart, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center gap-2 mt-4">
      <Select
        value={selectedCategory || "all"}
        onValueChange={(value) => onCategoryChange(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[130px] bg-darcare-navy/50 border-darcare-gold/10 text-darcare-beige">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="restaurant">Restaurants</SelectItem>
          <SelectItem value="spa">Spa & Wellness</SelectItem>
          <SelectItem value="activity">Activities</SelectItem>
          <SelectItem value="excursion">Excursions</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={(value: "rating" | "distance") => onSortChange(value)}>
        <SelectTrigger className="w-[130px] bg-darcare-navy/50 border-darcare-gold/10 text-darcare-beige">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rating">Top Rated</SelectItem>
          <SelectItem value="distance">Nearest</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="icon"
        className="ml-auto border-darcare-gold/10 text-darcare-gold hover:text-darcare-gold hover:bg-darcare-gold/10"
        onClick={() => navigate("/explore/favorites")}
      >
        <Heart size={18} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="border-darcare-gold/10 text-darcare-gold hover:text-darcare-gold hover:bg-darcare-gold/10"
      >
        <SlidersHorizontal size={18} />
      </Button>
    </div>
  );
};
