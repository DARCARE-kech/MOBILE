
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-darcare-beige/50" />
      </div>
      <Input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={t('explore.searchPlaceholder')}
        className="w-full pl-10 pr-10 bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige placeholder:text-darcare-beige/50"
      />
      {query && (
        <button
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={handleClear}
        >
          <X className="h-4 w-4 text-darcare-beige/50" />
        </button>
      )}
    </div>
  );
};
