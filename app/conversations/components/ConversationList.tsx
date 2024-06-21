"use client";
import clsx from "clsx";
import React, { useState } from "react";
import { BsPersonAdd } from "react-icons/bs";
import { AddUserModel } from "./AddUserModel";

import { ConversationBox } from "./ConversationBox";
import useConversation from "@/app/hooks/useConversation";
import { CreateGroupModel } from "./CreateGroupModel";
import { Avatar } from "@/app/components/sidebar/Avatar";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { ProfileDrawer } from "@/app/components/sidebar/ProfileDrawer";
import Image from "next/image";
import { DesktopSidebarItem } from "@/app/components/sidebar/DesktopSidebarItem";
import { SignOutButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, LogOut } from "lucide-react";

export interface UserInformation {
  name: string | null;
  imageUrl: string | null;
  id: string;
  emailAddress: string | null;
}

interface ConversationListProps {
  users: UserInformation[];
  currentUser: UserInformation | null;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  users,
  currentUser,
}) => {
  const [isGroup, setIsgroup] = useState<boolean>(false);
  const [model2Open, setModel2Open] = useState(false);

  const { conversationId, isOpen } = useConversation();

  const conversations = useQuery(api.conversations.get, {});

  return (
    <>
      <div
        className={clsx(
          "fixed w-full h-full mb-20 z-50 lg:mb-0 lg:w-80 lg:h-full lg:overflow-y-auto lg:flex flex-col border-slate-200 bg-white",
          isOpen ? "hidden" : "flex"
        )}
      >
        <div className="w-full border-slate-200">
          <div className="sm:py-0 h-full lg:py-4 max-[440px]:px-4 max-sm:px-8 relative">
            <div className="h-full w-full flex py-3 lg:py-4 gap-4 items-center sm:justify-center">
              <div className="w-[40px] h-[20px] sm:w-[50px] sm:h-[25px] relative">
                <Image alt="Logo" src={"/images/logo.png"} fill />
              </div>

              <h1 className="text-xl sm:text-2xl bg-gradient-to-b from-black to-pink-500 font-nunito font-medium bg-clip-text text-transparent">
                ChatVibe
              </h1>
            </div>

            <Sheet defaultOpen={false}>
              <SheetTrigger className="lg:hidden">
                <div className="absolute w-10 h-10 rounded-full overflow-hidden right-4 sm:right-8 top-1/2 -translate-y-1/2">
                  <Avatar image={currentUser?.imageUrl} />
                </div>
              </SheetTrigger>

              <ProfileDrawer user={currentUser} />
            </Sheet>
          </div>
        </div>

        <div className="flex justify-between items-end px-3">
          <div className="flex justify-around w-full mt-8 lg:mt-6">
            <div
              className={clsx(
                "inline cursor-pointer",
                !isGroup ? "pb-0 border-b-2 border-indigo-950" : ""
              )}
              onClick={() => setIsgroup(false)}
            >
              <p
                className={clsx(
                  "text-base font-poppins",
                  !isGroup ? "text-indigo-950" : "opacity-50"
                )}
              >
                Chats
              </p>
            </div>

            <div
              className={clsx(
                "inline cursor-pointer",
                isGroup ? "pb-0 border-b-2 border-indigo-950" : ""
              )}
              onClick={() => setIsgroup(true)}
            >
              <p
                className={clsx(
                  "text-base font-poppins",
                  isGroup ? "text-indigo-950" : "opacity-50"
                )}
              >
                Groups
              </p>
            </div>
          </div>

          {!isGroup && (
            <div className="flex justify-end mt-2 sm:mt-4 flex-shrink-0">
              <div className="border-[1px] border-indigo-950 rounded-md cursor-pointer">
                <AddUserModel />
              </div>
            </div>
          )}

          {isGroup && (
            <div className="flex justify-end mt-4">
              <div className="border-[1px] border-indigo-950 rounded-md cursor-pointer">
                <BsPersonAdd
                  className="h-5 w-5 text-indigo-950"
                  onClick={() => setModel2Open(true)}
                />

                <CreateGroupModel
                  title="Create a New Group"
                  modifytrigger={false}
                  open={model2Open}
                  setOpen={setModel2Open}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-0">
          {conversations ? (
            conversations.map((conversation) => {
              let selected;
              if (conversationId === conversation._id) selected = true;
              else selected = false;
              if (conversation.isGroup === isGroup) {
                return (
                  <ConversationBox
                    key={conversation._id}
                    item={conversation}
                    selected={selected}
                  />
                );
              }
            })
          ) : (
            <div className="mt-4 w-full flex justify-center items-center flex-col gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />

              <p className="text-zinc-600">Loading Chats</p>
            </div>
          )}
        </div>

        <div className="fixed hidden lg:block bottom-0 left-0 w-80 px-6 py-3 border-t-[1px] border-slate-200 z-[51]">
          <div className="flex items-center justify-between">
            <div>
              <Sheet defaultOpen={false}>
                <SheetTrigger>
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex flex-col items-center">
                    <Avatar image={currentUser?.imageUrl} />
                  </div>
                </SheetTrigger>

                <ProfileDrawer user={currentUser} />
              </Sheet>
            </div>

            <SignOutButton>
              <DesktopSidebarItem icon={LogOut} label="logout" href="/" />
            </SignOutButton>
          </div>
        </div>
      </div>
    </>
  );
};
