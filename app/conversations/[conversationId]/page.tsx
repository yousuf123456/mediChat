"use client";

import { EmptyState } from "@/app/(site)/components/EmptyState";
import React, { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

import Loading from "./loading";
import { api } from "@/convex/_generated/api";
import { User } from "@clerk/nextjs/server";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import { useInView } from "react-intersection-observer";
import { MessageBox } from "./components/MessageBox";
import usePresence from "@/app/hooks/usePresence";
import { PageLoading } from "@/app/components/PageLoading";
import { getAppBaseUrl } from "@/app/utils/getAppBaseUrl";

export default function ConversationIdPage() {
  const { user } = useUser();
  const params = useParams<{ conversationId: string }>();
  const conversationId = params?.conversationId as string;

  const [otherUsers, setOtherUsers] = useState<User[] | undefined>();
  const conversation = useQuery(api.conversation.get, { conversationId });
  const {
    results: messages,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.conversation.getMessages,
    { conversationId },
    { initialNumItems: 25 }
  );

  const appUrl = getAppBaseUrl();
  useEffect(() => {
    fetch(`${appUrl}/api/getUsers`, {
      method: "POST",
      body: JSON.stringify({
        conversationId: conversationId,
      }),
    }).then((res) => res.json().then((data) => setOtherUsers(data)));

    if (!user || status === "LoadingFirstPage" || !(messages.length > 0))
      return;
    if (messages[0].seenUserIds.includes(user.id)) return;

    seenMessage({
      messageId: messages[0]._id,
      prevSeenUserIds: messages[0].seenUserIds,
    });
  }, []);

  const seenMessage = useMutation(api.conversation.seenMessage);
  useEffect(() => {
    if (!user || status === "LoadingFirstPage" || !(messages.length > 0))
      return;
    if (messages[0].seenUserIds.includes(user.id)) return;

    seenMessage({
      messageId: messages[0]._id,
      prevSeenUserIds: messages[0].seenUserIds,
    });
  }, [messages]);

  const { ref, inView } = useInView({ threshold: 1 });
  useEffect(() => {
    if (inView) loadMore(25);
  }, [inView, ref]);

  const [_, othersPresence, updateMyPresence] = usePresence<{
    typing: boolean;
  }>(conversationId, user?.id || "unknown", {
    typing: false,
  });

  if (
    !otherUsers ||
    status === "LoadingFirstPage" ||
    conversation === undefined
  ) {
    return <Loading />;
  }

  if (conversation === null) {
    return (
      <div className="h-full w-full lg:pl-80">
        <EmptyState />
      </div>
    );
  } else {
    return (
      <div className="h-full w-full lg:pl-80 relative ">
        <div className="flex flex-col h-full">
          <Header
            conversation={conversation}
            otherUsers={otherUsers}
            othersPresence={othersPresence}
          />

          {/* Body  */}
          <div className="w-full h-full bg-zinc-50 flex flex-col-reverse flex-1 max-h-full overflow-y-auto scrollbar-thin scrollbar-track-white scrollbar-thumb-zinc-300 px-2 py-6 sm:px-4 sm:py-8">
            {messages.map((message, index) => {
              const sender =
                otherUsers.filter((user) => user.id === message.senderId)[0] ||
                user;
              const seenUsersNamesList = otherUsers
                .filter((user) => message.seenUserIds.includes(user.id))
                .map((filteredUsers) => filteredUsers.firstName)
                .join(", ");

              if (index === messages.length - 1) {
                return (
                  <MessageBox
                    ref={ref}
                    key={index}
                    sender={sender}
                    message={message}
                    isLast={index === 0}
                    iAmSender={sender.id === user?.id}
                    seenUsersNamesList={seenUsersNamesList}
                  />
                );
              }

              return (
                <MessageBox
                  key={index}
                  sender={sender}
                  message={message}
                  isLast={index === 0}
                  iAmSender={sender.id === user?.id}
                  seenUsersNamesList={seenUsersNamesList}
                />
              );
            })}

            {status === "Exhausted" && messages.length > 25 && (
              <p className="w-full text-center text-sm text-zinc-700">
                No More Messages
              </p>
            )}
          </div>

          <Footer updateMyPresence={updateMyPresence} />
        </div>
      </div>
    );
  }
}
