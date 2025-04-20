
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Globe } from "lucide-react";

interface PreferencesSectionProps {
  darkMode: boolean;
  language: string;
  onUpdatePreference: (key: string, value: boolean | string) => void;
}

export const PreferencesSection = ({
  darkMode,
  language,
  onUpdatePreference,
}: PreferencesSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 text-darcare-gold" />
          <Label htmlFor="dark-mode" className="text-darcare-beige">Dark Mode</Label>
        </div>
        <Switch
          id="dark-mode"
          checked={darkMode}
          onCheckedChange={(checked) => onUpdatePreference('dark_mode', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-darcare-gold" />
          <Label htmlFor="language" className="text-darcare-beige">Language</Label>
        </div>
        <Select
          value={language}
          onValueChange={(value) => onUpdatePreference('language', value)}
        >
          <SelectTrigger className="w-[140px] bg-darcare-navy/50 border-darcare-gold/20">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="ar">العربية</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
