
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-darcare-beige/50" size={18} />
      <Input
        placeholder="Search places & experiences..."
        className="pl-10 bg-darcare-navy/50 border-darcare-gold/10 text-darcare-beige placeholder:text-darcare-beige/50"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};
