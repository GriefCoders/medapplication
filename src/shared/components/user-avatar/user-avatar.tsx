import type { Person } from "@/entities/user/model";
import { Avatar } from "@heroui/react";
import { User } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface UserAvatarProps {
  person?: Person;
  size?: "xs" | "sm" | "md" | "lg" | "room";
  showTooltip?: boolean;
  src?: string;
}

export const UserAvatar = ({
  person,
  src,
  size = "md",
  showTooltip = false,
}: UserAvatarProps) => {
  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    room: "w-24 h-24 ring-0",
  };

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-9 h-9",
    room: "w-20 h-20",
  };

  const avatar = (
    <div
      className={twMerge(
        "bg-primary/10 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-primary/10",
        sizeClasses[size]
      )}
    >
      {src || person?.presignedURL ? (
        <Avatar
          name={person?.name}
          src={src || person?.presignedURL}
          className="w-full h-full object-cover"
        />
      ) : (
        <User className={`${iconSizes[size]} text-primary/70`} />
      )}
    </div>
  );

  if (showTooltip && person?.name) {
    return (
      <div className="relative group">
        {avatar}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          {person?.name}
        </div>
      </div>
    );
  }

  return avatar;
};
