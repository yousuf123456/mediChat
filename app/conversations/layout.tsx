import React from "react";
import { ConversationList } from "./components/ConversationList";

import { currentUser } from "@clerk/nextjs/server";
import { Presence } from "../context/Presence";
import { PageLoading } from "../components/PageLoading";

export default async function conversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    return "Unauthorized";
  }

  return (
    <Presence>
      <div className="w-full h-full">
        <div className="h-full">
          <ConversationList
            currentUser={{
              name: user.username || user.firstName || user.lastName,
              emailAddress: user.emailAddresses[0]!.emailAddress,
              id: user.id,
              imageUrl: user.imageUrl,
            }}
          />
          {children}
        </div>
      </div>
    </Presence>
  );
}
