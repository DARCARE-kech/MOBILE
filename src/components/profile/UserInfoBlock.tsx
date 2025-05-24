
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { UserRound, Calendar, Edit, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UserInfoBlockProps {
  fullName: string;
  email: string | null;
  avatarUrl: string | null;
  villaNumber?: string;
  checkIn?: string;
  checkOut?: string;
  onViewStay?: () => void;
  onEditProfile?: () => void;
}

export const UserInfoBlock = ({ 
  fullName, 
  email, 
  avatarUrl,
  villaNumber,
  checkIn,
  checkOut,
  onViewStay,
  onEditProfile
}: UserInfoBlockProps) => {
  const { t } = useTranslation();
  
  return (
    <Card className="p-5 bg-card border-darcare-gold/20 shadow-md">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border border-darcare-gold/20">
          <AvatarImage src={avatarUrl ?? undefined} alt={fullName} />
          <AvatarFallback className="bg-darcare-gold/10">
            <UserRound className="h-8 w-8 text-darcare-gold/70" />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif text-darcare-gold">{fullName}</h2>
              <div className="flex gap-3 mt-2">
                {onViewStay && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full border border-darcare-gold/20 bg-darcare-navy/30 text-darcare-gold hover:bg-darcare-gold/10"
                    onClick={onViewStay}
                    aria-label={t('profile.stayDetails')}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                )}
                {onEditProfile && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full border border-darcare-gold/20 bg-darcare-navy/30 text-darcare-gold hover:bg-darcare-gold/10"
                    onClick={onEditProfile}
                    aria-label={t('profile.editProfile')}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {villaNumber && (
            <div className="mt-3 px-3 py-2 bg-darcare-navy/40 rounded-md border border-darcare-gold/10">
              <p className="text-sm text-darcare-beige font-medium">
                {villaNumber}
              </p>
              {checkIn && checkOut && (
                <p className="text-xs text-darcare-beige/50 mt-1">
                  {format(new Date(checkIn), 'MMM d')} – {format(new Date(checkOut), 'MMM d, yyyy')}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
