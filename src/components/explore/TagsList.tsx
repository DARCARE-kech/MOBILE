
import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface TagsListProps {
  tags: string[];
}

export const TagsList = ({ tags }: TagsListProps) => {
  const isMobile = useIsMobile();
  
  if (!tags?.length) return null;

  return (
    <div className={isMobile ? "mt-3" : "mt-6"}>
      <h3 className={`font-serif text-darcare-gold ${isMobile ? "text-base mb-1" : "text-lg mb-2"}`}>Features</h3>
      <div className={`flex flex-wrap ${isMobile ? "gap-1" : "gap-2"}`}>
        {tags.map((tag, i) => (
          <Badge 
            key={i} 
            variant="outline" 
            className={`bg-darcare-gold/10 text-darcare-beige border-darcare-gold/20 ${isMobile ? "text-xs px-1.5 py-0.5" : ""}`}
          >
            <Tag size={isMobile ? 10 : 12} className="mr-1" /> {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};
