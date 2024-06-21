import { User } from "next-auth";
import Image from "next/image";
import React from "react";

import "../../../public/images/placeholder.jpg";
import { Conversation } from "@prisma/client";
import { useActiveList } from "@/app/hooks/useActiveList";
import { cn } from "@/lib/utils";

interface AvatarProps {
  image: string | undefined | null;
  isActive?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Avatar: React.FC<AvatarProps> = ({
  image,
  setIsOpen,
  isActive,
}) => {
  return (
    <div
      className={cn(
        "flex justify-center relative w-full h-full rounded-full overflow-hidden",
        isActive && "ring-2 ring-offset-2 ring-pink-500"
      )}
    >
      <Image
        alt="avatar"
        src={image || "/images/placeholder.jpg"}
        onClick={() => {
          if (setIsOpen) setIsOpen((prev) => !prev);
        }}
        fill
        className="cursor-pointer object-cover hover:opacity-70 transition"
      />
    </div>
  );
};
