
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { UserRound } from "lucide-react";

interface UserInfoBlockProps {
  fullName: string;
  email: string | null;
  avatarUrl: string | null;
  villaNumber?: string;
  checkIn?: string;
  checkOut?: string;
}

export const UserInfoBlock = ({ 
  fullName, 
  email, 
  avatarUrl,
  villaNumber,
  checkIn,
  checkOut 
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
          <h2 className="text-xl font-serif text-darcare-gold">{fullName}</h2>
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
