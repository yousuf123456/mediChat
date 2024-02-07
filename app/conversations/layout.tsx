import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { ConversationList } from "./components/ConversationList";
import { getConversations } from "../actions/getConversations";
import { getUsers } from "../actions/getUsers";
import { getCurrentUser } from "../actions/getCurrentUser";

export default async function conversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();
  const users = await getUsers();
  const currentUser = await getCurrentUser();

  return (
    <div className="w-full h-full">
      <div className="h-full">
        <ConversationList
          initialItems={conversations!}
          initialUsers={users}
          currentUser={currentUser}
        />
        {children}
      </div>
    </div>
  );
}
