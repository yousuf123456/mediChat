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
import { Doc } from "@/convex/_generated/dataModel";
import { useAction, usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { User } from "@clerk/nextjs/dist/types/server";
import { useUser } from "@clerk/nextjs";
import { ConversationBoxLoading } from "./ConversationBoxLoading";

interface conversationBoxProps {
  selected: boolean;
  item: Doc<"conversations">;
}

export const ConversationBox: React.FC<conversationBoxProps> = ({
  item,
  selected,
}) => {
  const [otherUsers, setOtherUsers] = useState<User[] | undefined>(undefined);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/getUsers`, {
      method: "POST",
      body: JSON.stringify({
        conversationId: item._id,
      }),
      cache: "force-cache",
    }).then(async (res) => setOtherUsers(await res.json()));
  }, []);

  const { results: messages } = usePaginatedQuery(
    api.conversation.getMessages,
    {
      conversationId: item._id,
    },
    { initialNumItems: 5 }
  );

  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${item._id}`);
  }, [router, item._id]);

  const lastMessage = useMemo(() => {
    if (!messages) return;

    return messages[0];
  }, [messages]);

  const lastMessageText = useMemo(() => {
    let lastMessageText;
    if (lastMessage) {
      if (lastMessage.image) {
        return (lastMessageText = `${lastMessage.senderName} sent an image`);
      }
    }

    if (!lastMessage) {
      return (lastMessageText = "Just created a conversation");
    }

    return (lastMessageText = lastMessage.body);
  }, [lastMessage]);

  const { user, isLoaded } = useUser();
  const currentUserId = useMemo(() => {
    return user?.id;
  }, [user, isLoaded]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    if (!currentUserId) {
      return false;
    }

    const myEmailInSeen = lastMessage.seenUserIds.filter(
      (userId) => userId === currentUserId
    );

    if (myEmailInSeen.length === 0) {
      return false;
    }

    return true;
  }, [lastMessage, currentUserId]);

  const unseenMessageCount = useMemo(() => {
    if (!lastMessage || messages?.length === 0) return 0;

    let count = 0;

    if (currentUserId && messages) {
      for (let i = 0; i <= messages.length - 1; i++) {
        const message = messages[i];
        if (
          message.seenUserIds.filter((userId) => userId === currentUserId)
            .length > 0
        ) {
          break;
        }

        count += 1;
      }
    }

    return count;
  }, [currentUserId, messages]);

  if (!otherUsers || !messages) {
    return <ConversationBoxLoading />;
  }

  return (
    <div
      className={cn(
        "relative flex flex-row gap-4 px-3 py-2 items-center bg-white hover:bg-zinc-50 transition-all cursor-pointer",
        selected && "bg-zinc-50"
      )}
      onClick={handleClick}
    >
      {item.isGroup ? (
        <div className="relative w-14 h-14 rounded-full overflow-hidden">
          <GroupAvatar users={otherUsers || []} size="h-5 w-5" />
        </div>
      ) : (
        <div className="relative w-10 h-10">
          {/* {isActive && <ActiveDot size="h-3 w-3" />} */}
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Avatar image={otherUsers[0]?.imageUrl} />
          </div>
        </div>
      )}

      <div className="flex flex-col justify-center items-start">
        <p
          className={clsx(
            "text-md font-nunito font-medium line-clamp-1 max-w-[168px]",
            "text-black"
          )}
        >
          {item.isGroup ? item.name : otherUsers[0]?.firstName}
        </p>

        <p
          className={cn(
            "text-sm font-white font-roboto font-extralight line-clamp-1 max-w-[200px] text-black",
            hasSeen ? "opacity-70" : "opacity-100"
            // selected && "opacity-100"
          )}
        >
          {lastMessageText}
        </p>
      </div>

      {lastMessage?._creationTime && (
        <p
          className={clsx(
            "text-xs font-light absolute top-1 right-2",
            unseenMessageCount !== 0 && !selected
              ? "text-pink-500 font-medium opacity-100"
              : "text-black opacity-80"
          )}
        >
          {format(new Date(lastMessage?._creationTime!), "h:mm a")}
        </p>
      )}

      {unseenMessageCount !== 0 && (
        <div
          className={cn(
            "absolute flex justify-center items-center right-2 bottom-2 w-5 h-5 rounded-full bg-pink-500"
          )}
        >
          <p className={cn("text-xs font-roboto text-white")}>
            {unseenMessageCount}
          </p>
        </div>
      )}
    </div>
  );
};
