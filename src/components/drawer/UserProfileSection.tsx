
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUserProfile } from "@/hooks/useUserProfile";

interface UserProfileSectionProps {
  getInitials: (name: string) => string;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ getInitials }) => {
  const { profile, currentStay, isLoading } = useUserProfile();

  return (
    <div className="mb-6 p-4 bg-darcare-navy/50 border border-darcare-gold/10 rounded-lg">
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-14 w-14 bg-darcare-gold/10 border border-darcare-gold/25">
          {profile?.avatar_url ? (
            <AvatarImage src={profile.avatar_url} />
          ) : (
            <AvatarFallback className="bg-darcare-gold/10 text-darcare-gold">
              {isLoading ? "..." : getInitials(profile?.full_name || "")}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <h3 className="font-serif text-darcare-gold text-lg">
            {isLoading ? "..." : profile?.full_name}
          </h3>
          {currentStay && (
            <p className="text-darcare-beige/70 text-sm">
              Villa {currentStay.villa_number}
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
