
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

interface ProfileHeaderProps {
  avatarUrl: string | null | undefined;
  fullName: string | undefined;
}

export const ProfileHeader = ({ avatarUrl, fullName }: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col items-center mb-6">
      <Avatar className="h-24 w-24 border-2 border-darcare-gold/20 mb-4 shadow-md">
        <AvatarImage src={avatarUrl ?? undefined} />
        <AvatarFallback className="bg-darcare-gold/10">
          <UserRound className="h-12 w-12 text-darcare-gold/70" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
};
