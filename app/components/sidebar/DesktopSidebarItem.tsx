import clsx from "clsx";
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import React, { useState } from "react";
import { IconType } from "react-icons";

interface DesktopSidebarItemProps {
  href: Url;
  icon: IconType;
  label: String;
  onClick?: () => void;
}

export const DesktopSidebarItem: React.FC<DesktopSidebarItemProps> = ({
  icon: Icon,
  label,
  onClick,
  href,
}) => {
  return (
    <Link href={href}>
      <div className="flex py-2 px-2 group flex-col align-middle justify-center items-center bg-white rounded-full">
        <Icon
          className={clsx(
            "w-7 h-7 cursor-pointer transition-all",
            "text-zinc-500 group-hover:text-zinc-600"
          )}
          onClick={onClick}
        />
        <label className="sr-only">{label}</label>
      </div>
    </Link>
  );
};
