import { Avatar } from "@/app/components/sidebar/Avatar";
import { FullConversationType } from "@/app/types";
import React, { useCallback, useMemo, useState, useEffect } from "react";

import { useOtherUser } from "../../hooks/useOtherUser";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GroupAvatar } from "@/app/components/sidebar/GroupAvatar";
import { format } from "date-fns";
import { ActiveDot } from "@/app/components/sidebar/activeDot";
import { useActiveList } from "@/app/hooks/useActiveList";
import { find } from "lodash";
import { cn } from "@/lib/utils";

interface conversationBoxProps {
  selected: boolean;
  item: FullConversationType;
}

export const ConversationBox: React.FC<conversationBoxProps> = ({
  item,
  selected,
}) => {
  const [count, setCount] = useState(0);

  const otherUser = useOtherUser(item.users);
  const router = useRouter();

  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const handleClick = useCallback(() => {
    router.push(`/conversations/${item.id}`);
  }, [router, item.id]);

  const lastMessage = useMemo(() => {
    const messages = item.messages || [];

    return messages[messages.length - 1];
  }, [item.messages]);

  const lastMessageText = useMemo(() => {
    let lastMessageText;
    if (lastMessage) {
      if (lastMessage.image) {
        return (lastMessageText = `${lastMessage?.sender?.name} sent an image`);
      }
    }

    if (!lastMessage) {
      return (lastMessageText = "Just created a conversation");
    }

    return (lastMessageText = lastMessage.body);
  }, [lastMessage]);

  const session = useSession();
  const userEmail = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    if (!userEmail) {
      return false;
    }

    const myEmailInSeen = lastMessage.seen.filter(
      (user) => user.email === userEmail
    );

    if (myEmailInSeen.length === 0) {
      return false;
    }

    return true;
  }, [lastMessage, userEmail]);

  const unseenMessageCount = useMemo(() => {
    let count = 0;

    if (userEmail) {
      for (let i = item.messages.length - 1; i >= 0; i--) {
        const message = item.messages[i];
        if (find(message.seen, { email: userEmail })) {
          break;
        }

        count += 1;
      }
    }

    return count;
  }, [userEmail, item]);

  return (
    <div
      className={cn(
        "relative flex flex-row gap-4 px-3 py-2 items-center bg-white hover:bg-pink-100 transition-all cursor-pointer",
        selected && "bg-pink-400 lg:hover:bg-pink-400"
      )}
      onClick={handleClick}
    >
      {item.isGroup ? (
        <div className="relative w-14 h-14 rounded-full overflow-hidden">
          <GroupAvatar users={item.users} size="h-5 w-5" />
        </div>
      ) : (
        <div className="relative w-12 h-12">
          {isActive && <ActiveDot size="h-3 w-3" />}
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Avatar user={otherUser} />
          </div>
        </div>
      )}

      <div className="flex flex-col justify-center items-start">
        <p
          className={clsx(
            "text-md font-nunito font-medium",
            selected ? "text-white" : "text-black"
          )}
        >
          {item.isGroup ? item.name : otherUser.name}
        </p>

        <p
          className={cn(
            "text-sm font-white font-roboto font-extralight line-clamp-1",
            hasSeen ? "opacity-60" : "opacity-100",
            selected ? "text-white opacity-100" : " text-black"
          )}
        >
          {lastMessageText}
        </p>
      </div>

      {lastMessage?.createdAt && (
        <p
          className={clsx(
            "text-xs font-light absolute top-1 right-2",
            unseenMessageCount !== 0 && !selected
              ? "text-pink-500 font-medium opacity-100"
              : selected
              ? "text-white"
              : "text-black opacity-80"
          )}
        >
          {format(new Date(lastMessage?.createdAt!), "h:mm a")}
        </p>
      )}

      {unseenMessageCount !== 0 && (
        <div
          className={cn(
            "absolute flex justify-center items-center right-2 bottom-2 w-5 h-5 bg-white rounded-full",
            !selected && "bg-pink-500"
          )}
        >
          <p
            className={cn(
              "text-xs font-roboto text-pink-500",
              !selected && "text-white"
            )}
          >
            {unseenMessageCount}
          </p>
        </div>
      )}
    </div>
  );
};
