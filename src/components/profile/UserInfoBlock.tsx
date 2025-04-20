
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { UserRound, Calendar, Edit } from "lucide-react";

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
  return (
    <Card className="p-6 bg-darcare-navy/50 border-darcare-gold/20">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20 border-2 border-darcare-gold/20">
          <AvatarImage src={avatarUrl ?? undefined} />
          <AvatarFallback>
            <UserRound className="h-10 w-10 text-darcare-gold/50" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif text-darcare-gold">{fullName}</h2>
            <div className="flex gap-2">
              {villaNumber && checkIn && checkOut && onViewStay && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full border border-darcare-gold/20 bg-darcare-navy/30 text-darcare-gold hover:bg-darcare-gold/10"
                  onClick={onViewStay}
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
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <p className="text-darcare-beige/70">{email}</p>
          {villaNumber && (
            <p className="text-sm text-darcare-beige mt-1">
              Villa {villaNumber}
              {checkIn && checkOut && (
                <span className="block text-darcare-beige/50">
                  {format(new Date(checkIn), 'MMM d')} - {format(new Date(checkOut), 'MMM d, yyyy')}
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
