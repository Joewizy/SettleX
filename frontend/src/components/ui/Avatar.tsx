"use client";

import { AVATAR_COLORS } from "@/lib/constants";

interface AvatarProps {
  initials: string;
  size?: "sm" | "md";
}

export function Avatar({ initials, size = "md" }: AvatarProps) {
  const sizeClass = size === "sm" ? "w-7 h-7 text-xs" : "w-8 h-8 text-xs";
  const color = AVATAR_COLORS[initials] || "bg-gray-400";

  return (
    <div
      className={`${sizeClass} ${color} rounded-full flex items-center justify-center text-white font-bold`}
    >
      {initials}
    </div>
  );
}
