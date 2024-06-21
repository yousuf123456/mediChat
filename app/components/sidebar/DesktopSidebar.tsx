"use client";

import React, { useState } from "react";
import { DesktopSidebarItem } from "./DesktopSidebarItem";
import { HiChat, HiLogout } from "react-icons/hi";

import { Avatar } from "./Avatar";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { ProfileDrawer } from "./ProfileDrawer";
import { signOut } from "next-auth/react";
import { User } from "@clerk/nextjs/dist/types/server";

export const DesktopSidebar = ({ user }: { user: User }) => {
  return (
    <div className="lg:py-8 lg:px-4 xl:px-4 fixed lg:left-0 lg:flex lg:w-20 lg:flex-col lg:justify-between lg:items-center lg:h-full bg-pink-400">
      <div className="flex flex-row lg:flex-col gap-6">
        <DesktopSidebarItem
          icon={HiChat}
          label="conversations"
          href="/conversations"
        />
      </div>

      <div className="flex flex-col gap-4 items-center">
        <div>
          <Sheet defaultOpen={false}>
            <SheetTrigger>
              <div className="relative w-11 h-11 rounded-full overflow-hidden flex flex-col items-center">
                <Avatar image={user?.imageUrl} />
              </div>
            </SheetTrigger>

            <ProfileDrawer user={user as any} />
          </Sheet>
        </div>

        <DesktopSidebarItem
          icon={HiLogout}
          onClick={() => signOut()}
          label="logout"
          href="/"
        />
      </div>
    </div>
  );
};
