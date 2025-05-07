
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface UserProfileSectionProps {
  getInitials: (name: string) => string;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ getInitials }) => {
  const { profile, currentStay, isLoading, error } = useUserProfile();

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6 bg-darcare-navy/50 border-darcare-gold/10">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-sm text-darcare-beige">
          Failed to load profile. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="mb-6 p-4 bg-darcare-navy/50 border border-darcare-gold/10 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-darcare-navy/50 border border-darcare-gold/10 rounded-lg">
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-14 w-14 bg-darcare-gold/10 border border-darcare-gold/25">
          {profile?.avatar_url ? (
            <AvatarImage src={profile.avatar_url} alt={profile?.full_name} />
          ) : (
            <AvatarFallback className="bg-darcare-gold/10 text-darcare-gold">
              {getInitials(profile?.full_name || "")}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <h3 className="font-serif text-darcare-gold text-lg">
            {profile?.full_name}
          </h3>
          {currentStay && (
            <p className="text-darcare-beige/70 text-sm">
              {currentStay.villa_number}
            </p>
          )}
        </div>
      </div>

      {currentStay && (
        <div className="text-xs text-darcare-beige/60 flex justify-between">
          <span>
            {new Date(currentStay.check_in).toLocaleDateString()} -{" "}
            {new Date(currentStay.check_out).toLocaleDateString()}
          </span>
          <span>
            {Math.round(
              (new Date(currentStay.check_out).getTime() -
                new Date(currentStay.check_in).getTime()) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            nights
          </span>
        </div>
      )}
    </div>
  );
};

export default UserProfileSection;
