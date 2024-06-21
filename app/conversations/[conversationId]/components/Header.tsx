"use client";

import { Avatar } from "@/app/components/sidebar/Avatar";
import { useOtherUser } from "@/app/hooks/useOtherUser";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";

import { Sheet, SheetTrigger } from "../../../../components/ui/sheet";
import { Drawer } from "./Drawer";

import { HiChevronLeft } from "react-icons/hi2";
import { Doc } from "@/convex/_generated/dataModel";
import { User } from "@clerk/nextjs/dist/types/server";
import { PresenceData } from "@/app/hooks/usePresence";
import { ActiveDot } from "@/app/components/sidebar/activeDot";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface HeaderProps {
  otherUsers: User[];
  conversation: Doc<"conversations">;
  othersPresence:
    | PresenceData<{
        typing: boolean;
      }>[]
    | undefined;
}

export const Header: React.FC<HeaderProps> = ({
  conversation,
  otherUsers,
  othersPresence,
}) => {
  const [_, setNow] = useState(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(Date.now()), 8000);

    return () => clearInterval(intervalId);
  }, [setNow]);

  const heartbeats = useQuery(api.presence.getHeartbeats, {
    userIds: otherUsers.map((user) => user.id),
  });

  const otherUser = otherUsers[0];

  const isUserTyping =
    (othersPresence || []).filter(
      (userPresenceData) =>
        userPresenceData.user === otherUser.id && userPresenceData.data.typing
    ).length > 0;

  const typingUsers = (othersPresence || []).filter(
    (userPresenceData) => userPresenceData.data.typing
  );

  let typingUsersList = typingUsers.map((userPresenceData) => {
    const user = otherUsers.filter(
      (user) => user.id === userPresenceData.user
    )[0];
    return user.firstName;
  });

  const typingUsersString = typingUsersList.join(", ").concat(" Typing...");

  const isUserOnline =
    (heartbeats || []).filter(
      (heartbeat) =>
        heartbeat.user === otherUser.id &&
        Date.now() - heartbeat.updated < 10000
    ).length > 0;

  return (
    <div className="flex flex-row z-50 bg-white justify-between sticky top-0 left-0 items-center py-3 px-3 sm:px-6">
      <div className="flex items-center gap-4">
        <Link href={"/conversations"} className="lg:hidden">
          <HiChevronLeft className="w-6 h-6 sm:h-7 sm:w-7 text-zinc-500 hover:text-zinc-600" />
        </Link>

        <div className="flex gap-2 md:gap-4 items-center">
          {!conversation.isGroup && (
            <div className="relative">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full">
                {isUserOnline && <ActiveDot size="h-2.5 w-2.5" />}
                <Avatar image={otherUser.imageUrl} isActive={isUserOnline} />
              </div>
            </div>
          )}

          <div className="flex flex-col items-start gap-0">
            <p className="text-base sm:text-lg leading-none  md:text-xl font-nunito text-indigo-950 font-medium capitalize">
              {conversation.isGroup ? conversation.name : otherUser.firstName}
            </p>

            {!conversation.isGroup && isUserTyping && (
              <p className="text-sm text-zinc-500">Typing...</p>
            )}

            {conversation.isGroup && typingUsers.length > 0 && (
              <p className="text-sm text-zinc-500">{typingUsersString}</p>
            )}
          </div>

          {conversation.isGroup && (
            <div className="flex flex-col items-start gap-0">
              <div className="flex flex-row gap-[-5px] items-center">
                {otherUsers.map((user, index) => {
                  if (index < 5)
                    return (
                      <div
                        key={index}
                        className="w-5 h-5 relative rounded-full overflow-hidden"
                      >
                        <Avatar image={user.imageUrl} />
                      </div>
                    );
                  else {
                    return (
                      <div key={index}>
                        <p className="text-black text-2xl">.</p>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <Sheet>
        <SheetTrigger>
          <HiDotsHorizontal className="sm:w-6 sm:h-6 w-5 h-5 text-zinc-500 transition-all hover:text-zinc-600 cursor-pointer" />
        </SheetTrigger>
        <Drawer conversation={conversation} otherUsers={otherUsers} />
      </Sheet>
    </div>
  );
};
