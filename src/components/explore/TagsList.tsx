
import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TagsListProps {
  tags: string[];
}

export const TagsList = ({ tags }: TagsListProps) => {
  if (!tags?.length) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-serif text-darcare-gold mb-2">Features</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <Badge 
            key={i} 
            variant="outline" 
            className="bg-darcare-gold/10 text-darcare-beige border-darcare-gold/20"
          >
            <Tag size={12} className="mr-1" /> {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};
