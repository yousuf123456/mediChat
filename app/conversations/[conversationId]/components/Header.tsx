"use client";

import { Avatar } from "@/app/components/sidebar/Avatar";
import { useOtherUser } from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import React, { useMemo } from "react";
import { HiDotsHorizontal } from "react-icons/hi";

import { Sheet, SheetTrigger } from "../../../../components/ui/sheet";
import { Drawer } from "./Drawer";
import { useActiveList } from "@/app/hooks/useActiveList";
import { ActiveDot } from "@/app/components/sidebar/activeDot";

import { HiChevronLeft } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { testPusher } from "@/app/serverActions/testPusher";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

export const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation.users);
  // const [drawerOpen, setDrawerOpen] = useState(false)

  const { members } = useActiveList();

  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return conversation.users.length + " members";
    }

    return isActive ? "Active" : "offline";
  }, [conversation, isActive]);

  const onTestPusher = () => {
    testPusher("This is a test msg from the app");
  };

  return (
    <div className="flex flex-row justify-between sticky top-0 left-0 items-center py-3 px-3 sm:px-6 border-b-[1px] border-slate-200">
      <div className="flex items-center gap-4">
        <Link href={"/conversations"} className="lg:hidden">
          <HiChevronLeft className="w-6 h-6 sm:h-7 sm:w-7 text-pink-500 hover:text-pink-600" />
        </Link>

        <div className="flex gap-2 sm:gap-4 md:gap-6 items-center">
          {!conversation.isGroup && (
            <div className="relative">
              {isActive && <ActiveDot size="h-3 w-3" />}
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                <Avatar user={otherUser} />
              </div>
            </div>
          )}

          <div className="flex flex-col items-start gap-0">
            <h1 className="text-base sm:text-lg max-sm:leading-none  md:text-xl font-nunito text-indigo-950 font-medium capitalize">
              {conversation.isGroup ? conversation.name : otherUser.name}
            </h1>

            <p className="text-sm text-slate-500 font-roboto font-normal">
              {!conversation.isGroup && statusText}
            </p>
          </div>

          {conversation.isGroup && (
            <div className="flex flex-col items-start gap-0">
              <div className="flex flex-row gap-[-5px] items-center">
                {conversation.users.map((user, index) => {
                  if (index < 5)
                    return (
                      <div
                        key={index}
                        className="w-5 h-5 relative rounded-full overflow-hidden"
                      >
                        <Avatar user={user} />
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
              <div className="text-sm text-neutral-500 font-normal">
                {statusText}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* <Button onClick={onTestPusher}>Test Pusher Now</Button> */}

      <Sheet>
        <SheetTrigger>
          <HiDotsHorizontal className="sm:w-6 sm:h-6 w-5 h-5 text-pink-400 transition-all hover:text-pink-600 cursor-pointer" />
        </SheetTrigger>
        <Drawer conversation={conversation} />
      </Sheet>
      {/* <HiDotsHorizontal onClick={()=>setDrawerOpen(true)} className='w-8 h-8 text-blue-400 transition hover:text-blue-600 cursor-pointer'/> */}
    </div>
  );
};
