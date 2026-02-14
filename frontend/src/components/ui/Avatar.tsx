"use client";

import { AVATAR_COLORS } from "@/lib/constants";

interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ initials, size = "md" }: AvatarProps) {
  const sizeClasses = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-9 h-9 text-xs",
    lg: "w-11 h-11 text-sm",
  };
  const color = AVATAR_COLORS[initials] || "bg-slate-500";

  return (
    <div
      className={`${sizeClasses[size]} ${color} rounded-full flex items-center justify-center text-white font-semibold tracking-wide shadow-sm`}
    >
      {initials}
    </div>
  );
}
