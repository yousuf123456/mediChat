"use client";
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import { BsPersonAdd } from "react-icons/bs";
import { AddUserModel } from "./AddUserModel";

import { FullConversationType, FullMessageType } from "@/app/types";

import { ConversationBox } from "./ConversationBox";
import useConversation from "@/app/hooks/useConversation";
import { CreateGroupModel } from "./CreateGroupModel";
import { User } from "@prisma/client";
import { Avatar } from "@/app/components/sidebar/Avatar";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { ProfileDrawer } from "@/app/components/sidebar/ProfileDrawer";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import Image from "next/image";

interface ConversationListProps {
  initialItems: FullConversationType[];
  initialUsers: User[];
  currentUser: User | null;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  initialUsers,
  currentUser,
}) => {
  const [conversations, setConversations] = useState(initialItems);
  const [users, setUsers] = useState(initialUsers);
  const [initialCurrentUser, setInitialCurrentUser] = useState(currentUser);

  const [isGroup, setIsgroup] = useState<boolean>(false);
  const [model2Open, setModel2Open] = useState(false);

  const { conversationId, isOpen } = useConversation();
  const session = useSession();

  const pusherKey = useMemo(() => {
    return session?.data?.user?.email;
  }, [session?.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const updatedConversationHandler = (updatedConversation: {
      id: string;
      messages: any[];
    }) => {
      setConversations((currentConversations) => {
        return currentConversations.map((currentConversation) => {
          if (currentConversation.id === updatedConversation.id) {
            return {
              ...currentConversation,
              messages: updatedConversation.messages,
            };
          }
          return currentConversation;
        });
      });
    };

    const newConversationHandler = (newConversation: FullConversationType) => {
      setConversations((currentConversations) => {
        if (find(currentConversations, { id: newConversation.id })) {
          return currentConversations;
        }

        return [newConversation, ...currentConversations];
      });
    };

    const deletedConversationHandler = (deletedConversation: {
      id: string;
    }) => {
      setConversations((prevConversations) => {
        return prevConversations.filter(
          (prevConversation) => prevConversation.id !== deletedConversation.id
        );
      });
    };

    const updatedUserHandler = (updatedUser: {
      id: string;
      name: string;
      image: string;
    }) => {
      setConversations((currentConversations) => {
        return currentConversations.map((currentConversation) => {
          if (currentConversation.isGroup) {
            return currentConversation;
          }

          let updatedUsers;
          if (currentConversation.userIds.includes(updatedUser.id)) {
            updatedUsers = currentConversation.users.map((user) => {
              if (user.id === updatedUser.id) {
                return {
                  ...user,
                  name: updatedUser.name,
                  image: updatedUser.image,
                };
              }

              return user;
            });
          } else {
            updatedUsers = currentConversation.users;
          }

          return { ...currentConversation, users: updatedUsers };
        });
      });

      setUsers((currentUsers) => {
        return currentUsers.map((user) => {
          if (user.id === updatedUser.id) {
            return {
              ...user,
              name: updatedUser.name,
              image: updatedUser.image,
            };
          }

          return user;
        });
      });

      if (updatedUser.id === initialCurrentUser?.id) {
        setInitialCurrentUser((prevCurrentUser) => {
          return {
            ...prevCurrentUser!,
            image: updatedUser.image,
            name: updatedUser.name,
          };
        });
      }
    };

    pusherClient.bind("conversation:update", updatedConversationHandler);
    pusherClient.bind("conversation:delete", deletedConversationHandler);
    pusherClient.bind("conversation:new", newConversationHandler);
    pusherClient.bind("user:update", updatedUserHandler);
    pusherClient.bind("testing", (data: string) => alert(data));

    return () => {
      pusherClient.unbind("conversation:update", updatedConversationHandler);
      pusherClient.unbind("conversation:delete", deletedConversationHandler);
      pusherClient.unbind("conversation:new", newConversationHandler);
      pusherClient.unbind("user:update", updatedUserHandler);
      pusherClient.unbind("testing", (data: string) => alert(data));

      pusherClient.unsubscribe(pusherKey);
    };
  }, [pusherKey]);

  return (
    <>
      <div
        className={clsx(
          "fixed w-full h-full mb-20 z-50 lg:mb-0 lg:w-80 lg:h-full lg:overflow-y-auto lg:flex flex-col border-r-[1px] border-slate-200 bg-white",
          isOpen ? "hidden" : "flex"
        )}
      >
        <div className="w-full border-b-[1px] border-slate-200">
          <div className="sm:py-0 h-full lg:py-4 max-[440px]:px-4 max-sm:px-8 relative">
            <div className="h-full w-full flex py-3 lg:py-4 gap-4 items-center sm:justify-center">
              <div className="w-[40px] h-[20px] sm:w-[50px] sm:h-[25px] relative">
                <Image alt="Logo" src={"/images/logo.png"} fill />
              </div>

              <h1 className="text-xl sm:text-2xl text-pink-500 font-nunito font-medium">
                ChatVibe
              </h1>
            </div>

            <Sheet defaultOpen={false}>
              <SheetTrigger className="lg:hidden">
                <div className="absolute w-10 h-10 rounded-full overflow-hidden right-4 sm:right-8 top-1/2 -translate-y-1/2">
                  <Avatar user={initialCurrentUser} />
                </div>
              </SheetTrigger>

              <ProfileDrawer user={initialCurrentUser} />
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
                  users={users}
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
          {conversations.map((conversation) => {
            let selected;
            if (conversationId === conversation.id) selected = true;
            else selected = false;
            if (conversation.isGroup === isGroup) {
              return (
                <ConversationBox
                  key={conversation.id}
                  item={conversation}
                  selected={selected}
                />
              );
            }
          })}
        </div>
      </div>
    </>
  );
};
